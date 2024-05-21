import { createActionGroup, emptyProps, props } from '@ngrx/store';
import {
  Analyte,
  Classes,
  FisherResult,
  FishersDataframe,
  Metabolite,
  Ontology,
  OntologyList,
  Pathway,
  Properties,
  RampChemicalEnrichmentResponse,
  RampQuery,
  RampResponse,
  Reaction,
  SourceVersion, Stats
} from "@ramp/models/ramp-models";

export const LoadRampActions = createActionGroup({
  source: 'Load Ramp',
  events: {
    loadRamp: emptyProps(),
    loadRampSuccess: props<{ supportedIds: { analyteType: string; idTypes: string[] }[];}>(),
    loadRampFailure: props<{ error: string }>(),
    loadRampStats: emptyProps(),
    loadRampStatsSuccess: props<{ data: Stats }>(),
    loadRampStatsFailure: props<{ error: string }>(),
    loadSourceVersions: emptyProps(),
    loadSourceVersionsSuccess: props<{ versions: SourceVersion[]}>(),
    loadSourceVersionsFailure: props<{ error: string }>(),
  },
});

export const PathwayFromAnalyteActions = createActionGroup({
  source: 'Pathways from Analytes',
  events: {
    fetchPathwaysFromAnalytes: props<{ analytes: string[] }>(),
    fetchPathwaysFromAnalytesSuccess: props<{
      data: Pathway[];
      query: RampQuery;
      dataframe?: unknown[];
    }>(),
    fetchPathwaysFromAnalytesFailure: props<{ error: string }>(),
  },
});

export const AnalyteFromPathwayActions = createActionGroup({
  source: 'Analytes from Pathways',
  events: {
    fetchAnalytesFromPathways: props<{ pathways: string[] }>(),
    fetchAnalytesFromPathwaysSuccess: props<{
      data: Analyte[];
      query: RampQuery;
      dataframe?: unknown[];
    }>(),
    fetchAnalytesFromPathwaysFailure: props<{ error: string }>(),
  },
});

export const OntologyFromMetaboliteActions = createActionGroup({
  source: 'Ontologies from Metabolites',
  events: {
    fetchOntologiesFromMetabolites: props<{ metabolites: string[] }>(),
    fetchOntologiesFromMetabolitesSuccess: props<{
      data: Ontology[];
      query: RampQuery;
      dataframe?: unknown[];
    }>(),
    fetchOntologiesFromMetabolitesFailure: props<{ error: string }>(),
  },
});

export const MetaboliteFromOntologyActions = createActionGroup({
  source: 'Metabolite from Ontologies',
  events: {
    fetchOntologies: emptyProps(),
    fetchOntologiesSuccess: props<{
      data: OntologyList[];
    }>(),
    fetchOntologiesFailure: props<{ error: string }>(),
    fetchMetabolitesFromOntologies: props<{ ontologies: string[] }>(),
    fetchMetabolitesFromOntologiesFile: props<{
      ontologies: string[];
      format: string;
    }>(),
    fetchMetabolitesFromOntologiesSuccess: props<{
      data: Metabolite[];
      query: RampQuery;
      dataframe?: unknown[];
    }>(),
    fetchMetaboliteFromOntologiesFailure: props<{ error: string }>(),
  },
});

export const ClassesFromMetabolitesActions = createActionGroup({
  source: 'Classes From Metabolites',
  events: {
    fetchClassesFromMetabolites: props<{
      metabolites: string[];
      biospecimen?: string;
      background?: File;
    }>(),
    fetchClassesFromMetabolitesSuccess: props<{
      data: Classes[];
      query: RampQuery;
      dataframe?: unknown[];
    }>(),
    fetchClassesFromMetabolitesFailure: props<{ error: string }>(),
  },
});

export const PropertiesFromMetaboliteActions = createActionGroup({
  source: 'Properties from Metabolites',
  events: {
    fetchPropertiesFromMetabolites: props<{ metabolites: string[] }>(),
    fetchPropertiesFromMetabolitesSuccess: props<RampResponse<Properties>>(),
    fetchPropertiesFromMetabolitesFailure: props<{ error: string }>(),
  },
});

export const CommonReactionAnalyteActions = createActionGroup({
  source: 'Common Reaction Analytes',
  events: {
    fetchCommonReactionAnalytes: props<{ analytes: string[] }>(),
    fetchCommonReactionAnalytesSuccess: props<{
      data: Reaction[];
      query: RampQuery;
      dataframe?: unknown[];
    }>(),
    fetchCommonReactionAnalytesFailure: props<{ error: string }>(),
  },
});

