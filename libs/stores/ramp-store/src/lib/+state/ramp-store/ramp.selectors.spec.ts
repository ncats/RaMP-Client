import { RampEntity } from './ramp.models';
import {
  rampStoreAdapter,
  RampStorePartialState,
  initialState,
} from './ramp.reducer';
import * as RampStoreSelectors from './ramp.selectors';

describe('Ramp Selectors', () => {
  const ERROR_MSG = 'No Error Available';
  const getRampStoreId = (it: RampEntity) => it.id;
  const createRampEntity = (id: string, name = '') =>
    ({
      id,
      name: name || `name-${id}`,
    } as RampEntity);

  let state: RampStorePartialState;

  beforeEach(() => {
    state = {
      rampStore: rampStoreAdapter.setAll(
        [
          createRampEntity('PRODUCT-AAA'),
          createRampEntity('PRODUCT-BBB'),
          createRampEntity('PRODUCT-CCC'),
        ],
        {
          ...initialState,
          selectedId: 'PRODUCT-BBB',
          error: ERROR_MSG,
          loaded: true,
        }
      ),
    };
  });

  describe('RampStore Selectors', () => {
    it('getAllRampStore() should return the list of RampStore', () => {
      const results = RampStoreSelectors.getAllRampStore(state);
      const selId = getRampStoreId(results[1]);

      expect(results.length).toBe(3);
      expect(selId).toBe('PRODUCT-BBB');
    });

    it('getSelected() should return the selected Entity', () => {
      const result = RampStoreSelectors.getSelected(state) as RampEntity;
      const selId = getRampStoreId(result);

      expect(selId).toBe('PRODUCT-BBB');
    });

    it('getRampStoreLoaded() should return the current "loaded" status', () => {
      const result = RampStoreSelectors.getRampStoreLoaded(state);

      expect(result).toBe(true);
    });

    it('getRampStoreError() should return the current "error" state', () => {
      const result = RampStoreSelectors.getRampStoreError(state);

      expect(result).toBe(ERROR_MSG);
    });
  });
});
