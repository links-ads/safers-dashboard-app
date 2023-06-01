import React, { useEffect, useState } from 'react';

import PropTypes from 'prop-types';
import { withTranslation } from 'react-i18next';
import { useSelector, useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import { Container, Card, Row, Col, Input } from 'reactstrap';

import {
  fetchCameraAlerts,
  fetchCameraSources,
  allInSituAlertsSelector,
  cameraSourcesSelector,
} from 'store/insitu.slice';
import { formatDate } from 'utility';

const NUMBER_OF_PHOTOS = 8;

const PhotoBar = ({ t }) => {
  const [selectedCamera, setSelectedCamera] = useState('All');
  const [photos, setPhotos] = useState([]);

  const cameraSources = useSelector(cameraSourcesSelector);
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
    dispatch(fetchCameraSources());
  }, [dispatch]);

  useEffect(() => {
    if (selectedCamera === 'All') {
      setPhotos(allPhotos.slice(0, NUMBER_OF_PHOTOS));
    } else {
      const filteredPhotos = allPhotos.filter(
        photo => photo.camera_id === selectedCamera,
      );

      setPhotos(filteredPhotos.slice(0, NUMBER_OF_PHOTOS));
    }
  }, [allPhotos, selectedCamera]);

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

        <Row className="my-1 mx-4 row-cols-4">
          <Col>
            <Input
              className="btn-sm sort-select-input mx-8"
              name="inSutuSource"
              placeholder="Source"
              type="select"
              onChange={event => setSelectedCamera(event.target.value)}
              value={selectedCamera}
            >
              <option value="All">
                --- {t('Source')} : {t('All')} ---
              </option>
              {cameraSources.map(camera => (
                <option key={camera} value={camera}>
                  {camera}
                </option>
              ))}
            </Input>
          </Col>
        </Row>

        <Row className="mx-3" xs={1} sm={2} md={3} lg={4}>
          {photos.length === 0 ? (
            <div className="card noshadow mx-5">{t('No photos in AOI')}</div>
          ) : null}
          {photos.map(photo => {
            return (
              <div key={photo.id} className="p-3 my-3 ml-3">
                <img
                  src={photo.thumbnail_url ?? photo.media_url ?? photo.url}
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
