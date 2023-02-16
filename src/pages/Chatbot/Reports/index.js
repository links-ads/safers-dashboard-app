import React, { useEffect, useState, useCallback } from 'react';

import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { Row, Col, Button } from 'reactstrap';
import toastr from 'toastr';

import { useMap } from 'components/BaseMap/MapContext';

import 'toastr/build/toastr.min.css';
import 'rc-pagination/assets/index.css';
import MapSection from './Components/Map';
import ReportList from './Components/ReportList';
import SortSection from './Components/SortSection';
import { MAP_TYPES } from '../../../constants/common';
import useInterval from '../../../customHooks/useInterval';
import {
  getBoundingBox,
  getViewState,
  getIconLayer,
} from '../../../helpers/mapHelper';
import {
  getAllReports,
  resetReportResponseState,
} from '../../../store/reports/action';

const Reports = ({ pollingFrequency }) => {
  const { viewState, setViewState } = useMap();
  const defaultAoi = useSelector(state => state.user.defaultAoi);
  const {
    allReports: OrgReportList,
    success,
    filteredReports,
    boundingBox: gBbox,
    mapFilter,
  } = useSelector(state => state.reports);
  const dateRange = useSelector(state => state.common.dateRange);

  const { t } = useTranslation();

  const [reportId, setReportId] = useState(undefined);
  const [iconLayer, setIconLayer] = useState(undefined);
  const [boundingBox, setBoundingBox] = useState(gBbox);
  const [newWidth, setNewWidth] = useState(600);
  const [newHeight, setNewHeight] = useState(600);
  const [reportParams, setReportParams] = useState({});

  const dispatch = useDispatch();

  const allReports = filteredReports || OrgReportList;

  useEffect(() => {
    setReportId(undefined);

    setReportParams(previous => {
      const params = {
        ...previous,
        bbox: boundingBox?.toString(),
        default_date: false,
        default_bbox: !boundingBox,
        ...(dateRange
          ? {
              start: dateRange[0],
              end: dateRange[1],
            }
          : {}),
      };
      dispatch(getAllReports(params));
      return params;
    });
  }, [dispatch, boundingBox, setReportParams, dateRange]);

  useInterval(
    () => {
      dispatch(getAllReports(reportParams, true));
    },
    pollingFrequency,
    [reportParams],
  );

  useEffect(() => {
    if (success?.detail) {
      toastr.success(success.detail, '');
    }
    dispatch(resetReportResponseState());
  }, [dispatch, success]);

  useEffect(() => {
    if (allReports.length > 0) {
      const reshapedReports = allReports.map(report => {
        const { report_id: id, ...rest } = report;
        return { id, ...rest };
      });

      setIconLayer(
        getIconLayer(
          reshapedReports,
          MAP_TYPES.REPORTS,
          'report',
          dispatch,
          setViewState,
          {
            id: reportId,
          },
        ),
      );
    }
  }, [allReports, dispatch, reportId, setViewState]);

  const getReportsByArea = () => {
    setBoundingBox(
      getBoundingBox(
        [viewState.longitude, viewState.latitude],
        viewState.zoom,
        newWidth,
        newHeight,
      ),
    );
  };

  const handleResetAOI = useCallback(() => {
    setBoundingBox(undefined);
    setViewState(
      getViewState(
        defaultAoi.features[0].properties.midPoint,
        defaultAoi.features[0].properties.zoomLevel,
      ),
    );
  }, [defaultAoi.features, setViewState]);

  const handleClick = info => {
    const { id } = info?.object?.properties ?? {};
    setReportId(reportId === id ? undefined : id);
  };

  return (
    <div className="mx-2">
      <Row className="justify-content-end mb-2">
        <Col xl={7} className="d-flex">
          <Button color="link" onClick={handleResetAOI} className="p-0">
            {t('default-aoi', { ns: 'common' })}
          </Button>
        </Col>
      </Row>
      <Row>
        <Col xl={5}>
          <SortSection
            t={t}
            boundingBox={boundingBox}
            mapFilter={{
              midPoint: [viewState.longitude, viewState.latitude],
              currentZoomLevel: viewState.zoom,
            }}
          />
          <Row>
            <Col xl={12} className="px-3">
              <ReportList
                reportId={reportId}
                currentZoomLevel={viewState.zoom}
                setViewState={setViewState}
                setReportId={setReportId}
                setIconLayer={setIconLayer}
              />
            </Col>
          </Row>
        </Col>
        <Col xl={7} className="mx-auto">
          <MapSection
            iconLayer={iconLayer}
            getReportsByArea={getReportsByArea}
            setNewWidth={setNewWidth}
            setNewHeight={setNewHeight}
            onClick={handleClick}
          />
        </Col>
      </Row>
    </div>
  );
};

Reports.propTypes = {
  pollingFrequency: PropTypes.number,
};

export default Reports;
