import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Button } from 'reactstrap'
import { getAllFireAlerts } from '../../../store/appAction';

const SearchButton = (index) => {
  const { midPoint, zoomLevel, sortByDate, alertSource, dateRange } = useSelector(state => state.eventAlerts);

  const dispatch = useDispatch();
  

  const getAlertsByArea = () => {

    const rangeFactor = (1 / zoomLevel) * 18;
    const left = midPoint[0] - rangeFactor; //minLong
    const right = midPoint[0] + rangeFactor; //maxLong
    const top = midPoint[1] + rangeFactor; //maxLat
    const bottom = midPoint[1] - rangeFactor; //minLat

    const boundaryBox = [
      [left, top],
      [right, top],
      [right, bottom],
      [left, bottom]
    ];


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

export default SearchButton