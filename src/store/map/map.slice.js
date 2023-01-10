import { createSlice, createSelector } from '@reduxjs/toolkit';

const MAP_STYLES = [
  {
    label: 'Streets',
    thumbnail: '/streets.png',
    uri: 'mapbox://styles/mapbox/streets-v11',
  },
  {
    label: 'Satellite',
    thumbnail: '/satellite.png',
    uri: 'mapbox://styles/mapbox/satellite-v9',
  },
  {
    label: 'Light',
    thumbnail: '/light.png',
    uri: 'mapbox://styles/mapbox/light-v10',
  },
  {
    label: 'Navigation',
    thumbnail: '/navigation.png',
    uri: 'mapbox://styles/mapbox/navigation-day-v1'
  },
];


export const initialState = {
  mapStyles: MAP_STYLES,
  selectedMapStyle: MAP_STYLES[0],
};

const mapSlice = createSlice({
  name: 'map',
  initialState,
  reducers: {
    setSelectedMapStyle: (state, { payload }) => {
      state.selectedMapStyle = payload;
    },
  },
});

export const { setSelectedMapStyle, } = mapSlice.actions;

const baseSelector = state => state?.map;

export const mapStylesSelector = createSelector(
  baseSelector,
  map => map?.mapStyles,
);

export const selectedMapStyleSelector = createSelector(
  baseSelector,
  map => map?.selectedMapStyle,
);

export default mapSlice.reducer;
