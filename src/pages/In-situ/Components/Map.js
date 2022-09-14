import React from 'react';
import { Card } from 'reactstrap';
import BaseMap from '../../../components/BaseMap/BaseMap';
import PropTypes from 'prop-types';
import ToolTip from './Tooltip';
import SearchButton from '../../../components/SearchButton';

const MapSection = ({
  viewState,
  iconLayer,
  hoverInfo,
  showTooltip,
  hideTooltip,
  getCamByArea,
  setNewWidth,
  setNewHeight
}) => {

  const renderTooltip = (info) => {
    if (!info || !info.picked) return null

    return <ToolTip object={info} />
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
        setWidth={setNewWidth}
        setHeight={setNewHeight}
        screenControlPosition='top-right'
        navControlPosition='bottom-right'
      />
    </Card>
  )
}

MapSection.propTypes = {
  viewState: PropTypes.any,
  iconLayer: PropTypes.any,
  hoverInfo: PropTypes.any,
  showTooltip: PropTypes.func,
  hideTooltip: PropTypes.func,
  getCamByArea: PropTypes.func,
  setNewWidth: PropTypes.func,
  setNewHeight: PropTypes.func
}

export default MapSection;
