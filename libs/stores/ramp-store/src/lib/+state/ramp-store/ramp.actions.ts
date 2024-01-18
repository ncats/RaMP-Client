import { createAction, createActionGroup, emptyProps, props } from "@ngrx/store";
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
import { RampEntity } from './ramp.models';

export const LoadRampActions = createActionGroup({
    source: 'Load Ramp',
    events: {
      loadRamp: emptyProps(),
      loadRampSuccess: props<{ data: [{ analyteType: string; idTypes: string[] }] }>(),
      loadRampFailure: props<{ error: any }>(),
      loadRampStats: emptyProps(),
      loadRampStatsSuccess: props<{ data: any }>(),
      loadRampStatsFailure: props<{ error: any }>(),
      loadSourceVersions: emptyProps(),
      loadSourceVersionsSuccess:  props<{ versions: SourceVersion[] }>(),
      loadSourceVersionsFailure: props<{ error: any }>()
    }
  })

export const RampAboutActions = createActionGroup({
  source: 'Ramp About Page',
    events: {
      loadEntityCounts: emptyProps(),
      loadEntityCountsSuccess: props<{ rampStore: RampEntity[] }>(),
      loadEntityCountsFailure: props<{ error: any }>(),
      loadAnalyteIntersects: emptyProps(),
      loadAnalyteIntersectsSuccess: props<{ rampStore: RampEntity[] }>(),
      loadAnalyteIntersectsFailure: props<{ error: any }>()
    }
  })

export const PathwayFromAnalyteActions = createActionGroup({
  source: 'Pathways from Analytes',
  events: {
    fetchPathwaysFromAnalytes: props<{ analytes: string[] }>(),
    fetchPathwaysFromAnalytesSuccess:  props<{
      data: Pathway[];
      query: RampQuery;
      dataframe: any;
    }>(),
    fetchPathwaysFromAnalytesFailure: props<{ error: any }>()
  }
})

export const AnalyteFromPathwayActions = createActionGroup({
  source: 'Analytes from Pathways',
  events: {
    fetchAnalytesFromPathways: props<{ pathways: string[] }>(),
    fetchAnalytesFromPathwaysSuccess:  props<{
      data: Analyte[];
      query: RampQuery;
      dataframe: any;
    }>(),
    fetchAnalytesFromPathwaysFailure: props<{ error: any }>()
  }
})

export const OntologyFromMetaboliteActions = createActionGroup({
  source: 'Ontologies from Metabolites',
  events: {
    fetchOntologiesFromMetabolites: props<{ metabolites: string[] }>(),
    fetchOntologiesFromMetabolitesSuccess:  props<{
      data: Ontology[];
      query: RampQuery;
      dataframe: any;
    }>(),
    fetchOntologiesFromMetabolitesFailure: props<{ error: any }>()
  }
})

export const FetchOntologiesActions = createActionGroup({
  source: 'Fetch Ontologies',
  events: {
    fetchOntologies: emptyProps(),
    fetchOntologiesSuccess:  props<{
      data: Ontology[];
    }>(),
    fetchOntologiesFailure: props<{ error: any }>()
  }
})

export const MetaboliteFromOntologyActions = createActionGroup({
  source: 'Metabolite from Ontologies',
  events: {
    fetchMetabolitesFromOntologies: props<{ ontologies: string[] }>(),
    fetchMetabolitesFromOntologiesFile: props<{ ontologies: string[]; format: string }>(),
    fetchMetabolitesFromOntologiesSuccess:  props<{
      data: Metabolite[];
      query: RampQuery;
      dataframe: any;
    }>(),
    fetchMetaboliteFromOntologiesFailure: props<{ error: any }>()
  }
})

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
      dataframe: any;
    }>(),
    fetchClassesFromMetabolitesFailure: props<{ error: any }>()
  }
})

export const PropertiesFromMetaboliteActions = createActionGroup({
  source: 'Properties from Metabolites',
  events: {
    fetchPropertiesFromMetabolites: props<{ metabolites: string[] }>(),
    fetchPropertiesFromMetabolitesSuccess:  props<{
      data: Properties[];
      query: RampQuery;
      dataframe: any;
    }>(),
    fetchPropertiesFromMetabolitesFailure: props<{ error: any }>()
  }
})

export const CommonReactionAnalyteActions = createActionGroup({
  source: 'Common Reaction Analytes',
  events: {
    fetchCommonReactionAnalytes: props<{ analytes: string[] }>(),
    fetchCommonReactionAnalytesSuccess:  props<{
      data: Reaction[];
      query: RampQuery;
      dataframe: any;
    }>(),
    fetchCommonReactionAnalytesFailure: props<{ error: any }>()
  }
})

export const PathwayEnrichmentsActions = createActionGroup({
  source: 'Pathway Enrichment',
  events: {
    fetchPathwaysFromAnalytes: props<{ analytes: string[] }>(),
    fetchPathwaysFromAnalytesSuccess:  props<{
      data: Pathway[];
      query: RampQuery;
      dataframe: any;
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
      combinedFishersDataframe: any;
      pval_type?: string;
      pval_cutoff?: number;
    }>(),
    fetchEnrichmentFromPathwaysFailure: props<{ error: any }>(),
    filterEnrichmentFromPathways:  props<{
      pval_type: string;
      pval_cutoff: number;
      perc_analyte_overlap?: number;
      min_pathway_tocluster?: number;
      perc_pathway_overlap?: number;
    }>(),
    filterEnrichmentFromPathwaysSuccess: props<{
        data: FisherResult[];
        query: RampQuery;
        filteredFishersDataframe?: any;
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
        dataframe: any;
        openModal?: boolean;
      }>(),
    fetchClusterFromEnrichmentFailure: props<{ error: any }>(),
    fetchClusterImageFile:  props<{
      perc_analyte_overlap: number;
      min_pathway_tocluster: number;
      perc_pathway_overlap: number;
    }>()
  }
})

export const MetaboliteEnrichmentsActions = createActionGroup({
  source: 'Metabolite Enrichment',
  events: {
    fetchEnrichmentFromMetabolites: props<{
      metabolites: string[];
      biospecimen?: string;
      background?: File;
    }>(),
    fetchEnrichmentFromMetabolitesFile: props<{ metabolites: string[]; format: string }>(),
    fetchEnrichmentFromMetabolitesSuccess: props<{
      data: ChemicalEnrichment[];
      enriched_chemical_class?: any;
      pval_type?: string;
      pval_cutoff?: number;
      dataframe: any;
    }>(),
    fetchEnrichmentFromMetabolitesFailure: props<{ error: any }>(),
    filterEnrichmentFromMetabolites:  props<{
      pval_type: string;
      pval_cutoff: number;
    }>(),
    filterEnrichmentFromMetabolitesSuccess: props<{
      data: ChemicalEnrichment[];
      enriched_chemical_class?: any;
      openModal?: boolean;
      }>(),
    filterEnrichmentFromMetabolitesFailure: props<{ error: any }>(),
  }
})
