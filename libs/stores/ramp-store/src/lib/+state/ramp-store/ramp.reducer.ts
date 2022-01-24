import { EntityState, EntityAdapter, createEntityAdapter } from '@ngrx/entity';
import { createReducer, on, Action } from '@ngrx/store';
import {
  Analyte,
  Classes,
  Metabolite,
  Ontology,
  Pathway,
  Properties, RampQuery,
  Reaction,
  SourceVersion
} from "@ramp/models/ramp-models";

import * as RampActions from './ramp.actions';
import { RampEntity} from './ramp.models';

export const RAMP_STORE_FEATURE_KEY = 'rampStore';

export interface State extends EntityState<RampEntity> {
  selectedId?: string | number; // which RampStore record has been selected
  loading: boolean; // has the RampStore list been loaded
  error?: string | null; // last known error (if any)
  supportedIds?: {
    metabolites: string[],
    genes: string[]
  }
  sourceVersions?: SourceVersion[];
  entityCounts?: any;
  metaboliteIntersects?:[];
  geneIntersects?:[];
  ontologies?: {
    data: Ontology[],
    query: RampQuery
  };
  analytes?: {
    data: Analyte[],
    query: RampQuery
  };
  pathways?: {
    data: Pathway[],
    query: RampQuery
  };
  reactions?: {
    data: Reaction[],
    query: RampQuery
  };

  metabolites?: {
    data: Metabolite[],
    query: RampQuery
  };

  ontologiesList?: any[];

  metClasses?: {
    data: Classes[],
    query: RampQuery
  };

  properties?: {
    data: Properties[],
    query: RampQuery
  };

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
    RampActions.init,
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

  on(RampActions.initSuccess, (state, { metabolites, genes }) =>
    ({...state, loading: false, supportedIds: {metabolites: metabolites, genes: genes}})),

 on(RampActions.loadSourceVersionsSuccess, (state, { versions }) =>
    ({...state, loading: false, sourceVersions: versions})),

on(RampActions.fetchOntologiesFromMetabolitesSuccess, (state, { data, query }) =>
    ({...state, loading: false,  ontologies: { data, query }})),

on(RampActions.fetchAnalytesFromPathwaysSuccess, (state, { data, query }) =>
    ({...state, loading: false,  analytes: { data, query }})),

on(RampActions.fetchPathwaysFromAnalytesSuccess, (state, { data, query }) =>
    ({...state, loading: false,  pathways: { data, query }})),

 on(RampActions.fetchCommonReactionAnalytesSuccess, (state, { data, query  }) =>
    ({...state, loading: false,  reactions: { data, query }})),

  on(RampActions.fetchMetabolitesFromOntologiesSuccess, (state, { data, query }) =>
    ({...state, loading: false,  metabolites: {data, query}})),

  on(RampActions.fetchOntologiesSuccess, (state, { ontologies }) =>
    ({...state, loading: false,  ontologiesList: ontologies})),

on(RampActions.fetchClassesFromMetabolitesSuccess, (state, { data, query }) =>
    ({...state, loading: false,  metClasses: { data, query  }})),

on(RampActions.fetchPropertiesFromMetabolitesSuccess, (state, { data, query }) =>
    ({...state, loading: false,  properties: { data, query }})),

on(RampActions.fetchEnrichmentFromAnalytesSuccess, (state, { chemicalEnrichments }) =>
    ({...state, loading: false,  chemicalEnrichments: chemicalEnrichments})),

on(RampActions.fetchEnrichmentFromPathwaysSuccess, (state, { pathwayEnrichments }) =>
    ({...state, loading: false,  pathwayEnrichments: pathwayEnrichments})),

  on(
    RampActions.loadRampFailure,
    RampActions.loadRampAboutFailure,
    RampActions.loadSourceVersionsFailure,
    RampActions.fetchPathwaysFromAnalytesFailure,
    RampActions.fetchOntologiesFromMetabolitesFailure,
    RampActions.fetchMetaboliteFromOntologiesFailure,
    RampActions.fetchOntologiesFailure,
    RampActions.fetchCommonReactionAnalytesFailure,
    RampActions.fetchClassesFromMetabolitesFailure,
    RampActions.fetchPropertiesFromMetabolitesFailure,
    (state, { error }) => {
      console.log(error);
      return ({
        ...state,
        loading: false,
        error,
      })
    }
  )
);

export function reducer(state: State | undefined, action: Action) {
  return rampReducer(state, action);
}
