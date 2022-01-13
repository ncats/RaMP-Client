import { createAction, props } from '@ngrx/store';
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
import { RampEntity} from './ramp.models';

export const init = createAction('[Ramp] Init');

export const initSuccess = createAction(
  '[Ramp/API] init Success',
  props<{
    metabolites: string[],
    genes: string[]
  }>()
);

export const initFailure = createAction(
  '[Ramp/API] init Failure',
  props<{ error: any }>()
);
export const initAbout = createAction('[Ramp About Page] Init');

export const loadRampSuccess = createAction(
  '[Ramp/API] Load Ramp Success',
  props<{ rampStore: RampEntity[] }>()
);

export const loadRampFailure = createAction(
  '[Ramp/API] Load Ramp Failure',
  props<{ error: any }>()
);

export const loadRampAboutSuccess = createAction(
  '[Ramp/API] Load Ramp About Success',
  props<{ data: any }>()
);

export const loadRampAboutFailure = createAction(
  '[Ramp/API] Load Ramp About Failure',
  props<{ error: any }>()
);

export const loadSourceVersions = createAction(
  '[Ramp/API] Load SourceVersions'
);

export const loadSourceVersionsSuccess = createAction(
  '[Ramp/API] Load SourceVersions Success',
  props<{ versions: SourceVersion[] }>()
);

export const loadSourceVersionsFailure = createAction(
  '[Ramp/API] Load SourceVersions Failure',
  props<{ error: any }>()
);

export const loadEntityCounts = createAction('[Ramp/API] Load EntityCounts');

export const loadEntityCountsSuccess = createAction(
  '[Ramp/API] Load EntityCounts Success',
  props<{ rampStore: RampEntity[] }>()
);

export const loadEntityCountsFailure = createAction(
  '[Ramp/API] Load EntityCounts Failure',
  props<{ error: any }>()
);

export const loadAnalyteIntersects = createAction(
  '[Ramp/API] Load AnalyteIntersects'
);

export const loadAnalyteIntersectsSuccess = createAction(
  '[Ramp/API] Load AnalyteIntersects Success',
  props<{ rampStore: RampEntity[] }>()
);

export const loadAnalyteIntersectsFailure = createAction(
  '[Ramp/API] Load AnalyteIntersects Failure',
  props<{ error: any }>()
);


export const fetchMetabolitesFromOntologies = createAction(
  '[Ramp/API] fetchMetabolitesFromOntologies',
  props<{ontologies: string[]}>()
);

export const fetchMetabolitesFromOntologiesSuccess = createAction(
  '[Ramp/API] fetchMetabolitesFromOntologies Success',
  props<{
    data: Metabolite[],
    query: RampQuery
  }>()
);

export const fetchMetaboliteFromOntologiesFailure = createAction(
  '[Ramp/API] Fetch Metabolite From Ontologies Failure',
  props<{ error: any }>()
);

export const fetchOntologiesFromMetabolites = createAction(
  '[Ramp/API] Fetch OntologiesFromMetabolites',
  props<{analytes: string[]}>()
);

export const fetchOntologiesFromMetabolitesSuccess = createAction(
  '[Ramp/API] Fetch OntologiesFromMetabolites Success',
  props<{
    data: Ontology[],
    query: RampQuery
  }>()
);

export const fetchOntologiesFromMetabolitesFailure = createAction(
  '[Ramp/API] Fetch OntologiesFromMetabolites Failure',
  props<{ error: any }>()
);

export const fetchAnalytesFromPathways = createAction(
  '[Ramp/API] Fetch fetchAnalytesFromPathways',
  props<{ pathways: string[] }>()
);

export const fetchAnalytesFromPathwaysFile = createAction(
  '[Ramp/API] Fetch fetchAnalytesFromPathwaysFile',
  props<{ pathways: string[], format: string }>()
);

export const fetchAnalytesFromPathwaysSuccess = createAction(
  '[Ramp/API] Fetch fetchAnalytesFromPathways Success',
  props<{
    data: Analyte[],
    query: RampQuery
  }>()
);

export const fetchAnalytesFromPathwaysFailure = createAction(
  '[Ramp/API] Fetch fetchAnalytesFromPathways Failure',
  props<{ error: any }>()
);

export const fetchPathwaysFromAnalytes = createAction(
  '[Ramp/API] Fetch fetchPathwaysFromAnalytes',
  props<{analytes: string[]}>()
);

