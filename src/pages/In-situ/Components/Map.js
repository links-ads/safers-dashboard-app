import React from 'react';
import { Card } from 'reactstrap';
import BaseMap from '../../../components/BaseMap/BaseMap';
import PropTypes from 'prop-types';
import ToolTip from './Tooltip';
import { getBoundingBox } from '../../../helpers/mapHelper';
import SearchButton from '../../../components/SearchButton';

const MapSection = ({
  viewState,
  iconLayer,
  midPoint,
  currentZoomLevel,
  hoverInfo,
  setBoundingBox,
  showTooltip,
  hideTooltip
}) => {

  const renderTooltip = (info) => {
    if (!info) return null
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

  const getCamByArea = () => {
    setBoundingBox(getBoundingBox(midPoint, currentZoomLevel));
  }

  const getSearchButton = (index) => {
    return (
      <SearchButton
        index={index}
        getInfoByArea={getCamByArea}
      />
    )
  }

  return (
    <Card className='map-card mb-0' style={{ height: 730 }}>
      <BaseMap
        layers={[iconLayer]}
        initialViewState={viewState}
        hoverInfo={hoverInfo}
        renderTooltip={renderTooltip}
        onClick={showTooltip}
        onViewStateChange={(e) => hideTooltip(e, true)}
        widgets={[getSearchButton]}
        screenControlPosition='top-right'
        navControlPosition='bottom-right'
      />
    </Card>
  )
}

MapSection.propTypes = {
  viewState: PropTypes.any,
  iconLayer: PropTypes.any,
  midPoint: PropTypes.any,
  currentZoomLevel: PropTypes.any,
  hoverInfo: PropTypes.any,
  showTooltip: PropTypes.func,
  setBoundingBox: PropTypes.func,
  hideTooltip: PropTypes.func,
}

export default MapSection;
