import React, { useState } from 'react';
import { Button } from 'reactstrap'

const SearchButton = (index) => {
  const [midPoint, setMidPoint] = useState([]);
  const [zoomLevel, setZoomLevel] = useState(undefined);

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
    
    // console.log(zoomLevel, rangeFactor, midPoint, boundaryBox);
    
    dispatch(getAllF(
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