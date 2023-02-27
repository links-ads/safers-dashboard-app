import React, { useEffect, useState } from 'react';

import PropTypes from 'prop-types';
import { withTranslation } from 'react-i18next';
import { Img } from 'react-image';
import { useSelector, useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import { Container, Card, Row, Input, Col } from 'reactstrap';

import {
  fetchCameraAlerts,
  allInSituAlertsSelector,
  cameraSourcesSelector,
  fetchCameraSources,
} from 'store/insitu.slice';
import { formatDate } from 'utility';

import { ReactComponent as Placeholder } from './placeholder.svg';

const PhotoBar = ({ t }) => {
  const [photoList, setPhotoList] = useState([]);
  const [cameraList, setCameraList] = useState(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [selectedCamera, setSelectedCamera] = useState('All');

  const NUMBER_OF_PHOTOS = 8;

  const allPhotos = useSelector(allInSituAlertsSelector);
  const allCameras = useSelector(cameraSourcesSelector);

  console.log('cameraList', cameraList);

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

  useEffect(() => {
    dispatch(fetchCameraSources());
  }, [dispatch]);

  useEffect(() => {
    if (selectedCamera === 'All') {
      setPhotoList(allPhotos);
    } else {
      setPhotoList(
        allPhotos.filter(image => image.camera_id === selectedCamera),
      );
    }
    setIsLoaded(true);
  }, [selectedCamera, allPhotos]);

  useEffect(() => {
    setCameraList(allCameras);
  }, [allCameras]);

  return (
    <Container
      fluid="true"
      className="mx-8 flex-stretch align-content-center flex-wrap"
    >
      {!isLoaded ? (
        <Card>
          <h1>Loading...</h1>
        </Card>
      ) : null}
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
              id="inSituSource"
              className="btn-sm sort-select-input  mx-8"
              name="inSituSource"
              placeholder="Source"
              type="select"
              onChange={e => setSelectedCamera(e.target.value)}
              value={selectedCamera}
            >
              <option value="" key={''}>
                {' '}
                ---------- {t('Source')} : {t('All')} -----------
              </option>
              {cameraList?.map(camera => (
                <option key={camera} value={camera}>
                  {camera}
                </option>
              ))}
            </Input>
          </Col>
        </Row>
        <Row className="mx-3" xs={1} sm={2} md={3} lg={4}>
          {photoList && photoList.length === 0 ? (
            <div className="card noshadow mx-5">{t('No photos in AOI')}</div>
          ) : null}
          {photoList && photoList.length > 0 ? (
            photoList?.slice(0, NUMBER_OF_PHOTOS).map(photo => {
              return (
                <div key={`photie_${photo.id}`} className="p-3 ml-3 my-3">
                  {/* This is a custom component which handles fallbacks */}
                  <div>
                    <Img
                      decode={true}
                      unloader={<Placeholder width="100%" height="120px" />}
                      src={[`${photo.url}`]}
                      width="100%"
                      height="120px"
                      alt="Image is missing"
                    />
                  </div>
                  <div>{photo.camera_id}</div>
                  <div>{formatDate(photo.timestamp)}</div>
                </div>
              );
            })
          ) : (
            <div className="card noshadow w-100 mx-4 px-3">
              <h3>Looking for photos...</h3>
            </div>
          )}
        </Row>
      </Card>
    </Container>
  );
};

PhotoBar.propTypes = {
  t: PropTypes.func,
};

export default withTranslation(['dashboard'])(PhotoBar);
