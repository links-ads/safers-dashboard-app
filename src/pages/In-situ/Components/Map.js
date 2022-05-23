import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Card, Button } from 'reactstrap';
import BaseMap from '../../../components/BaseMap/BaseMap';
import { setHoverInfo, setMidpoint, setZoomLevel } from '../../../store/insitu/action';
import PropTypes from 'prop-types';
import ToolTip from './Tooltip';
import { getBoundingBox } from '../../../helpers/mapHelper';

//i18n
import { useTranslation } from 'react-i18next'


const MapSection = ({viewState, setBoundingBox}) => {
  const { iconLayer, hoverInfo, midPoint, zoomLevel } = useSelector(state => state.inSituAlerts);
  const {t} = useTranslation();
  
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

  const getAlertsByArea = () => {
    setBoundingBox(getBoundingBox(midPoint, zoomLevel));
  }

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
        {t('Search This Area')}
      </Button >
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
        onViewStateChange={hideTooltip}
        widgets={[getSearchButton]}
        screenControlPosition='top-right'
        navControlPosition='bottom-right'
      />
    </Card>
  )
}

MapSection.propTypes = {
  viewState : PropTypes.any,
  setBoundingBox : PropTypes.func,
}

export default MapSection;
