import { RampEntity } from './ramp.models';
import { rampAdapter, RampPartialState, initialState } from './ramp.reducer';
import * as RampSelectors from './ramp.selectors';

describe('Ramp Selectors', () => {
  const ERROR_MSG = 'No Error Available';
  const getRampStoreId = () => 'PRODUCT-BBB';
  const createRampEntity = (id: string, name = '') =>
    ({
      id,
      name: name || `name-${id}`,
    }) as RampEntity;

  let state: RampPartialState;

  beforeEach(() => {
    state = {
      rampStore: rampAdapter.setAll(
        [
          createRampEntity('PRODUCT-AAA'),
          createRampEntity('PRODUCT-BBB'),
          createRampEntity('PRODUCT-CCC'),
        ],
        {
          ...initialState,
          selectedId: 'PRODUCT-BBB',
          error: ERROR_MSG,
          loading: false,
        },
      ),
    };
  });

  describe('RampStore Selectors', () => {
    it('getAllRampStore() should return the list of RampStore', () => {
      const results = RampSelectors.getAllRampEntity(state);
      const selId = getRampStoreId();

      expect(results.length).toBe(3);
      expect(selId).toBe('PRODUCT-BBB');
    });

    it('getRampStoreLoaded() should return the current "loaded" status', () => {
      const result = RampSelectors.getRampLoaded(state);

      expect(result).toBe(false);
    });

    it('getRampStoreError() should return the current "error" state', () => {
      const result = RampSelectors.getRampError(state);

      expect(result).toBe(ERROR_MSG);
    });
  });
});
