import {Injectable} from '@angular/core';
import {Actions, createEffect, ofType} from '@ngrx/effects';
import {SourceVersion} from "@ramp/models/ramp-models";
import {RampService} from '@ramp/stores/ramp-store';
import {mergeMap, of} from "rxjs";
import {catchError, map} from "rxjs/operators";

import * as RampActions from './ramp.actions';

@Injectable()
export class RampEffects {

  initAbout$ = createEffect(() =>
    this.actions$.pipe(
      ofType(RampActions.initAbout),
      mergeMap((action) =>
        this.rampService.loadAboutData()
          .pipe(
            map((ret) => {
              return RampActions.loadRampAboutSuccess({ data: ret })
              },
              catchError((error:ErrorEvent) => of(RampActions.loadSourceVersionsFailure({error})))
            )
          )
      )
    )
  );

  setSourceVersions = createEffect(() =>
    this.actions$.pipe(
      ofType(RampActions.loadSourceVersions),
      mergeMap((action) =>
           this.rampService.fetchSourceVersions()
             .pipe(
               map((ret: SourceVersion[]) => RampActions.loadSourceVersionsSuccess({ versions: ret }),
            catchError((error:ErrorEvent) => of(RampActions.loadSourceVersionsFailure({error})))
               )
             )
      )
    )
  );

  fetchOntologiesFromMetabolites = createEffect(() =>
    this.actions$.pipe(
      ofType(RampActions.fetchOntologiesFromMetabolites),
      mergeMap((action) =>
        this.rampService.fetchOntologiesFromMetabolites(action.analytes)
          .pipe(
            map((ret: any[]) => RampActions.fetchOntologiesFromMetabolitesSuccess({ ontologies: ret }),
              catchError((error:ErrorEvent) => of(RampActions.fetchOntologiesFromMetabolitesFailure({error})))
            )
          )
      )
    )
  )

  fetchAnalytesFromPathways = createEffect(() =>
    this.actions$.pipe(
      ofType(RampActions.fetchAnalytesFromPathways),
      mergeMap((action) =>
        this.rampService.fetchAnalytesFromPathways(action.pathways)
          .pipe(
            map((ret: any[]) => RampActions.fetchAnalytesFromPathwaysSuccess({ analytes: ret }),
              catchError((error:ErrorEvent) => of(RampActions.fetchAnalytesFromPathwaysFailure({error})))
            )
          )
      )
    )
  )

fetchPathwaysFromAnalytes = createEffect(() =>
    this.actions$.pipe(
      ofType(RampActions.fetchPathwaysFromAnalytes),
      mergeMap((action) =>
        this.rampService.fetchPathwaysFromAnalytes(action.analytes)
          .pipe(
            map((ret: any[]) => RampActions.fetchPathwaysFromAnalytesSuccess({ pathways: ret }),
              catchError((error:ErrorEvent) => of(RampActions.fetchPathwaysFromAnalytesFailure({error})))
            )
          )
      )
    )
  )

  constructor(
    private readonly actions$: Actions,
    private rampService: RampService
  ) {}
}
