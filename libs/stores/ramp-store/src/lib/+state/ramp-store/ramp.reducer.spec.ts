import { Action } from '@ngrx/store';
import { LoadRampActions } from "./ramp.actions";
import { State, initialState, reducer } from './ramp.reducer';

describe('RampStore Reducer', () => {


  describe('valid RampStore actions', () => {
    it('loadRampSuccess should return the list of known RampStore', () => {

      const action = LoadRampActions.loadRampSuccess({ supportedIds: []});

      const result: State = reducer(initialState, action);

      expect(result.loading).toBe(false);
      expect(result.ids.length).toBe(0);
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
