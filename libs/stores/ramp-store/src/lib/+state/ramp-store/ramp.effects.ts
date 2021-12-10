import { Injectable } from '@angular/core';
import { createEffect, Actions, ofType } from '@ngrx/effects';
import { fetch } from '@nrwl/angular';
import {SourceVersion} from "@ramp/models/ramp-models";
import {mergeMap, of} from "rxjs";
import {catchError, map} from "rxjs/operators";
import {loadRampSuccess} from "./ramp.actions";

import * as RampActions from './ramp.actions';
import * as RampStoreFeature from './ramp.reducer';
import { RampService } from '@ramp/stores/ramp-store';

@Injectable()
export class RampEffects {
  initAbout$ = createEffect(() =>
    this.actions$.pipe(
      ofType(RampActions.initAbout),
      mergeMap((action) =>
        this.rampService.loadAboutData()
          .pipe(
            map((ret) => {
              console.log(ret);
              return RampActions.loadRampSuccess({ data: ret })
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

  constructor(
    private readonly actions$: Actions,
    private rampService: RampService
  ) {}
}
