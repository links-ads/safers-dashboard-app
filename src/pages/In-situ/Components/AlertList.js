import _ from 'lodash';
import Pagination from 'rc-pagination';
import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Row } from 'reactstrap';
import { getIconLayer } from '../../../helpers/mapHelper';
import { setAlertId, setCurrentPage, setInSituFavoriteAlert, setHoverInfo, setIconLayer, setMidpoint, setPaginatedAlerts, setZoomLevel, getCamera } from '../../../store/insitu/action';
import { PAGE_SIZE, SET_FAV_INSITU_ALERT_SUCCESS } from '../../../store/insitu/types';
import Alert from './Alert';

const AlertList = () => {
  const { paginatedAlerts, currentPage, filteredAlerts, alertId, cameraList, cameraInfo } = useSelector(state => state.inSituAlerts);
  const [selCam, setsSelCam] = useState(undefined);

  const dispatch = useDispatch();
  

  useEffect(() => {
    if(selCam){
      dispatch(setIconLayer(getIconLayer(selCam)));
      dispatch(setHoverInfo({ object: cameraInfo, coordinate: selCam.geometry.coordinates, isEdit: false }));
    }

  }, [cameraInfo]);

  const setFavorite = (id) => {
    const selectedAlert = _.find(filteredAlerts, { id });
    dispatch(setInSituFavoriteAlert(id, !selectedAlert.favorite)).then((result) => {
      if (result.type === SET_FAV_INSITU_ALERT_SUCCESS) {
        selectedAlert.favorite = !selectedAlert.favorite;
        const to = PAGE_SIZE * currentPage;
        const from = to - PAGE_SIZE;
        dispatch(setPaginatedAlerts(_.cloneDeep(filteredAlerts.slice(from, to))));
      }
    })
    
    
  }
  const hideTooltip = (e) => {
    if (e && e.viewState) {
      dispatch(setMidpoint([e.viewState.longitude, e.viewState.latitude]));
      dispatch(setZoomLevel(e.viewState.zoom));
    }
    dispatch(setHoverInfo({}));
  };

  const setSelectedAlert = (id) => {
    if (id) {
      if (id === alertId) {
        hideTooltip();
      }
      dispatch(setAlertId(id));
      let alertsToEdit = _.cloneDeep(filteredAlerts);
      let selectedAlert = _.find(alertsToEdit, { id });
      let camera = _.find(cameraList.features, { properties: { id:selectedAlert.camera_id } });
      selectedAlert.isSelected = true;
      setsSelCam(camera);
      dispatch(getCamera(selectedAlert.camera_id));
    } else {
      dispatch(setAlertId(undefined));
      dispatch(setIconLayer(getIconLayer(filteredAlerts)));
    }
  }
  const updatePage = page => {
    dispatch(setAlertId(undefined));
    dispatch(setIconLayer(getIconLayer(filteredAlerts)));
    dispatch(setCurrentPage(page));
    const to = PAGE_SIZE * page;
    const from = to - PAGE_SIZE;
    hideTooltip();
    dispatch(setPaginatedAlerts(_.cloneDeep(filteredAlerts.slice(from, to))));
  };
  
  return(
    <>
      <Row>
        {
          paginatedAlerts.map((alert, index) => <Alert
            key={index}
            card={alert}
            setSelectedAlert={setSelectedAlert}
            setFavorite={setFavorite}
            alertId={alertId} />)
        }
      </Row>
      <Row className='text-center'>
        <Pagination
          pageSize={PAGE_SIZE}
          onChange={updatePage}
          current={currentPage}
          total={filteredAlerts.length}
        />
      </Row>
    </>)
}

export default AlertList;
