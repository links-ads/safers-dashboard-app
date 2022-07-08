import React from 'react';
import PropTypes from 'prop-types';
import { Row, Col, Card} from 'reactstrap';

import BaseMap from '../../components/BaseMap/BaseMap';

// import { getDefaultDateRange } from '../../store/utility';

//i18n
import { withTranslation } from 'react-i18next'
import 'react-rangeslider/lib/index.css'

const FireAndBurnedArea = ({ t }) => {
  console.log('t',t);
  return (
    // <div className='page-content'>
    <div>
      <Row>
        <Col xl={5}>
          <Row>
            <h1>Form goes here</h1>
          </Row>
        </Col>
        <Col xl={7} className='mx-auto'>
          <Card className='map-card mb-0' style={{ height: 670 }}>
            <BaseMap
              layers={[]}
              initialViewState={{}}
              widgets={[]}
              screenControlPosition='top-right'
              navControlPosition='bottom-right'
            />
          </Card>
        </Col>
      </Row>
    </div >
  );
}

FireAndBurnedArea.propTypes = {
  t: PropTypes.any,
}

export default withTranslation(['common'])(FireAndBurnedArea);