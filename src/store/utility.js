import moment from 'moment';
import wkt from 'wkt';

export const updateObject = (oldObject, updatedProperties) => {
  return {
    ...oldObject,
    ...updatedProperties
  };
};
export const formatNumber = (number) => {
  if (number > 1000)
    return Math.floor(parseInt(number / 1000)) + 'K'
  return number
}

export const getDefaultDateRange = () => {
  const from = moment(new Date()).add(-3, 'days').format('YYYY-MM-DD');
  const to = moment(new Date()).format('YYYY-MM-DD');
  return [from, to];
}

export const formatDefaultDate = (date, format = 'L') => {
  return moment(date).format(format);
}

export const formatDate = (date, format = 'YYYY-MM-DD HH:mm:ss') => {
  return moment(date).format(format)
}

export const getPropertyValue = (searchObject = {}, targetProperty) => {
  const match = searchObject[targetProperty];
  const children = searchObject?.children;
  if (match) return match;
  if (children) {
    //traditional for-loop to end the loop if valid value returned
    for (let i = 0; i < children.length; i++) {
      const nestedTargetProperty = children[i][targetProperty];
      if (nestedTargetProperty) return nestedTargetProperty;

      const childrenTargetProperty = getPropertyValue(
        children[i],
        targetProperty
      );
      if (childrenTargetProperty) return childrenTargetProperty;
    }
  }
  return null;
}

export const filterNodesByProperty = (layers, params = {}) => {
  //params are key/value pairs of target properties and their
  //values to be searched, such as: { domain: 'Weather' }
  const paramsEntries = Object.entries(params);

  //if all filters are inactive, return all layers
  if (paramsEntries.every(([key]) => !params[key])) return layers;

  return layers?.filter((parent) =>
    paramsEntries.every(([targetProperty, matchValue]) => {
      //if some filters are inactive, ignore, as that means they're not applied
      if (!matchValue) return true;

      const targetPropertyValue = getPropertyValue(parent, targetProperty);
      return targetPropertyValue === matchValue;
    })
  )
}

export const getWKTfromFeature = (feature) => {
  var tempFeature = null, tempWKT ='';
  // console.log('TO WKT FEATURE: ', feature);
  if(!feature || feature.length == 0){
    tempWKT = '';
  } else if(feature.length > 1) {
    tempFeature = {
      type: 'GeometryCollection',
      geometries: feature.map(x=> x.geometry)
    }
    tempWKT = wkt.stringify(tempFeature);
  } else {
    tempWKT = wkt.stringify(feature[0].geometry);
  }
  const newWKT = tempWKT.replace(/\d+\.\d+/g, function(match) {
    return Number(match).toFixed(6);
  });
  return newWKT;
}

export const getGeoFeatures = (wktString) => {
  const tempGeoJSON = wkt.parse(wktString);
  const tempFeatures = [];
  if (tempGeoJSON) {
    switch (tempGeoJSON.type) {
    case 'MultiLineString':
      tempGeoJSON.coordinates.forEach(element => {
        tempFeatures.push({
          type: 'Feature',
          properties: {},
          geometry: {
            type: 'LineString',
            coordinates: element
          },
        })
      });
      break;

    case 'MultiPolygon':
      tempGeoJSON.coordinates.forEach(element => {
        tempFeatures.push({
          type: 'Feature',
          properties: {},
          geometry: {
            type: 'Polygon',
            coordinates: element
          },
        })
      });
      break;

    case 'MultiPoint':
      tempGeoJSON.coordinates.forEach(element => {
        tempFeatures.push({
          type: 'Feature',
          properties: {},
          geometry: {
            type: 'Point',
            coordinates: element
          },
        })
      });
      break;

    case 'GeometryCollection':
      tempGeoJSON.geometries.forEach(element => {
        tempFeatures.push({
          type: 'Feature',
          properties: {},
          geometry: element,
        })
      });
      break;

    default:
      tempFeatures.push({
        type: 'Feature',
        properties: {},
        geometry: wktString ? wkt.parse(wktString) : '',
      })
      break;
    }

    return tempFeatures
  } else {
    return [];
  }
}
