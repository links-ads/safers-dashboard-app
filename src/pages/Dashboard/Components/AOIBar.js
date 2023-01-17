import React, { useEffect, useState}  from 'react';
import { Container, Row, Card } from 'reactstrap';
import EventsPanel from './EventsPanel';
import MapComponent from './Map'
import { useDispatch, useSelector } from 'react-redux';
import { setEventParams } from '../../../store/appAction';
import { getAllEventAlerts } from '../../../store/appAction';
import { GeoJsonPinLayer } from '../../../components/BaseMap/GeoJsonPinLayer';
import { MAP_TYPES } from '../../../constants/common';
import { getAlertIconColorFromContext } from '../../../helpers/mapHelper';

const AOIBar = () => {

  const dispatch = useDispatch();
  const { allAlerts: events } = useSelector(state => state.eventAlerts);  
  const [eventList, setEventList] = useState([]);
  const [, setViewState] = useState({});  
  const [iconLayer, setIconLayer] = useState({});
  const {dateRange} = useSelector(state => state.common);

  const getIconLayer = (alerts) => {
    const data = alerts?.map((alert) => {
      const {
        geometry,
        ...properties
      } = alert;
      return {
        type: 'Feature',
        properties: properties,
        geometry: geometry.features[0].geometry, // this seems wrong but it's how its shaped
      };
    });

    return new GeoJsonPinLayer({
      data,
      dispatch,
      setViewState,
      getPosition: (feature) => feature.geometry.coordinates,
      getPinColor: feature => getAlertIconColorFromContext(MAP_TYPES.EVENTS,feature),
      icon: 'flag',
      iconColor: '#ffffff',
      clusterIconSize: 35,
      getPinSize: () => 35,
      pixelOffset: [-18,-18],
      pinSize: 25,
      onGroupClick: true,
      onPointClick: true,
    });
  };

  useEffect (() => {

    const dateRangeParams = dateRange 
      ? { start_date: dateRange[0], end_date: dateRange[1] }
      : {}

    const eventParams = {
      order: '-date',
      status: undefined,
      bbox:undefined,
      default_bbox: true,
      ...dateRangeParams
    };
    dispatch(setEventParams(eventParams))
    dispatch(getAllEventAlerts(eventParams, true, false));
  }, []);

  useEffect(()=> {
    setEventList(events);
    setIconLayer(getIconLayer(events));
  }, [events]);


  return(
    <div >
      <Container fluid="true" >
        <Card className="px-3">
          <Row xs={1} sm={1} md={1} lg={2} xl={2} className="p-2 gx-2 row-cols-2">
            <Card className="gx-2" >
              <MapComponent iconLayer={iconLayer} />
            </Card>
            <Container className="px-4 my-auto container">
              <Row >
                <EventsPanel eventList={eventList} />
              </Row>
              <Row >
                <Card className="card alert-card-secondary" style={{minHeight: 300}}>
                  <div className="alert-title"><p>Pin Values panel</p></div>
                  <div><p>To be done</p></div>
                </Card>                
              </Row>
            </Container>
          </Row>
        </Card>
      </Container>
    </div>

  );
}
;

export default AOIBar;
