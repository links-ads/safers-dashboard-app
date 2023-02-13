import React, { useState, useEffect, useCallback } from 'react';

import _ from 'lodash';
import PropTypes from 'prop-types';
import Pagination from 'rc-pagination';
import { useDispatch, useSelector } from 'react-redux';
import { Row } from 'reactstrap';

import { PAGE_SIZE } from 'store/insitu/constants';
import {
  setCurrentPage,
  setCameraFavorite,
  setPaginatedAlerts,
  setFilteredCameraAlerts,
  fetchCameras,
  filteredCameraAlertsSelector,
  paginatedCameraAlertsSelector,
  cameraListSelector,
  cameraInfoSelector,
  cameraCurrentPageSelector,
} from 'store/insitu/insitu.slice';

import Alert from './Alert';
import { GeoJsonPinLayer } from '../../../components/BaseMap/GeoJsonPinLayer';
import { MAP_TYPES } from '../../../constants/common';
import {
  getViewState,
  getAlertIconColorFromContext,
} from '../../../helpers/mapHelper';

const AlertList = ({
  alertId,
  viewState,
  setAlertId,
  currentZoomLevel,
  isViewStateChanged,
  setViewState,
  setIconLayer,
  setHoverInfo,
  setIsViewStateChanged,
  hideTooltip,
}) => {
  // const {
  //   paginatedAlerts,
  //   currentPage,
  //   filteredAlerts,
  //   cameraList,
  //   cameraInfo,
  // } = useSelector(state => state.inSituAlerts);
  const filteredAlerts = useSelector(filteredCameraAlertsSelector);
  const paginatedAlerts = useSelector(paginatedCameraAlertsSelector);
  const cameraList = useSelector(cameraListSelector);
  const cameraInfo = useSelector(cameraInfoSelector);
  const currentPage = useSelector(cameraCurrentPageSelector);

  const [selCam, setsSelCam] = useState(undefined);

  const dispatch = useDispatch();

  const getIconLayer = useCallback(
    alerts => {
      return new GeoJsonPinLayer({
        data: alerts,
        dispatch,
        setViewState,
        getPosition: feature => feature.geometry.coordinates,
        getPinColor: feature =>
          getAlertIconColorFromContext(MAP_TYPES.IN_SITU, feature),
        icon: 'camera',
        iconColor: '#ffffff',
        clusterIconSize: 35,
        getPinSize: () => 35,
        pixelOffset: [-18, -18],
        pinSize: 25,
        onGroupClick: true,
        onPointClick: true,
      });
    },
    [dispatch, setViewState],
  );

  useEffect(() => {
    if (selCam && cameraInfo) {
      !_.isEqual(viewState?.midPoint, cameraInfo?.geometry?.coordinates) ||
      isViewStateChanged
        ? setViewState(
            getViewState(
              cameraInfo?.geometry?.coordinates,
              currentZoomLevel,
              cameraInfo,
              setHoverInfo,
              setIsViewStateChanged,
            ),
          )
        : setHoverInfo({
            object: { properties: cameraInfo, geometry: cameraInfo?.geometry },
            picked: true,
          });
      setIconLayer(getIconLayer(cameraList.features, MAP_TYPES.IN_SITU));
    }
  }, [
    cameraInfo,
    cameraList.features,
    currentZoomLevel,
    getIconLayer,
    isViewStateChanged,
    selCam,
    setHoverInfo,
    setIconLayer,
    setIsViewStateChanged,
    setViewState,
    viewState,
  ]);

  const setFavorite = id => {
    const alerts = _.cloneDeep(filteredAlerts);
    const selectedAlert = alerts.find(alert => alert.id === id);
    selectedAlert.favorite = !selectedAlert.favorite;
    const updatedAlerts = alerts.map(alert =>
      alert.id === id ? selectedAlert : alert,
    );

    dispatch(setFilteredCameraAlerts(updatedAlerts));

    dispatch(
      setCameraFavorite({ alertId: id, isFavorite: selectedAlert.favorite }),
    )
      .then(() => {
        const to = PAGE_SIZE * currentPage;
        const from = to - PAGE_SIZE;
        dispatch(setPaginatedAlerts(updatedAlerts.slice(from, to)));

        return;
      })
      .catch(error => console.log(error));
  };

  const setSelectedAlert = id => {
    if (id) {
      setAlertId(id);
      let alertsToEdit = _.cloneDeep(filteredAlerts);
      let selectedAlert = _.find(alertsToEdit, { id });
      let camera = _.find(cameraList.features, {
        properties: { id: selectedAlert.camera_id },
      });
      const selectedCamera = { ...camera };
      selectedAlert.isSelected = true;
      selectedCamera.isSelected = true;
      setsSelCam(selectedCamera);
      dispatch(fetchCameras(selectedAlert.camera_id));
    } else {
      setAlertId(undefined);
      setIconLayer(getIconLayer(cameraList.features, MAP_TYPES.IN_SITU));
    }
  };

  const updatePage = page => {
    setAlertId(undefined);
    setIconLayer(getIconLayer(cameraList.features, MAP_TYPES.IN_SITU));
    dispatch(setCurrentPage(page));
    const to = PAGE_SIZE * page;
    const from = to - PAGE_SIZE;
    hideTooltip();
    dispatch(setPaginatedAlerts(_.cloneDeep(filteredAlerts.slice(from, to))));
  };

  return (
    <>
      <Row>
        {paginatedAlerts.map(alert => (
          <Alert
            key={alert.id}
            card={alert}
            setSelectedAlert={setSelectedAlert}
            setFavorite={setFavorite}
            alertId={alertId}
          />
        ))}
      </Row>
      <Row className="text-center">
        <Pagination
          pageSize={PAGE_SIZE}
          onChange={updatePage}
          current={currentPage}
          total={filteredAlerts.length}
        />
      </Row>
    </>
  );
};

AlertList.propTypes = {
  alertId: PropTypes.any,
  viewState: PropTypes.any,
  currentZoomLevel: PropTypes.any,
  isViewStateChanged: PropTypes.any,
  setViewState: PropTypes.func,
  setAlertId: PropTypes.func,
  setIconLayer: PropTypes.func,
  setHoverInfo: PropTypes.func,
  hideTooltip: PropTypes.func,
  setIsViewStateChanged: PropTypes.func,
};
export default AlertList;
