import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Card } from 'reactstrap';
import BaseMap from '../../../components/BaseMap/BaseMap';
import { setHoverInfo, setMidpoint, setZoomLevel } from '../../../store/insitu/action';
import SearchButton from './SearchButton';
import PropTypes from 'prop-types';
import ToolTip from './Tooltip';


const MapSection = ({viewState}) => {
  const { iconLayer, hoverInfo } = useSelector(state => state.inSituAlerts);

  
  const dispatch = useDispatch();

  const hideTooltip = (e) => {
    if (e && e.viewState) {
      dispatch(setMidpoint([e.viewState.longitude, e.viewState.latitude]));
      dispatch(setZoomLevel(e.viewState.zoom));
    }
    dispatch(setHoverInfo({}));
  };

  const showTooltip = info => {
    if (info.picked && info.object) {
      dispatch(setHoverInfo(info));
    } else {
      dispatch(setHoverInfo({}));
    }
  };

  const renderTooltip = (info) => {
    if(!info) return null
    const { object, coordinate } = info;
    if (object) {
      return <ToolTip
        key={object.id}
        object={object}
        coordinate={coordinate}
      />
    }
    if (!object) {
      return null;
    }
  }

  return (
    <Card className='map-card mb-0' style={{ height: 730 }}>
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

MapSection.propTypes = {
  viewState : PropTypes.any,
}

export default MapSection;
