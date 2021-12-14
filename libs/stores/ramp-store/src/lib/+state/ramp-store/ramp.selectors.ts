import { createFeatureSelector, createSelector } from '@ngrx/store';
import { RAMP_STORE_FEATURE_KEY, State, rampAdapter } from './ramp.reducer';

// Lookup the 'Ramp' feature state managed by NgRx
export const getRampState = createFeatureSelector<State>(
  RAMP_STORE_FEATURE_KEY
);

const { selectAll, selectEntities } = rampAdapter.getSelectors();

export const getRampLoaded = createSelector(
  getRampState,
  (state: State) => state.loading
);

export const getRampError = createSelector(
  getRampState,
  (state: State) => state.error
);

export const getAllRamp = createSelector(getRampState, (state: State) => state

);

export const getRampEntities = createSelector(getRampState, (state: State) =>
  selectEntities(state)
);

export const getSelectedId = createSelector(
  getRampState,
  (state: State) => state.selectedId
);

export const getSelected = createSelector(
  getRampState,
  getSelectedId,
  // @ts-ignore
  (entities, selectedId) => (selectedId ? entities[selectedId] : undefined)
);

export const getSourceVersions = createSelector(
  getRampState,
  (state: State) => {
    console.log(state);
   return state.sourceVersions
  }
);

export const getEntityCounts = createSelector(
  getRampState,
  (state: State) => state.entityCounts
);

export const getAnalyteIntersects = createSelector(
  getRampState,
  (state: State) => state.analyteIntersects
);

export const getOntologies = createSelector(
  getRampState,
  (state: State) => state.ontologies
);
