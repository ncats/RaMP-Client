import { createActionGroup, emptyProps, props } from '@ngrx/store';
import {
  Analyte,
  ChemicalEnrichment,
  Classes,
  FisherResult,
  FishersDataframe,
  Metabolite,
  Ontology,
  OntologyList,
  Pathway,
  Properties,
  RampQuery,
  RampResponse,
  Reaction,
  SourceVersion,
} from '@ramp/models/ramp-models';
import { RampEntity } from './ramp.models';

export const LoadRampActions = createActionGroup({
  source: 'Load Ramp',
  events: {
    loadRamp: emptyProps(),
    loadRampSuccess: props<{
      data: [{ analyteType: string; idTypes: string[] }];
    }>(),
    loadRampFailure: props<{ error: any }>(),
    loadRampStats: emptyProps(),
    loadRampStatsSuccess: props<{ data: any }>(),
    loadRampStatsFailure: props<{ error: any }>(),
    loadSourceVersions: emptyProps(),
    loadSourceVersionsSuccess: props<{ versions: SourceVersion[] }>(),
    loadSourceVersionsFailure: props<{ error: any }>(),
  },
});

export const RampAboutActions = createActionGroup({
  source: 'Ramp About Page',
  events: {
    loadEntityCounts: emptyProps(),
    loadEntityCountsSuccess: props<{ rampStore: RampEntity[] }>(),
    loadEntityCountsFailure: props<{ error: any }>(),
    loadAnalyteIntersects: emptyProps(),
    loadAnalyteIntersectsSuccess: props<{ rampStore: RampEntity[] }>(),
    loadAnalyteIntersectsFailure: props<{ error: any }>(),
  },
});

export const PathwayFromAnalyteActions = createActionGroup({
  source: 'Pathways from Analytes',
  events: {
    fetchPathwaysFromAnalytes: props<{ analytes: string[] }>(),
    fetchPathwaysFromAnalytesSuccess: props<{
      data: Pathway[];
      query: RampQuery;
      dataframe?: FishersDataframe;
    }>(),
    fetchPathwaysFromAnalytesFailure: props<{ error: any }>(),
  },
});

export const AnalyteFromPathwayActions = createActionGroup({
  source: 'Analytes from Pathways',
  events: {
    fetchAnalytesFromPathways: props<{ pathways: string[] }>(),
    fetchAnalytesFromPathwaysSuccess: props<{
      data: Analyte[];
      query: RampQuery;
      dataframe?: FishersDataframe;
    }>(),
    fetchAnalytesFromPathwaysFailure: props<{ error: any }>(),
  },
});

export const OntologyFromMetaboliteActions = createActionGroup({
  source: 'Ontologies from Metabolites',
  events: {
    fetchOntologiesFromMetabolites: props<{ metabolites: string[] }>(),
    fetchOntologiesFromMetabolitesSuccess: props<{
      data: Ontology[];
      query: RampQuery;
      dataframe?: FishersDataframe;
    }>(),
    fetchOntologiesFromMetabolitesFailure: props<{ error: any }>(),
  },
});

export const MetaboliteFromOntologyActions = createActionGroup({
  source: 'Metabolite from Ontologies',
  events: {
    fetchOntologies: emptyProps(),
    fetchOntologiesSuccess: props<{
      data: OntologyList[];
    }>(),
    fetchOntologiesFailure: props<{ error: any }>(),
    fetchMetabolitesFromOntologies: props<{ ontologies: string[] }>(),
    fetchMetabolitesFromOntologiesFile: props<{
      ontologies: string[];
      format: string;
    }>(),
    fetchMetabolitesFromOntologiesSuccess: props<{
      data: Metabolite[];
      query: RampQuery;
      dataframe?: FishersDataframe;
    }>(),
    fetchMetaboliteFromOntologiesFailure: props<{ error: any }>(),
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
      dataframe?: FishersDataframe;
    }>(),
    fetchClassesFromMetabolitesFailure: props<{ error: any }>(),
  },
});

export const PropertiesFromMetaboliteActions = createActionGroup({
  source: 'Properties from Metabolites',
  events: {
    fetchPropertiesFromMetabolites: props<{ metabolites: string[] }>(),
    fetchPropertiesFromMetabolitesSuccess: props<RampResponse<Properties>>(),
    fetchPropertiesFromMetabolitesFailure: props<{ error: any }>(),
  },
});

export const CommonReactionAnalyteActions = createActionGroup({
  source: 'Common Reaction Analytes',
  events: {
    fetchCommonReactionAnalytes: props<{ analytes: string[] }>(),
    fetchCommonReactionAnalytesSuccess: props<{
      data: Reaction[];
      query: RampQuery;
      dataframe?: FishersDataframe;
    }>(),
    fetchCommonReactionAnalytesFailure: props<{ error: any }>(),
  },
});

export const PathwayEnrichmentsActions = createActionGroup({
  source: 'Pathway Enrichment',
  events: {
    fetchPathwaysFromAnalytes: props<{ analytes: string[] }>(),
    fetchPathwaysFromAnalytesSuccess: props<{
      data: Pathway[];
      query: RampQuery;
      dataframe?: FishersDataframe;
    }>(),
    fetchPathwaysFromAnalytesFailure: props<{ error: any }>(),
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
    fetchEnrichmentFromPathwaysFailure: props<{ error: any }>(),
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
    filterEnrichmentFromPathwaysFailure: props<{ error: any }>(),
    fetchClusterFromEnrichment: props<{
      perc_analyte_overlap: number;
      min_pathway_tocluster: number;
      perc_pathway_overlap: number;
    }>(),
    fetchClusterFromEnrichmentSuccess: props<{
      data: FisherResult[];
      plot: any;
      query: RampQuery;
      dataframe?: FishersDataframe;
      openModal?: boolean;
    }>(),
    fetchClusterFromEnrichmentFailure: props<{ error: any }>(),
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
    fetchEnrichmentFromMetabolites: props<{
      metabolites: string[];
      biospecimen?: string;
      background?: File;
    }>(),
    fetchEnrichmentFromMetabolitesFile: emptyProps(),
    fetchEnrichmentFromMetabolitesSuccess: props<{
      data: ChemicalEnrichment[];
      enriched_chemical_class?: any;
      pval_type?: string;
      pval_cutoff?: number;
      dataframe?: FishersDataframe;
    }>(),
    fetchEnrichmentFromMetabolitesFailure: props<{ error: any }>(),
    filterEnrichmentFromMetabolites: props<{
      pval_type: string;
      pval_cutoff: number;
    }>(),
    filterEnrichmentFromMetabolitesSuccess: props<{
      data: ChemicalEnrichment[];
      enriched_chemical_class?: any;
      openModal?: boolean;
    }>(),
    filterEnrichmentFromMetabolitesFailure: props<{ error: any }>(),
  },
});
