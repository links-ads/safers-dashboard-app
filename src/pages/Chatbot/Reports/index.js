import React, { useEffect, useState, useCallback } from 'react';

import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { Row, Col, Button } from 'reactstrap';
import toastr from 'toastr';

import { useMap } from 'components/BaseMap/MapContext';
import 'toastr/build/toastr.min.css';
import 'rc-pagination/assets/index.css';
import { MAP_TYPES } from 'constants/common';
import useInterval from 'customHooks/useInterval';
import { getBoundingBox, getViewState, getIconLayer } from 'helpers/mapHelper';
import { dateRangeSelector } from 'store/common.slice';
import {
  fetchReports,
  resetReportResponseState,
  allReportsSelector,
  filteredReportsSelector,
  reportsSuccessSelector,
  reportsBoundingBoxSelector,
} from 'store/reports.slice';
import { defaultAoiSelector } from 'store/user.slice';

import MapSection from './Components/Map';
import ReportList from './Components/ReportList';
import SortSection from './Components/SortSection';

const Reports = ({ pollingFrequency }) => {
  const { viewState, setViewState } = useMap();

  const defaultAoi = useSelector(defaultAoiSelector);
  const orgReportList = useSelector(allReportsSelector);
  const filteredReports = useSelector(filteredReportsSelector);
  const success = useSelector(reportsSuccessSelector);
  const gBbox = useSelector(reportsBoundingBoxSelector);

  const dateRange = useSelector(dateRangeSelector);

  const { t } = useTranslation();

  const [reportId, setReportId] = useState(undefined);
  const [iconLayer, setIconLayer] = useState(undefined);
  const [boundingBox, setBoundingBox] = useState(gBbox);
  const [reportParams, setReportParams] = useState({});

  const dispatch = useDispatch();

  const allReports = filteredReports || orgReportList;

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
      dispatch(fetchReports({ options: params }));
      return params;
    });
  }, [dispatch, boundingBox, setReportParams, dateRange]);

  useInterval(
    () => {
      dispatch(fetchReports({ options: reportParams, isPoling: true }));
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
        getIconLayer(reshapedReports, MAP_TYPES.REPORTS, 'report', {
          id: reportId,
        }),
      );
    }
  }, [allReports, reportId]);

  const getReportsByArea = () => {
    setBoundingBox(
      getBoundingBox(
        [viewState.longitude, viewState.latitude],
        viewState.zoom,
        viewState.width,
        viewState.height,
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
              <ReportList reportId={reportId} setReportId={setReportId} />
            </Col>
          </Row>
        </Col>
        <Col xl={7} className="mx-auto">
          <MapSection
            iconLayer={iconLayer}
            getReportsByArea={getReportsByArea}
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
