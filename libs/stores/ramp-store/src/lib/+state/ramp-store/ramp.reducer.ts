import { EntityState, EntityAdapter, createEntityAdapter } from '@ngrx/entity';
import { createReducer, on, Action } from '@ngrx/store';
import {
  Analyte,
  ChemicalEnrichment,
  Classes,
  EntityCount,
  FisherResult,
  FishersDataframe,
  Metabolite,
  Ontology,
  OntologyList,
  Pathway,
  Properties,
  RampResponse,
  RampQuery,
  Reaction,
  SourceVersion,
} from '@ramp/models/ramp-models';
import {
  AnalyteFromPathwayActions,
  ClassesFromMetabolitesActions,
  CommonReactionAnalyteActions,
  LoadRampActions,
  MetaboliteEnrichmentsActions,
  MetaboliteFromOntologyActions,
  OntologyFromMetaboliteActions,
  PathwayEnrichmentsActions,
  PathwayFromAnalyteActions,
  PropertiesFromMetaboliteActions,
} from './ramp.actions';

import { RampEntity } from './ramp.models';

export const RAMP_STORE_FEATURE_KEY = 'rampStore';

export interface State extends EntityState<RampEntity> {
  selectedId?: string | number; // which RampStore record has been selected
  loading: boolean; // has the RampStore list been loaded
  error?: string | null; // last known error (if any)
  supportedIds?: [{ analyteType: string; idTypes: string[] }];
  sourceVersions?: SourceVersion[];
  entityCounts?: EntityCount[];
  metaboliteIntersects?: [];
  geneIntersects?: [];
  databaseUrl?: string;
  ontologies?: RampResponse<Ontology>;
  analytes?: RampResponse<Analyte>;
  pathways?: RampResponse<Pathway>;
  reactions?: RampResponse<Reaction>;
  metabolites?: RampResponse<Metabolite>;
  ontologiesList?: OntologyList[];

  metClasses?: RampResponse<Classes>;

  properties?: RampResponse<Properties>;

  chemicalEnrichments?: {
    data: ChemicalEnrichment[];
    openModal?: boolean;
  };

  pathwayEnrichments?: {
    data: FisherResult[];
    plot?: string[];
    query?: RampQuery;
    dataframe?: FishersDataframe;
    openModal?: boolean;
  };

  enriched_chemical_class?: { [key: string]: string[] };

  filteredFishersDataframe?: FishersDataframe;

  combinedFishersDataframe?: FishersDataframe;

  clusterPlot?: string;
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
    (state, { data, query, dataframe }) => {
      return {
        ...state,
        loading: false,
        pathways: { data, query, dataframe },
      };
    },
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

  on(
    MetaboliteFromOntologyActions.fetchOntologiesSuccess,
    (state, { data }) => ({
      ...state,
      loading: false,
      ontologiesList: data,
    }),
  ),

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
        combinedFishersDataframe: combinedFishersDataframe,
        filteredFishersDataframe: undefined,
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
          dataframe: filteredFishersDataframe,
          openModal: true,
        },
        filteredFishersDataframe: filteredFishersDataframe,
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
    MetaboliteFromOntologyActions.fetchOntologiesFailure,
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
