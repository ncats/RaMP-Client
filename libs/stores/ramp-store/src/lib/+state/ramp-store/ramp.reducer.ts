import { EntityState, EntityAdapter, createEntityAdapter } from '@ngrx/entity';
import { createReducer, on, Action } from '@ngrx/store';
import {
  Analyte,
  ChemicalEnrichment,
  Classes,
  FisherResult,
  Metabolite,
  Ontology,
  Pathway,
  Properties,
  RampQuery,
  Reaction,
  SourceVersion,
} from '@ramp/models/ramp-models';
import {
  AnalyteFromPathwayActions,
  ClassesFromMetabolitesActions,
  CommonReactionAnalyteActions,
  FetchOntologiesActions,
  LoadRampActions,
  MetaboliteEnrichmentsActions,
  MetaboliteFromOntologyActions,
  OntologyFromMetaboliteActions,
  PathwayEnrichmentsActions,
  PathwayFromAnalyteActions,
  PropertiesFromMetaboliteActions
} from "./ramp.actions";

import * as RampActions from './ramp.actions';
import { RampEntity } from './ramp.models';

export const RAMP_STORE_FEATURE_KEY = 'rampStore';

export interface State extends EntityState<RampEntity> {
  selectedId?: string | number; // which RampStore record has been selected
  loading: boolean; // has the RampStore list been loaded
  error?: string | null; // last known error (if any)
  supportedIds?: [{ analyteType: string; idTypes: string[] }];
  sourceVersions?: SourceVersion[];
  entityCounts?: any;
  metaboliteIntersects?: [];
  geneIntersects?: [];
  databaseUrl?: string;
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
    openModal?: boolean;
  };

  pathwayEnrichments?: {
    data: FisherResult[];
    query: RampQuery;
    openModal?: boolean;
  };

  enriched_chemical_class?: any;
  combined_fishers_dataframe?: any;
  filtered_fishers_dataframe?: any;
  clusterPlot?: any;
  openModal?: boolean;
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

