import React from 'react';

import PropTypes from 'prop-types';
import { withTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { Card, Row, Col, CardText, CardSubtitle, Button } from 'reactstrap';

import { MAP_TYPES } from '../../../../../constants/common';
import { getIconLayer, getViewState } from '../../../../../helpers/mapHelper';
import { formatDate } from '../../../../../store/utility';
import MapSection from '../Components/Map';

const SummaryContainer = ({ reportDetail, t }) => {
  const defaultAoi = useSelector(state => state.user.defaultAoi);

  const navigate = useNavigate();

  const getStringOrUknownText = text => {
    if (!text || text === '') {
      return t('Unknown');
    } else {
      return `${t(text)}`;
    }
  };

  if (!reportDetail) return null;

  const iconLayer = getIconLayer([reportDetail], MAP_TYPES.REPORTS, 'report');
  const viewState = getViewState(
    reportDetail.location,
    defaultAoi.features[0].properties.zoomLevel,
  );

  const dateDisplay = reportDetail?.timestamp
    ? formatDate(reportDetail.timestamp)
    : t('Unknown');
  return (
    <>
      <Row>
        <Col className="">
          <Button
            onClick={() => navigate('/chatbot?tab=4')}
            className="back-arrow px-0 py-0"
          >
            <i className="bx bx-arrow-back fa-2x"></i>
          </Button>
        </Col>
      </Row>

      <Col md={12} className="mb-3">
        <span className="event-alert-title opacity-75">
          {' '}
          {t('Results')} &gt;
        </span>{' '}
        <span className="event-alert-title">
          {getStringOrUknownText(reportDetail.name)}
        </span>
      </Col>

      <Col md={3}>
        <Col className="ms-2 report-info">
          <Row className="mb-3">
            <span className="text-title">
              {getStringOrUknownText(reportDetail.name)}
            </span>
          </Row>
          <Row className="my-2">
            <span>
              {t('Hazard Type')}: {getStringOrUknownText(reportDetail.hazard)}
            </span>
          </Row>
          <Row className="my-2">
            <span>
              {t('Status', { ns: 'reports' })} :
              {getStringOrUknownText(reportDetail.status)}
            </span>
          </Row>
          <Row className="my-2">
            <span>
              {t('Category', { ns: 'reports' })} :{' '}
              {reportDetail.categories.length > 0
                ? reportDetail.categories.join(', ')
                : t('Unknown')}
            </span>
          </Row>
          <Row className="my-2">
            <Col lg={3} id="cat-info">
              <div>
                {<span>{`${t('Details')} : `}</span>}
                {reportDetail.categories_info.length > 0
                  ? reportDetail.categories_info.map(info => (
                    <span key={info}>{getStringOrUknownText(info)}</span>
                  ))
                  : t('Unknown')}
              </div>
            </Col>
            <Col
              lg={9}
              className="mt-lg-0 ms-lg-0 mt-sm-2 ms-sm-2"
              aria-labelledby="cat-info"
            ></Col>
          </Row>
          <Row className="mt-3 mb-2">
            <span>{t('Description')}:</span>
          </Row>
          <Row>
            <span>{getStringOrUknownText(reportDetail.description)}</span>
          </Row>
        </Col>
      </Col>
      <Col md={3}>
        <Card className="card-weather px-0 report-detail">
          <Col className="ps-3 pt-3">
            <Row>
              <Col>
                <span className="font-size-18">{t('Username')}</span> :{' '}
                {getStringOrUknownText(reportDetail.reporter?.name)}
              </Col>
            </Row>
            <Row>
              <Col>
                <span className="font-size-18">
                  {t('Organization', { ns: 'common' })}
                </span>{' '}
                : {getStringOrUknownText(reportDetail.reporter?.organization)}
              </Col>
            </Row>
          </Col>
          <hr></hr>
          <Col className="ps-3 mb-0">
            <Row className="mb-1">
              <Col className="font-size-18">
                {t('Location', { ns: 'common' })}:{' '}
              </Col>
            </Row>
            <Row className="mt-2">
              <Col md={1} className="d-flex">
                <i className="fa fa-map-marker my-auto"></i>
              </Col>
              <Col md={10}>
                <CardSubtitle className="my-auto font-size-15">
                  {reportDetail.location?.join(', ')}
                </CardSubtitle>
              </Col>
            </Row>
          </Col>
          <hr></hr>
          <Col className="ps-3">
            <Row className="mb-1">
              <Col className="font-size-18">{t('Date of Report')}: </Col>
            </Row>
            <Row>
              <Col md={1} className="d-flex">
                <i className="fa fa-calendar my-auto"></i>
              </Col>
              <Col md={10}>
                <CardSubtitle className="my-auto font-size-15">
                  {dateDisplay}
                </CardSubtitle>
              </Col>
            </Row>
          </Col>
          <hr></hr>
          <Col className="ps-3 pb-5">
            <Row>
              <Col>
                <CardText>
                  {t('Source', { ns: 'common' })}: {reportDetail.source}
                </CardText>
              </Col>
            </Row>
            <Row>
              <Col>
                <CardText>
                  {t('Report Privacy')}: {reportDetail.visibility}
                </CardText>
              </Col>
            </Row>
            <Row>
              <Col>
                <CardText>
                  {t('Report ID')}: {reportDetail.report_id}
                </CardText>
              </Col>
            </Row>
            <Row>
              <Col>
                <CardText>
                  {t('Mission ID')}: {reportDetail.mission_id}
                </CardText>
              </Col>
            </Row>
          </Col>
        </Card>
      </Col>
      <Col className="mx-auto">
        <MapSection viewState={viewState} iconLayer={iconLayer} />
      </Col>
    </>
  );
};

SummaryContainer.propTypes = {
  reportDetail: PropTypes.object,
  t: PropTypes.func,
};

export default withTranslation(['reports'])(SummaryContainer);
