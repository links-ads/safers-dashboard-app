import React, { useEffect, useState, useCallback } from 'react';
import { /*useDispatch,*/ useSelector } from 'react-redux';
import { Row, Col, Button, Input } from 'reactstrap';
import { FlyToInterpolator, IconLayer } from 'deck.gl';
import _ from 'lodash';
import Pagination from 'rc-pagination';
import BaseMap from '../../layout/BaseMap/BaseMap';
import { getAllFireAlerts } from '../../api/services/fireAlerts';
import firePin from '../../assets/images/atoms-general-icon-fire-drop.png'

import 'rc-pagination/assets/index.css';
import Alert from './Alert';
import Tooltip from './Tooltip';

const ICON_MAPPING = {
  marker: { x: 0, y: 0, width: 100, height: 100, mask: true }
};
const PAGE_SIZE = 4;

const FireAlerts = () => {
  const defaultAoi = useSelector(state => state.user.defaultAoi);
  const [iconLayer, setIconLayer] = useState(undefined);
  const [viewState, setViewState] = useState(undefined);
  const [sortByDate, setSortByDate] = useState('desc');
  const [alertSource, setAlertSource] = useState('all');
  const [alerts, setAlerts] = useState([]);
  const [alertId, setAlertId] = useState(undefined);
  const [hoverInfo, setHoverInfo] = useState({});

  const [currentPage, setCurrentPage] = useState(1);
  const [paginatedAlerts, setPaginatedAlerts] = useState([]);
  // const dispatch = useDispatch();

  useEffect(() => {
    const getAllAlerts = async () => {
      let alerts = await getAllFireAlerts();
      setAlerts(alerts)
      setPaginatedAlerts(_.cloneDeep(alerts.slice(0, PAGE_SIZE)))
      setIconLayer(getIconLayer(alerts));
    }
    setViewState(getViewState(defaultAoi.features[0].properties.midPoint, defaultAoi.features[0].properties.zoomLevel))
    getAllAlerts();
  }, []);

  useEffect(() => {
    const getAllAlerts = async () => {
      let alerts = await getAllFireAlerts(
        {
          sortOrder: sortByDate,
          source: alertSource
        }
      );
      setAlerts(alerts);
      setIconLayer(getIconLayer(alerts));
    }
    setViewState(getViewState(defaultAoi.features[0].properties.midPoint, defaultAoi.features[0].properties.zoomLevel));
    getAllAlerts();
  }, [sortByDate, alertSource]);

  const updatePage = page => {
    setCurrentPage(page);
    const to = PAGE_SIZE * page;
    const from = to - PAGE_SIZE;
    setPaginatedAlerts(_.cloneDeep(alerts.slice(from, to)));
  };

  const setSelectedAlert = (id) => {
    if (id) {
      setAlertId(id);
      let alertsToEdit = _.cloneDeep(alerts);
      let selectedAlert = _.find(alertsToEdit, { id });
      selectedAlert.isSelected = true;
      setIconLayer(getIconLayer(alertsToEdit));
      setHoverInfo({ object: selectedAlert, coordinate: selectedAlert.geometry.coordinates });
      // setViewState(getViewState(defaultAoi.features[0].properties.midPoint, defaultAoi.features[0].properties.zoomLevel));
    } else {
      setAlertId(undefined);
      setIconLayer(getIconLayer(alerts));
    }
  }

  const getViewState = (midPoint, zoomLevel = 4) => {
    return {
      longitude: midPoint[0],
      latitude: midPoint[1],
      zoom: zoomLevel + 1.25,
      pitch: 0,
      bearing: 0,
      transitionDuration: 1000,
      transitionInterpolator: new FlyToInterpolator()
    };
  }

  const getIconLayer = (alerts) => {
    return (new IconLayer({
      data: alerts,
      pickable: true,
      getPosition: d => d.geometry.coordinates,
      iconAtlas: firePin,
      iconMapping: ICON_MAPPING,
      // onHover: !hoverInfo.objects && setHoverInfo,
      id: 'icon',
      getIcon: () => 'marker',
      getColor: d => { return (d.isSelected ? [226, 123, 29] : [230, 51, 79]) },
      sizeMinPixels: 80,
      sizeMaxPixels: 100,
      sizeScale: 0.5,
    }))
  }

  const handleResetAOI = useCallback(() => {
    setViewState(getViewState(defaultAoi.features[0].properties.midPoint, defaultAoi.features[0].properties.zoomLevel))
  }, []);

  const hideTooltip = (e) => {
    console.log('hideTooltip', e)
    setHoverInfo({});
  };
  const showTooltip = info => {
    console.log('showTooltip', info)
    if (info.picked && info.object) {
      setSelectedAlert(info.object.id);
      setHoverInfo(info);
    } else {
      setHoverInfo({});
    }
  };

  const renderTooltip = (info) => {
    const { object, coordinate } = info;
    if (object) {
      return <Tooltip
        key={object.id}
        object={object}
        coordinate={coordinate}
      />
    }
    if (!object) {
      return null;
    }
  }

  const getCard = (card, index) => {
    return (
      <Alert
        key={index}
        card={card}
        setSelectedAlert={setSelectedAlert}
        alertId={alertId} />
    )
  }

  return (
    <div className='page-content'>
      <Row className='g-0'>
        <Row>
          <Col xl={11} md={10} xs={12} className='mx-auto sign-up-aoi-map-bg mb-2.5'>
            <Row className='m-4 d-flex flex-row'>
              <Col xl={4}>Alert List</Col>
              <Col xl={4} className='text-center'>
                <Button className='btn'
                  onClick={handleResetAOI}>Default AOI</Button>
              </Col>
              <Col xl={4}>
                <div className="col-md-10">
                  <input
                    className="form-control"
                    type="date"
                    defaultValue="2019-08-19"
                    id="example-date-input"
                  />
                </div>
              </Col>
            </Row>
            <Row>
              <Col xl={5}>
                <Row>
                  <Col xl={4}>
                    <Input
                      id="sortByDate"
                      className="btn-sm"
                      name="sortByDate"
                      placeholder="Sort By : Date"
                      type="select"
                      onChange={(e) => setSortByDate(e.target.value)}
                      value={sortByDate}
                    >
                      <option value={'desc'} >Sort By : Date desc</option>
                      <option value={'asc'} >Sort By : Date asc</option>
                    </Input>
                  </Col>
                  <Col xl={4}>
                    <Input
                      id="alertSource"
                      className="btn-sm"
                      name="alertSource"
                      placeholder="Source"
                      type="select"
                      onChange={(e) => setAlertSource(e.target.value)}
                      value={alertSource}
                    >
                      <option value={'all'} >Source : All</option>
                      <option value={'web'} >Source : Web</option>
                      <option value={'camera'} >Source : Camera</option>
                      <option value={'satellite'} >Source : Satellite</option>
                    </Input>
                  </Col>
                  <Col xl={4}>Results {alerts.length}</Col>
                </Row>
                <Row>
                  <Col xl={12} className='p-3'>
                    <Row>
                      {
                        paginatedAlerts.map((alert, index) => getCard(alert, index))
                      }
                    </Row>
                    <Row className='text-center'>
                      <Pagination
                        pageSize={PAGE_SIZE}
                        onChange={updatePage}
                        current={currentPage}
                        total={alerts.length}
                      />
                    </Row>
                  </Col>
                </Row>
              </Col>
              <Col xl={7} className='mx-auto'>
                <Row style={{ height: 700 }} className="mb-5">
                  <BaseMap
                    layers={[iconLayer]}
                    initialViewState={viewState}
                    hoverInfo={hoverInfo}
                    renderTooltip={renderTooltip}
                    onClick={showTooltip}
                    onViewStateChange={hideTooltip}
                    screenControlPosition='top-right'
                    navControlPosition='bottom-right'
                  />
                </Row>
              </Col>
            </Row>
          </Col>
        </Row>
      </Row >
    </div >

  );
}

export default FireAlerts;
