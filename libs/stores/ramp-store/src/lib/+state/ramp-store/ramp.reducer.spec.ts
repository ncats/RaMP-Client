import { Action } from '@ngrx/store';

import * as RampActions from './ramp.actions';
import { RampEntity } from './ramp.models';
import { State, initialState, reducer } from './ramp.reducer';

describe('RampStore Reducer', () => {
  const createRampEntity = (id: string, name = ''): RampEntity => ({
    id,
    name: name || `name-${id}`,

  });

  describe('valid RampStore actions', () => {
    it('loadRampSuccess should return the list of known RampStore', () => {
      const rampStore = [
        createRampEntity('PRODUCT-AAA'),
        createRampEntity('PRODUCT-zzz'),
      ];
      const action = RampActions.loadRampSuccess({ rampStore });

      const result: State = reducer(initialState, action);

      expect(result.loading).toBe(false);
      expect(result.ids.length).toBe(2);
    });
  });

  describe('unknown action', () => {
    it('should return the previous state', () => {
      const action = {} as Action;

      const result = reducer(initialState, action);

      expect(result).toBe(initialState);
    });
  });
});