export const rampReducer = createReducer(
  initialState,

  on(LoadRampActions.loadRamp, (state) => ({
    ...state,
    loading: false,
    error: null,
  })),

  on(LoadRampActions.loadRampStats, (state) => ({
    ...state,
    error: null,
  })),

  on(
    OntologyFromMetaboliteActions.fetchOntologiesFromMetabolites,
    AnalyteFromPathwayActions.fetchAnalytesFromPathways,
    PathwayEnrichmentsActions.fetchPathwaysFromAnalytes,
    PathwayFromAnalyteActions.fetchPathwaysFromAnalytes,
    MetaboliteFromOntologyActions.fetchMetabolitesFromOntologies,
    CommonReactionAnalyteActions.fetchCommonReactionAnalytes,
    ClassesFromMetabolitesActions.fetchClassesFromMetabolites,
    PropertiesFromMetaboliteActions.fetchPropertiesFromMetabolites,
    MetaboliteEnrichmentsActions.fetchEnrichmentFromMetabolites,
    PathwayEnrichmentsActions.fetchEnrichmentFromPathways,
    (state) => ({
      ...state,
      loading: true,
      error: null,
    }),
  ),

  on(LoadRampActions.loadRampStatsSuccess, (state, { data }) => ({
    ...state,
    loading: false,
    sourceVersions: data.sourceVersions,
    entityCounts: data.entityCounts,
    metaboliteIntersects: data.metaboliteIntersects,
    geneIntersects: data.geneIntersects,
    databaseUrl: data.databaseUrl,
  })),

/*

  on(LoadRampActions.loadRampSuccess, (state, { data }) => ({
    ...state,
    loading: false,
    supportedIds: data,
  })),
*/

  on(LoadRampActions.loadRampSuccess, (state, { data }) => ({
    ...state,
    loading: false,
    supportedIds: data,
  })),

  on(LoadRampActions.loadSourceVersionsSuccess, (state, { versions }) => ({
    ...state,
    loading: false,
    sourceVersions: versions,
  })),

  on(
    OntologyFromMetaboliteActions.fetchOntologiesFromMetabolitesSuccess,
    (state, { data, query, dataframe }) => ({
      ...state,
      loading: false,
      ontologies: { data, query, dataframe },
    }),
  ),

  on(
    AnalyteFromPathwayActions.fetchAnalytesFromPathwaysSuccess,
    (state, { data, query, dataframe }) => ({
      ...state,
      loading: false,
      analytes: { data, query, dataframe },
    }),
  ),

  on(
    PathwayEnrichmentsActions.fetchPathwaysFromAnalytesSuccess,
    PathwayFromAnalyteActions.fetchPathwaysFromAnalytesSuccess,
    (state, { data, query, dataframe }) => ({
      ...state,
      loading: false,
      pathways: { data, query, dataframe },
    }),
  ),

  on(
    CommonReactionAnalyteActions.fetchCommonReactionAnalytesSuccess,
    (state, { data, query, dataframe }) => ({
      ...state,
      loading: false,
      reactions: { data, query, dataframe },
    }),
  ),

  on(
    MetaboliteFromOntologyActions.fetchMetabolitesFromOntologiesSuccess,
    (state, { data, query, dataframe }) => ({
      ...state,
      loading: false,
      metabolites: { data, query, dataframe },
    }),
  ),

  on(FetchOntologiesActions.fetchOntologiesSuccess, (state, { data }) => ({
    ...state,
    loading: false,
    ontologiesList: data,
  })),

  on(
    ClassesFromMetabolitesActions.fetchClassesFromMetabolitesSuccess,
    (state, { data, query, dataframe }) => ({
      ...state,
      loading: false,
      metClasses: { data, query, dataframe },
    }),
  ),

  on(
    PropertiesFromMetaboliteActions.fetchPropertiesFromMetabolitesSuccess,
    (state, { data, query, dataframe }) => ({
      ...state,
      loading: false,
      properties: { data, query, dataframe },
    }),
  ),

  on(
    MetaboliteEnrichmentsActions.fetchEnrichmentFromMetabolitesSuccess,
    (state, { data, enriched_chemical_class }) => ({
      ...state,
      loading: false,
      chemicalEnrichments: { data, enriched_chemical_class },
      enriched_chemical_class: enriched_chemical_class,
    }),
  ),
  on(
    MetaboliteEnrichmentsActions.filterEnrichmentFromMetabolitesSuccess,
    (state, { data, enriched_chemical_class }) => ({
      ...state,
      loading: false,
      chemicalEnrichments: { data, enriched_chemical_class, openModal: true },
      enriched_chemical_class: enriched_chemical_class,
    }),
  ),

  on(
    PathwayEnrichmentsActions.fetchEnrichmentFromPathwaysSuccess,
    (state, { data, query, combinedFishersDataframe }) => {
      return {
        ...state,
        loading: false,
        pathwayEnrichments: { data, query },
        combined_fishers_dataframe: combinedFishersDataframe,
        filtered_fishers_dataframe: [],
        clusterPlot: '',
      };
    },
  ),

  on(
    PathwayEnrichmentsActions.filterEnrichmentFromPathwaysSuccess,
    (state, { data, query, filteredFishersDataframe }) => {
      return {
        ...state,
        loading: false,
        pathwayEnrichments: {
          data,
          query,
          dataframe: filteredFishersDataframe.fishresults,
          openModal: true,
        },
        filtered_fishers_dataframe: filteredFishersDataframe,
        clusterPlot: '',
      };
    },
  ),

  on(
    PathwayEnrichmentsActions.fetchClusterFromEnrichmentSuccess,
    (state, { data, plot, query, dataframe }) => {
      return {
        ...state,
        loading: false,
        pathwayEnrichments: { data, query, dataframe },
        clusterPlot: plot,
        openModal: true,
      };
    },
  ),

  on(
    LoadRampActions.loadRampFailure,
    LoadRampActions.loadRampStatsFailure,
    LoadRampActions.loadSourceVersionsFailure,
    PathwayFromAnalyteActions.fetchPathwaysFromAnalytesFailure,
    OntologyFromMetaboliteActions.fetchOntologiesFromMetabolitesFailure,
    MetaboliteFromOntologyActions.fetchMetaboliteFromOntologiesFailure,
    FetchOntologiesActions.fetchOntologiesFailure,
    CommonReactionAnalyteActions.fetchCommonReactionAnalytesFailure,
    ClassesFromMetabolitesActions.fetchClassesFromMetabolitesFailure,
    PropertiesFromMetaboliteActions.fetchPropertiesFromMetabolitesFailure,
    MetaboliteEnrichmentsActions.fetchEnrichmentFromMetabolitesFailure,
    MetaboliteEnrichmentsActions.filterEnrichmentFromMetabolitesFailure,
    PathwayEnrichmentsActions.fetchPathwaysFromAnalytesFailure,
    PathwayEnrichmentsActions.fetchClusterFromEnrichmentFailure,
    PathwayEnrichmentsActions.fetchEnrichmentFromPathwaysFailure,
    PathwayEnrichmentsActions.filterEnrichmentFromPathwaysFailure,
    (state, { error }) => {
      // console.log(error);
      return {
        ...state,
        loading: false,
        error,
      };
    },
  ),
);

export function reducer(state: State | undefined, action: Action) {
  return rampReducer(state, action);
}
