import reducer, {
  initialState,
  setSelectedMapStyle,
  mapStylesSelector,
  selectedMapStyleSelector,
} from './map.slice';

describe('Map Slice', () => {
  describe('Reducer', () => {
    let beforeState = null;

    beforeEach(() => {
      beforeState = initialState;
    });

    it('should return the initial state', () => {
      const actualState = reducer(undefined, {});
      expect(actualState).toEqual(expect.objectContaining(beforeState));
    });

    describe('setSelectedMapStyle', () => {
      it('should set the newly selected map style', () => {
        const actualState = reducer(
          beforeState,
          setSelectedMapStyle(initialState.mapStyles[2]),
        );

        expect(actualState.selectedMapStyle).toBe(initialState.mapStyles[2]);
      });
    });
  });

  describe('Selectors', () => {
    describe('mapStylesSelector', () => {
      it('should return false if state is undefined', () => {
        const result = mapStylesSelector(undefined);
        expect(result).toBe(undefined);
      });

      it('should return map styles', () => {
        const state = {
          map: {
            ...initialState,
          },
        };

        const result = mapStylesSelector(state);
        expect(result).toBe(initialState.mapStyles);
      });
    });

    describe('selectedMapStyleSelector', () => {
      it('should return false if state is undefined', () => {
        const result = selectedMapStyleSelector(undefined);
        expect(result).toBe(undefined);
      });

      it('should return selected map style', () => {
        const state = {
          map: {
            ...initialState,
            selectedMapStyle: initialState.mapStyles[2],
          },
        };

        const result = selectedMapStyleSelector(state);
        expect(result).toBe(initialState.mapStyles[2]);
      });
    });
  });
});