export const ReactionClassesFromAnalytesActions = createActionGroup({
  source: 'Reaction Classes from Analytes',
  events: {
    fetchReactionClassesFromAnalytes: props<{ analytes: string[] }>(),
    fetchReactionClassesFromAnalyteSuccess: props<{
      data: Reaction[];
      query: RampQuery;
      dataframe?: unknown[];
    }>(),
    fetchReactionClassesFromAnalyteFailure: props<{ error: string }>(),
  },
});

export const ReactionsFromAnalytesActions = createActionGroup({
  source: 'Reactions From Analytes',
  events: {
    fetchReactionsFromAnalytesAnalytes: props<{ analytes: string[] }>(),
    fetchReactionsFromAnalytesSuccess: props<{
      data: Reaction[];
      query: RampQuery;
      dataframe?: unknown[];
    }>(),
    fetchReactionsFromAnalytesFailure: props<{ error: string }>(),
  },
});

export const PathwayEnrichmentsActions = createActionGroup({
  source: 'Pathway Enrichment',
  events: {
    fetchPathwaysFromAnalytes: props<{ analytes: string[] }>(),
    fetchPathwaysFromAnalytesSuccess: props<{
      data: Pathway[];
      query: RampQuery;
      dataframe?: unknown[];
    }>(),
    fetchPathwaysFromAnalytesFailure: props<{ error: string }>(),
    fetchEnrichmentFromPathways: props<{
      analytes: string[];
      biospecimen?: string;
      background?: File;
    }>(),
    fetchEnrichmentFromPathwaysSuccess: props<{
      data: FisherResult[];
      query: RampQuery;
      combinedFishersDataframe?: FishersDataframe;
      pval_type?: string;
      pval_cutoff?: number;
    }>(),
    fetchEnrichmentFromPathwaysFailure: props<{ error: string }>(),
    filterEnrichmentFromPathways: props<{
      pval_type: string;
      pval_cutoff: number;
      perc_analyte_overlap?: number;
      min_pathway_tocluster?: number;
      perc_pathway_overlap?: number;
    }>(),
    filterEnrichmentFromPathwaysSuccess: props<{
      data: FisherResult[];
      query: RampQuery;
      filteredFishersDataframe?: FishersDataframe;
      perc_analyte_overlap?: number;
      min_pathway_tocluster?: number;
      perc_pathway_overlap?: number;
    }>(),
    filterEnrichmentFromPathwaysFailure: props<{ error: string }>(),
    fetchClusterFromEnrichment: props<{
      perc_analyte_overlap: number;
      min_pathway_tocluster: number;
      perc_pathway_overlap: number;
    }>(),
    fetchClusterFromEnrichmentSuccess: props<{
      data: FisherResult[];
      plot: string;
      query: RampQuery;
      dataframe?: FishersDataframe;
      openModal?: boolean;
    }>(),
    fetchClusterFromEnrichmentFailure: props<{ error: string }>(),
    fetchClusterImageFile: props<{
      perc_analyte_overlap: number;
      min_pathway_tocluster: number;
      perc_pathway_overlap: number;
    }>(),
  },
});

export const MetaboliteEnrichmentsActions = createActionGroup({
  source: 'Metabolite Enrichment',
  events: {
    fetchClassesFromMetabolites: props<{
      metabolites: string[];
      biospecimen?: string;
      background?: File;
    }>(),
    fetchClassesFromMetabolitesSuccess: props<{
      data: Classes[];
      query: RampQuery;
      dataframe?: unknown[];
    }>(),
    fetchClassesFromMetabolitesFailure: props<{ error: string }>(),
    fetchEnrichmentFromMetabolites: props<{
      metabolites: string[];
      biospecimen?: string;
      background?: File;
    }>(),
    fetchEnrichmentFromMetabolitesFile: emptyProps(),
    fetchEnrichmentFromMetabolitesSuccess: props<{
      data: RampChemicalEnrichmentResponse;
      pval_type?: string;
      pval_cutoff?: number;
    }>(),
    fetchEnrichmentFromMetabolitesFailure: props<{ error: string }>(),
    filterEnrichmentFromMetabolites: props<{
      pval_type: string;
      pval_cutoff: number;
    }>(),
    filterEnrichmentFromMetabolitesSuccess: props<{
      data: RampChemicalEnrichmentResponse;
    }>(),
    filterEnrichmentFromMetabolitesFailure: props<{ error: string }>(),
  },
});