export const fetchPathwaysFromAnalytesFile = createAction(
  '[Ramp/API] Fetch fetchPathwaysFromAnalytesFile',
  props<{ analytes: string[], format: string }>()
);

export const fetchPathwaysFromAnalytesSuccess = createAction(
  '[Ramp/API] Fetch fetchPathwaysFromAnalytes Success',
  props<{
    data: Pathway[],
    query: RampQuery
  }>());

export const fetchPathwaysFromAnalytesFailure = createAction(
  '[Ramp/API] Fetch fetchPathwaysFromAnalytes Failure',
  props<{ error: any }>()
);

export const fetchOntologies = createAction(
  '[Ramp/API] Fetch fetchOntologies'
);

export const fetchOntologiesSuccess = createAction(
  '[Ramp/API] Fetch fetchOntologies Success',
  props<{ ontologies: any[]}>()
);

export const fetchOntologiesFailure = createAction(
  '[Ramp/API] Fetch fetchOntologies Failure',
  props<{ error: any }>()
);

export const fetchCommonReactionAnalytes = createAction(
  '[Ramp/API] Fetch fetchCommonReactionAnalytes',
  props<{analytes: string[]}>()
);

export const fetchCommonReactionAnalytesFile = createAction(
  '[Ramp/API] Fetch ffetchCommonReactionAnalytes',
  props<{ analytes: string[], format: string }>()
);

export const fetchCommonReactionAnalytesSuccess = createAction(
  '[Ramp/API] Fetch fetchCommonReactionAnalytes Success',
  props<{
    data: Reaction[],
    query: RampQuery
  }>()
);

export const fetchCommonReactionAnalytesFailure = createAction(
  '[Ramp/API] Fetch fetchCommonReactionAnalytes Failure',
  props<{ error: any }>()
);

export const fetchClassesFromMetabolites = createAction(
  '[Ramp/API] Fetch fetchClassesFromMetabolites',
  props<{metabolites: string[]}>()
);

export const fetchClassesFromMetabolitesFile = createAction(
  '[Ramp/API] Fetch fetchClassesFromMetabolitesFile',
  props<{metabolites: string[], format: string }>()
);

export const fetchClassesFromMetabolitesSuccess = createAction(
  '[Ramp/API] Fetch fetchClassesFromMetabolites Success',
  props<{
    data: Classes[],
    query: RampQuery
  }>()
);

export const fetchClassesFromMetabolitesFailure = createAction(
  '[Ramp/API] Fetch fetchClassesFromMetabolites Failure',
  props<{ error: any }>()
);

export const fetchPropertiesFromMetabolites = createAction(
  '[Ramp/API] Fetch fetchPropertiesFromMetabolites',
  props<{metabolites: string[]}>()
);

export const fetchPropertiesFromMetabolitesFile = createAction(
  '[Ramp/API] Fetch fetchPropertiesFromMetabolitesFile',
  props<{metabolites: string[], format: string }>()
);

export const fetchPropertiesFromMetabolitesSuccess = createAction(
  '[Ramp/API] Fetch fetchPropertiesFromMetabolites Success',
  props<{
    data: Properties[],
    query: RampQuery
  }>()
);

export const fetchPropertiesFromMetabolitesFailure = createAction(
  '[Ramp/API] Fetch fetchPropertiesFromMetabolites Failure',
  props<{ error: any }>()
);
export const fetchEnrichmentFromAnalytes = createAction(
  '[Ramp/API] Fetch fetchEnrichmentFromAnalytes',
  props<{analytes: string[]}>()
);

export const fetchEnrichmentFromAnalytesSuccess = createAction(
  '[Ramp/API] Fetch fetchEnrichmentFromAnalytes Success',
  props<{ chemicalEnrichments: any}>()
);

export const fetchEnrichmentFromAnalytesFailure = createAction(
  '[Ramp/API] Fetch fetchEnrichmentFromAnalytes Failure',
  props<{ error: any }>()
);
export const fetchEnrichmentFromPathways = createAction(
  '[Ramp/API] Fetch fetchEnrichmentFromPathways',
  props<{pathways: string[],
    p_holmadj_cutoff: number,
    p_fdradj_cutoff: number
  }>()
);

export const fetchEnrichmentFromPathwaysSuccess = createAction(
  '[Ramp/API] Fetch fetchEnrichmentFromPathways Success',
  props<{ pathwayEnrichments: any}>()
);

export const fetchEnrichmentFromPathwaysFailure = createAction(
  '[Ramp/API] Fetch fetchEnrichmentFromPathways Failure',
  props<{ error: any }>()
);

