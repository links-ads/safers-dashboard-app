import { Tooltip } from 'bootstrap';
import React from 'react';
import { Button, Card } from 'reactstrap';
import BaseMap from '../../components/BaseMap/BaseMap';

const MapSection = () => {
    
  const getSearchButton = (index) => {
    return (
      <Button
        key={index}
        className="btn-rounded alert-search-area"
        style={{
          position: 'absolute',
          top: 10,
          textAlign: 'center',
          marginLeft: '41%'
        }}
        onClick={getAlertsByArea}
      >
        <i className="bx bx-revision"></i>{' '}
            Search This Area
      </Button >
    )
  }
  const getAlertsByArea = () => {

    

    // console.log(zoomLevel, rangeFactor, midPoint, boundaryBox);

    dispatch(getAllFireAlerts(
      {
        sortOrder: sortByDate,
        source: alertSource,
        from: dateRange[0],
        to: dateRange[1],
        boundaryBox
      }
    ));
  }
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
        widgets={[getSearchButton]}
        screenControlPosition='top-right'
        navControlPosition='bottom-right'
      />
    </Card>
  )
}

export default MapSection;