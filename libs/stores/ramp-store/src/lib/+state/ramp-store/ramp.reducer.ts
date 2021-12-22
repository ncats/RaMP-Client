import { EntityState, EntityAdapter, createEntityAdapter } from '@ngrx/entity';
import { createReducer, on, Action } from '@ngrx/store';
import {
  Analyte,
  Classes,
  Metabolite,
  Ontology,
  Pathway,
  Properties,
  Reaction,
  SourceVersion
} from "@ramp/models/ramp-models";

import * as RampActions from './ramp.actions';
import { RampEntity } from './ramp.models';

export const RAMP_STORE_FEATURE_KEY = 'rampStore';

export interface State extends EntityState<RampEntity> {
  selectedId?: string | number; // which RampStore record has been selected
  loading: boolean; // has the RampStore list been loaded
  error?: string | null; // last known error (if any)
  sourceVersions?: SourceVersion[];
  entityCounts?: any;
  metaboliteIntersects?:[];
  geneIntersects?:[];
  ontologies?: Ontology[];
  analytes?: Analyte[];
  pathways?: Pathway[];
  metabolites?: Metabolite[];
  ontologiesTypeahead?: any[];
  reactions?: Reaction[];
  classes?: Classes[];
  properties?: Properties[];
  chemicalEnrichments?: any;
  pathwayEnrichments?: any;
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
    RampActions.fetchMetabolitesFromOntologies,
    RampActions.fetchCommonReactionAnalytes,
    RampActions.fetchClassesFromMetabolites,
    RampActions.fetchPropertiesFromMetabolites,
    RampActions.fetchEnrichmentFromAnalytes,
    RampActions.fetchEnrichmentFromPathways,
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
      metaboliteIntersects: data.metaboliteIntersects,
      geneIntersects: data.geneIntersects
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

  on(RampActions.fetchMetabolitesFromOntologiesSuccess, (state, { metabolites }) =>
    ({...state, loading: false,  metabolites: metabolites})),

  on(RampActions.fetchOntologyTypeaheadSuccess, (state, { ontologies }) =>
    ({...state, loading: false,  ontologiesTypeahead: ontologies})),

 on(RampActions.fetchCommonReactionAnalytesSuccess, (state, { reactions }) =>
    ({...state, loading: false,  reactions: reactions})),

on(RampActions.fetchClassesFromMetabolitesSuccess, (state, { classes }) =>
    ({...state, loading: false,  classes: classes})),

on(RampActions.fetchPropertiesFromMetabolitesSuccess, (state, { properties }) =>
    ({...state, loading: false,  properties: properties})),

on(RampActions.fetchEnrichmentFromAnalytesSuccess, (state, { chemicalEnrichments }) =>
    ({...state, loading: false,  chemicalEnrichments: chemicalEnrichments})),

on(RampActions.fetchEnrichmentFromPathwaysSuccess, (state, { pathwayEnrichments }) =>
    ({...state, loading: false,  pathwayEnrichments: pathwayEnrichments})),

  on(
    RampActions.loadRampFailure,
    RampActions.loadRampAboutFailure,
    RampActions.loadSourceVersionsFailure,
    RampActions.fetchOntologiesFromMetabolitesFailure,
    RampActions.fetchMetaboliteFromOntologiesFailure,
    RampActions.fetchOntologyTypeaheadFailure,
    RampActions.fetchCommonReactionAnalytesFailure,
    RampActions.fetchClassesFromMetabolitesFailure,
    RampActions.fetchPropertiesFromMetabolitesFailure,
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
