import React, { useState } from 'react';

import classnames from 'classnames';
import { useTranslation } from 'react-i18next';
import { Button, ButtonGroup, Card, Row, Col } from 'reactstrap';

import BaseMap from 'components/BaseMap/BaseMap';

const MapDataLayer = () => {
  //to update when data layers ready
  const [dataLayer, setDataLayer] = useState(1);

  const { t } = useTranslation();

  return (
    <Col md={12}>
      <Row>
        <Col md={5}>
          <ButtonGroup>
            <Button
              onClick={() => setDataLayer(1)}
              className={classnames(
                {
                  active: dataLayer === 1,
                },
                'switch-data-layer-btn left',
              )}
            >
              {t('Burned Area Delineation', { ns: 'common' })}
            </Button>

            <Button
              className={classnames(
                {
                  active: dataLayer === 2,
                },
                'switch-data-layer-btn right',
              )}
              onClick={() => setDataLayer(2)}
            >
              {t('Fire Propagation', { ns: 'common' })}
            </Button>
          </ButtonGroup>
        </Col>
      </Row>
      <Row className="h-100 w-100 mx-auto mt-3">
        <Card className="map-card" style={{ height: 400 }}>
          <BaseMap layers={[]} />
        </Card>
      </Row>
    </Col>
  );
};

export default MapDataLayer;
