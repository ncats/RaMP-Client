import { Injectable } from '@angular/core';
import { createEffect, Actions, ofType } from '@ngrx/effects';
import { fetch } from '@nrwl/angular';

import * as RampActions from './ramp.actions';
import * as RampStoreFeature from './ramp.reducer';
import { RampService } from '@ramp/stores/ramp-store';

@Injectable()
export class RampEffects {
  init$ = createEffect(() =>
    this.actions$.pipe(
      ofType(RampActions.init),
      fetch({
        run: (action) => {
          // Your custom service 'load' logic goes here. For now just return a success action...
          return RampActions.loadRampSuccess({ ramp: [] });
        },
        onError: (action, error) => {
          console.error('Error', error);
          return RampActions.loadRampFailure({ error });
        },
      })
    )
  );

  setSourceVersions = createEffect(() =>
    this.actions$.pipe(
      ofType(RampActions.loadSourceVersions),
      fetch({
        run: (action) => {
          this.rampService.fetchSourceVersions().subscribe((ret) => {
            console.log(ret);
            return RampActions.loadSourceVersionsSuccess({ versions: ret });
          });
        },

        onError: (action, error) => {
          console.error('Error', error);
          return RampActions.loadSourceVersionsFailure({ error });
        },
      })
    )
  );

  constructor(
    private readonly actions$: Actions,
    private rampService: RampService
  ) {}
}
