import { Tooltip } from 'bootstrap';
import React from 'react';
import { Button, Card } from 'reactstrap';
import BaseMap from '../../components/BaseMap/BaseMap';
import SearchButton from './Components/SearchButton';

const MapSection = () => {
  const [midPoint, setMidPoint] = useState([]);
  const [zoomLevel, setZoomLevel] = useState(undefined);
  const [iconLayer, setIconLayer] = useState(undefined);
  const [viewState, setViewState] = useState(undefined);

  const [hoverInfo, setHoverInfo] = useState({});

  const hideTooltip = (e) => {
    if (e && e.viewState) {
      setMidPoint([e.viewState.longitude, e.viewState.latitude]);
      setZoomLevel(e.viewState.zoom);
    }
    setHoverInfo({});
  };

  const showTooltip = info => {
    console.log(info);
    if (info.picked && info.object) {
      setSelectedAlert(info.object.id);
      setHoverInfo(info);
    } else {
      setHoverInfo({});
    }
  };

  const renderTooltip = (info) => {
    const { object, coordinate, isEdit } = info;
    if (object) {
      return <Tooltip
        key={object.id}
        object={object}
        coordinate={coordinate}
        isEdit={isEdit}
        setFavorite={setFavorite}
        validateEvent={validateEvent}
        editInfo={editInfo}
      />
    }
    if (!object) {
      return null;
    }
  }
  return (
    <Card className='map-card mb-0' style={{ height: 670 }}>
      <BaseMap
        layers={[iconLayer]}
        initialViewState={viewState}
        hoverInfo={hoverInfo}
        renderTooltip={renderTooltip}
        onClick={showTooltip}
        onViewStateChange={hideTooltip}
        widgets={[SearchButton]}
        screenControlPosition='top-right'
        navControlPosition='bottom-right'
      />
    </Card>
  )
}

export default MapSection;