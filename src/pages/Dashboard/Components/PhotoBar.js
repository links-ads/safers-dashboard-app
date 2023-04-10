import React, { useEffect } from 'react';

import PropTypes from 'prop-types';
import { withTranslation } from 'react-i18next';
import { useSelector, useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import { Container, Card, Row } from 'reactstrap';

import { fetchCameraAlerts, allInSituAlertsSelector } from 'store/insitu.slice';
import { formatDate } from 'utility';

const NUMBER_OF_PHOTOS = 8;

const PhotoBar = ({ t }) => {
  const allPhotos = useSelector(allInSituAlertsSelector);

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(
      fetchCameraAlerts({
        type: undefined,
        order: '-date',
        camera_id: undefined,
        bbox: undefined,
        default_date: false,
        default_bbox: true,
      }),
    );
  }, [dispatch]);

  return (
    <Container
      fluid="true"
      className="mx-8 flex-stretch align-content-center flex-wrap"
    >
      <Card className="card">
        <Row className="align-self-baseline alert-title mx-3">
          <Link to="/insitu-alerts">
            <p>
              {t('in-situ-cameras', { ns: 'common' })}{' '}
              <i className="bx bx-image float-right"></i>
            </p>
          </Link>
        </Row>
        <Row xs={1} sm={2} md={3} lg={4}>
          {allPhotos.length === 0 ? (
            <div className="card noshadow mx-5">{t('No photos in AOI')}</div>
          ) : null}
          {allPhotos.slice(0, NUMBER_OF_PHOTOS).map(photo => {
            return (
              <div key={photo.id} className="p-3 my-3 ml-3">
                <img
                  src={photo.url}
                  width="100%"
                  height="120px"
                  alt={`Camera ${photo.camera_id}`}
                />

                <div>{photo.camera_id}</div>
                <div>{formatDate(photo.timestamp)}</div>
              </div>
            );
          })}
        </Row>
      </Card>
    </Container>
  );
};

PhotoBar.propTypes = {
  t: PropTypes.func,
};

export default withTranslation(['dashboard'])(PhotoBar);
