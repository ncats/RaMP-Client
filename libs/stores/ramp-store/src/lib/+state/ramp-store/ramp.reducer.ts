import { EntityState, EntityAdapter, createEntityAdapter } from '@ngrx/entity';
import { createReducer, on, Action } from '@ngrx/store';
import {
  Analyte, ChemicalEnrichment,
  Classes, FisherResult,
  Metabolite,
  Ontology,
  Pathway,
  Properties,
  RampQuery,
  Reaction,
  SourceVersion
} from "@ramp/models/ramp-models";
import { filterEnrichmentFromMetabolitesFailure } from "./ramp.actions";

import * as RampActions from './ramp.actions';
import { RampEntity } from './ramp.models';

export const RAMP_STORE_FEATURE_KEY = 'rampStore';

export interface State extends EntityState<RampEntity> {
  selectedId?: string | number; // which RampStore record has been selected
  loading: boolean; // has the RampStore list been loaded
  error?: string | null; // last known error (if any)
  supportedIds?: [{ analyteType: string, idTypes: string[]}];
  sourceVersions?: SourceVersion[];
  entityCounts?: any;
  metaboliteIntersects?: [];
  geneIntersects?: [];
  ontologies?: {
    data: Ontology[];
    query: RampQuery;
    dataframe: any;
  };
  analytes?: {
    data: Analyte[];
    query: RampQuery;
    dataframe: any;
  };
  pathways?: {
    data: Pathway[];
    query: RampQuery;
    dataframe: any;
  };
  reactions?: {
    data: Reaction[];
    query: RampQuery;
    dataframe: any;
  };

  metabolites?: {
    data: Metabolite[];
    query: RampQuery;
    dataframe: any;
  };

  ontologiesList?: any[];

  metClasses?: {
    data: Classes[];
    query: RampQuery;
    dataframe: any;
  };

  properties?: {
    data: Properties[];
    query: RampQuery;
    dataframe: any;
  };

  chemicalEnrichments?: {
    data: ChemicalEnrichment[];
   // query: RampQuery;
  };

  pathwayEnrichments?: {
    data: FisherResult[];
    query: RampQuery;
  };
  enriched_chemical_class?: any;
  combined_fishers_dataframe?: any;
  filtered_fishers_dataframe?: any;
  clusterPlot?: any;
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
    RampActions.fetchEnrichmentFromMetabolites,
    RampActions.fetchEnrichmentFromPathways,
    (state) => ({
      ...state,
      loading: true,
      error: null,
    })
  ),

  on(RampActions.loadRampAboutSuccess, (state, { data }) => ({
    ...state,
    loading: false,
    sourceVersions: data.sourceVersions,
    entityCounts: data.entityCounts,
    metaboliteIntersects: data.metaboliteIntersects,
    geneIntersects: data.geneIntersects,
  })),

  on(RampActions.initSuccess, (state, { data }) => ({
    ...state,
    loading: false,
    supportedIds: data ,
  })),

  on(RampActions.loadSourceVersionsSuccess, (state, { versions }) => ({
    ...state,
    loading: false,
    sourceVersions: versions,
  })),

  on(
    RampActions.fetchOntologiesFromMetabolitesSuccess,
    (state, { data, query, dataframe }) => ({
      ...state,
      loading: false,
      ontologies: { data, query , dataframe},
    })
  ),

  on(
    RampActions.fetchAnalytesFromPathwaysSuccess,
    (state, { data, query, dataframe }) => ({
      ...state,
      loading: false,
      analytes: { data, query, dataframe },
    })
  ),

  on(
    RampActions.fetchPathwaysFromAnalytesSuccess,
    (state, { data, query, dataframe }) => ({
      ...state,
      loading: false,
      pathways: { data, query, dataframe },
    })
  ),

  on(
    RampActions.fetchCommonReactionAnalytesSuccess,
    (state, { data, query, dataframe }) => ({
      ...state,
      loading: false,
      reactions: { data, query, dataframe },
    })
  ),

  on(
    RampActions.fetchMetabolitesFromOntologiesSuccess,
    (state, { data, query, dataframe }) => ({
      ...state,
      loading: false,
      metabolites: { data, query, dataframe },
    })
  ),

  on(RampActions.fetchOntologiesSuccess, (state, { ontologies }) => ({
    ...state,
    loading: false,
    ontologiesList: ontologies,
  })),

  on(
    RampActions.fetchClassesFromMetabolitesSuccess,
    (state, { data, query, dataframe }) => ({
      ...state,
      loading: false,
      metClasses: { data, query, dataframe}
    })
  ),

  on(
    RampActions.fetchPropertiesFromMetabolitesSuccess,
    (state, { data, query, dataframe }) => ({
      ...state,
      loading: false,
      properties: { data, query, dataframe },
    })
  ),

  on(
    RampActions.fetchEnrichmentFromMetabolitesSuccess,
    (state, { data, enriched_chemical_class }) => ({
      ...state,
      loading: false,
      chemicalEnrichments: {data, enriched_chemical_class},
      enriched_chemical_class: enriched_chemical_class
    })
  ),
  on(
    RampActions.filterEnrichmentFromMetabolitesSuccess,
    (state, { data, enriched_chemical_class }) => ({
      ...state,
      loading: false,
      chemicalEnrichments: {data, enriched_chemical_class},
      enriched_chemical_class: enriched_chemical_class
    })
  ),

  on(
    RampActions.fetchEnrichmentFromPathwaysSuccess,
    (state, { data, query, combinedFishersDataframe }) =>  {
      return ({
        ...state,
        loading: false,
        pathwayEnrichments: { data, query },
        combined_fishers_dataframe: combinedFishersDataframe
      })
    }
  ),

on(
    RampActions.filterEnrichmentFromPathwaysSuccess,
    (state, { data, query, filteredFishersDataframe }) =>  {
      return ({
        ...state,
        loading: false,
        pathwayEnrichments: { data, query },
        filtered_fishers_dataframe: filteredFishersDataframe
      })
    }
  ),

  on(
    RampActions.fetchClusterFromEnrichmentSuccess,
    (state, {data, plot, query, dataframe}) => ({
        ...state,
        loading: false,
        pathwayEnrichments: { data, query, dataframe},
        clusterPlot: plot
      })
  ),

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
    filterEnrichmentFromMetabolitesFailure,
    (state, { error }) => {
      console.log(error);
      return {
        ...state,
        loading: false,
        error,
      };
    }
  )
);

export function reducer(state: State | undefined, action: Action) {
  return rampReducer(state, action);
}
