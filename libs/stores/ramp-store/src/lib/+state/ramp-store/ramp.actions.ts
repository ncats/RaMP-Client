import { createAction, props } from '@ngrx/store';
import {Ontology, SourceVersion} from "@ramp/models/ramp-models";
import { RampEntity } from './ramp.models';

export const initAbout = createAction('[Ramp About Page] Init');

export const loadRampSuccess = createAction(
  '[Ramp/API] Load Ramp Success',
  props<{ data: any }>()
);

export const loadRampFailure = createAction(
  '[Ramp/API] Load Ramp Failure',
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


export const fetchMetabolitesFromOntology = createAction(
  '[Ramp/API] fetchMetabolitesFromOntology',
  props<{analytes: string[]}>()
);

export const fetchMetabolitesFromOntologySuccess = createAction(
  '[Ramp/API] fetchMetabolitesFromOntology Success',
  props<{ rampStore: RampEntity[] }>()
);

export const fetchMetaboliteFromOntologyFailure = createAction(
  '[Ramp/API] Fetch Metabolite From Ontology Failure',
  props<{ error: any }>()
);

export const fetchOntologiesFromMetabolites = createAction(
  '[Ramp/API] Fetch OntologiesFromMetabolites',
  props<{analytes: string[]}>()
);

export const fetchOntologiesFromMetabolitesSuccess = createAction(
  '[Ramp/API] Fetch OntologiesFromMetabolites Success',
  props<{ ontologies: Ontology[] }>()
);

export const fetchOntologiesFromMetabolitesFailure = createAction(
  '[Ramp/API] Fetch OntologiesFromMetabolites Failure',
  props<{ error: any }>()
);

