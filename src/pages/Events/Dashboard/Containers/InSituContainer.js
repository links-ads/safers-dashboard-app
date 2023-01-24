import React, { useState } from 'react';

import PropTypes from 'prop-types';
import { withTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { Card, Row, Col } from 'reactstrap';

import MediaComponent from '../../../../components/MediaComponent';
import PaginationWrapper from '../../../../components/Pagination';

//i18n

const InSituContainer = ({ t }) => {
  const inSituMedia = useSelector(state => state.eventAlerts.inSituMedia);
  const [pageData, setPageData] = useState([]);
  return (
    <Row role="in-situ-container">
      <Col md={12} className="d-flex">
        <Card className="card-weather">
          <Row className="mb-2">
            <span className="weather-text">{t('In-situ Photos & Videos')}</span>
          </Row>
          <Row>
            {pageData.map(media => {
              return (
                <Col
                  key={media}
                  md={3}
                  sm={6}
                  xs={12}
                  className="d-flex dashboard-image justify-content-center"
                >
                  <MediaComponent media={media} />
                </Col>
              );
            })}
          </Row>
          <Row className="text-center">
            <PaginationWrapper
              pageSize={8}
              list={inSituMedia}
              setPageData={setPageData}
            />
          </Row>
        </Card>
      </Col>
    </Row>
  );
};

InSituContainer.propTypes = {
  t: PropTypes.any,
};

export default withTranslation(['common'])(InSituContainer);
