import { EntityState, EntityAdapter, createEntityAdapter } from '@ngrx/entity';
import { createReducer, on, Action } from '@ngrx/store';
import {Analyte, Ontology, Pathway, SourceVersion} from "@ramp/models/ramp-models";

import * as RampActions from './ramp.actions';
import { RampEntity } from './ramp.models';

export const RAMP_STORE_FEATURE_KEY = 'rampStore';

export interface State extends EntityState<RampEntity> {
  selectedId?: string | number; // which RampStore record has been selected
  loading: boolean; // has the RampStore list been loaded
  error?: string | null; // last known error (if any)
  sourceVersions?: SourceVersion[];
  entityCounts?: any;
  analyteIntersects?: {compounds: [], genes: []};
  ontologies?: Ontology[];
  analytes?: Analyte[];
  pathways?: Pathway[];
}

export interface RampPartialState {
  readonly [RAMP_STORE_FEATURE_KEY]: State;
}

export const rampAdapter: EntityAdapter<RampEntity> =
  createEntityAdapter<RampEntity>();

export const initialState: State = rampAdapter.getInitialState({
  // set initial required properties
  loading: false,
});

const rampReducer = createReducer(
  initialState,
  on(RampActions.init, (state) => ({
    ...state,
    loading: true,
    error: null,
  })),
  on(RampActions.loadRampSuccess, (state, { rampStore }) =>
    rampAdapter.setAll(rampStore, { ...state, loading: false })
  ),

  on(
    RampActions.initAbout,
    RampActions.fetchOntologiesFromMetabolites,
    RampActions.fetchAnalytesFromPathways,
    RampActions.fetchPathwaysFromAnalytes,
    (state) => ({
    ...state,
      loading: true,
    error: null,
  })),

  on(RampActions.loadRampAboutSuccess, (state, { data }) =>
      ({
      ...state,
        loading: false,
      sourceVersions: data.sourceVersions,
      entityCounts: data.entityCounts,
      analyteIntersects: data.analyteIntersects
    })
  ),

  on(RampActions.loadSourceVersionsSuccess, (state, { versions }) =>
    ({...state, loading: false, sourceVersions: versions})),

on(RampActions.fetchOntologiesFromMetabolitesSuccess, (state, { ontologies }) =>
    ({...state, loading: false,  ontologies: ontologies})),

on(RampActions.fetchAnalytesFromPathwaysSuccess, (state, { analytes }) =>
    ({...state, loading: false,  analytes: analytes})),

on(RampActions.fetchPathwaysFromAnalytesSuccess, (state, { pathways }) =>
    ({...state, loading: false,  pathways: pathways})),

  on(
    RampActions.loadRampFailure,
    RampActions.loadRampAboutFailure,
    RampActions.loadSourceVersionsFailure,
    RampActions.fetchOntologiesFromMetabolitesFailure,
    (state, { error }) => ({
      ...state,
      loading: false,
      error,
    })
  )
);

export function reducer(state: State | undefined, action: Action) {
  return rampReducer(state, action);
}
