import React, { createContext, useContext, useRef } from 'react';

export const MapContext = createContext(undefined);
MapContext.displayName = 'MapContext';

/**
 * @typedef {Object} MapContextType
 * @property {React.MutableRefObject<import('react-map-gl').StaticMap>} mapRef
 * @property {React.MutableRefObject<import('@deck.gl/core').Deck>} deckRef
 */

/**
 * @param {{children: React.ReactNode}} props
 * @returns {JSX.Element} MapContextProvider
 */
// eslint-disable-next-line react/prop-types
export const MapProvider = ({ value, ...rest }) => {
  const mapRef = useRef(null);
  const deckRef = useRef(null);

  return (
    <MapContext.Provider
      value={{
        mapRef,
        deckRef,
        ...value,
      }}
      {...rest}
    />
  );
};

/**
 * @returns {{
 *   mapRef: React.MutableRefObject<import('react-map-gl').StaticMap>
 *   deckRef: React.MutableRefObject<import('@deck.gl/core').Deck>
 * }}
 */
export const useMap = () => {
  /**
   * @type {MapContextType}
   */
  const context = useContext(MapContext);

  if (context === undefined) throw Error('Wrap your app with <MapProvider />');

  return context;
};
