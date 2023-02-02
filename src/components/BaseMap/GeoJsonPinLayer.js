import { getGeojsonFeatures } from '@deck.gl/layers/dist/es5/geojson-layer/geojson';

import { PinLayer } from './PinLayer';

export class GeoJsonPinLayer extends PinLayer {
  updateState({ props, oldProps, changeFlags }) {
    console.log('PROPS: ', { props, oldProps });
    const features = getGeojsonFeatures(props.data);
    console.log('FEATURES: ', features);
    super.updateState({
      oldProps,
      changeFlags,
      props: { ...props, data: features },
    });
  }
}

GeoJsonPinLayer.layerName = 'GeoJsonPinLayer';
GeoJsonPinLayer.defaultProps = {
  getPosition: { type: 'accessor', value: x => x.geometry.coordinates },
};
