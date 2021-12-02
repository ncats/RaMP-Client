import { createAction, props } from '@ngrx/store';
import { RampEntity } from './ramp.models';

export const init = createAction('[Ramp Page] Init');

export const loadRampSuccess = createAction(
  '[Ramp/API] Load Ramp Success',
  props<{ ramp: RampEntity[] }>()
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
  props<{ versions: any }>()
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
