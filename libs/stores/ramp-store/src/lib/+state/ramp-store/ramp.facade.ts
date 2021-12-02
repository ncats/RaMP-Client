import { Injectable } from '@angular/core';
import { select, Store, Action } from '@ngrx/store';

import * as RampActions from './ramp.actions';
import * as RampFeature from './ramp.reducer';
import * as RampSelectors from './ramp.selectors';

@Injectable()
export class RampFacade {
  /**
   * Combine pieces of state using createSelector,
   * and expose them as observables through the facade.
   */
  loaded$ = this.store.pipe(select(RampSelectors.getRampLoaded));
  allRampStore$ = this.store.pipe(select(RampSelectors.getAllRamp));
  selectedRampStore$ = this.store.pipe(select(RampSelectors.getSelected));
  sourceVersions$ = this.store.pipe(select(RampSelectors.getSourceVersions));

  constructor(private readonly store: Store) {}

  /**
   * Use the initialization action to perform one
   * or more tasks in your Effects.
   */
  init() {
    this.store.dispatch(RampActions.init());
  }

  // Generic dispatch
  dispatch(action: Action) {
    this.store.dispatch(action);
  }
}
