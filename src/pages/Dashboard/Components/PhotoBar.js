import React, { useEffect, useState } from 'react';

import PropTypes from 'prop-types';
import { withTranslation } from 'react-i18next';
import { Img } from 'react-image';
import { useSelector, useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import { Container, Card, Row } from 'reactstrap';

import { ReactComponent as Placeholder } from './placeholder.svg';
import { getAllInSituAlerts } from '../../../store/insitu/action';

const PhotoBar = ({ t }) => {
  const [photoList, setPhotoList] = useState([]);
  const [isLoaded, setIsLoaded] = useState(false);

  const NUMBER_OF_PHOTOS = 8;

  const allPhotos = useSelector(state => {
    return state?.inSituAlerts?.filteredAlerts;
  });

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(
      getAllInSituAlerts({
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
    setPhotoList(allPhotos);
    setIsLoaded(true);
  }, [allPhotos]);

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
        <Row xs={1} sm={2} md={3} lg={4}>
          {!photoList || photoList.length === 0 ? (
            <div className="card noshadow mx-5">{t('No photos in AOI')}</div>
          ) : null}
          {photoList.slice(0, NUMBER_OF_PHOTOS).map(photo => {
            return (
              <div key={`photie_${photo.id}`} className="p-3 my-3">
                {/* This is a custom component which handles fallbacks */}
                <Img
                  decode={true}
                  unloader={<Placeholder width="100%" height="120px" />}
                  src={[`${photo.url}`]}
                  width="100%"
                  height="120px"
                  alt="Image is missing"
                />
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
