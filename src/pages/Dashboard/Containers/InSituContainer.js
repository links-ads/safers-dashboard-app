import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';
import { Card, Row, Col } from 'reactstrap';
import MediaComponent from '../../../components/MediaComponent';
import PaginationWrapper from '../../../components/Pagination';
//i18n
import { withTranslation } from 'react-i18next'

const InSituContainer = (props) => {
  const inSituMedia = useSelector(state => state.dashboard.inSituMedia);
  const [pageData, setPageData] = useState([]);
  return (
    <Row data-testid='in-situ-media'>
      <Col md={12} className='d-flex'>
        <Card className='card-weather' >
          <Row className='mb-2'>
            <span className='weather-text'>{props.t('In-situ Photos & Videos', { ns: 'common' })}</span>
          </Row>
          <Row >
            {pageData.map((media, index) => {
              return (
                <Col key={index} md={3} sm={6} xs={12} className='d-flex dashboard-image justify-content-center'>
                  <MediaComponent media={media} />
                </Col>)
            })}
          </Row>
          <Row className='text-center'>
            <PaginationWrapper pageSize={8} list={inSituMedia} setPageData={setPageData} />
          </Row>
        </Card>
      </Col>
    </Row>
  );
}

InSituContainer.propTypes = {
  t: PropTypes.any,
}

export default withTranslation(['dashboard'])(InSituContainer);