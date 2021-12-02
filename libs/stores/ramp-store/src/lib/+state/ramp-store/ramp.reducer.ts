import { EntityState, EntityAdapter, createEntityAdapter } from '@ngrx/entity';
import { createReducer, on, Action } from '@ngrx/store';

import * as RampActions from './ramp.actions';
import { RampEntity } from './ramp.models';

export const RAMP_STORE_FEATURE_KEY = 'rampStore';

export interface State extends EntityState<RampEntity> {
  selectedId?: string | number; // which RampStore record has been selected
  loaded: boolean; // has the RampStore list been loaded
  error?: string | null; // last known error (if any)
  sourceVersions?: any;
}

export interface RampPartialState {
  readonly [RAMP_STORE_FEATURE_KEY]: State;
}

export const rampAdapter: EntityAdapter<RampEntity> =
  createEntityAdapter<RampEntity>();

export const initialState: State = rampAdapter.getInitialState({
  // set initial required properties
  loaded: false,
});

const rampReducer = createReducer(
  initialState,
  on(RampActions.init, (state) => ({
    ...state,
    loaded: false,
    error: null,
  })),
  on(RampActions.loadRampSuccess, (state, { ramp }) =>
    rampAdapter.setAll(ramp, { ...state, loaded: true })
  ),
  on(RampActions.loadSourceVersionsSuccess, (state, { versions }) =>
    rampAdapter.setAll(versions, { ...state, loaded: true })
  ),
  on(
    RampActions.loadRampFailure,
    RampActions.loadSourceVersionsFailure,
    (state, { error }) => ({
      ...state,
      error,
    })
  )
);

export function reducer(state: State | undefined, action: Action) {
  return rampReducer(state, action);
}
