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
  loading$ = this.store.pipe(select(RampSelectors.getRampLoaded));
  allRampEntity$ = this.store.pipe(select(RampSelectors.getAllRampEntity));
  allRampStore$ = this.store.pipe(select(RampSelectors.getAllRamp));
  selectedRampStore$ = this.store.pipe(select(RampSelectors.getSelected));
  sourceVersions$ = this.store.pipe(select(RampSelectors.getSourceVersions));
  error$ = this.store.pipe(select(RampSelectors.getRampError));
  ontologies$ = this.store.pipe(select(RampSelectors.getOntologies));
  ontologiesList$ = this.store.pipe(select(RampSelectors.getontologiesList));
  analytes$ = this.store.pipe(select(RampSelectors.getAnalytes));
  pathways$ = this.store.pipe(select(RampSelectors.getPathways));
  metabolites$ = this.store.pipe(select(RampSelectors.getMetabolites));
  reactions$ = this.store.pipe(select(RampSelectors.getCommonReactions));
  classes$ = this.store.pipe(select(RampSelectors.getClasses));
  properties$ = this.store.pipe(select(RampSelectors.getProperties));
  chemicalEnrichment$ = this.store.pipe(select(RampSelectors.getChemicalEnrichment));
  pathwayEnrichment$ = this.store.pipe(select(RampSelectors.getPathwayEnrichment));

  constructor(private readonly store: Store) {}

  /**
   * Use the initialization action to perform one
   * or more tasks in your Effects.
   */
  init() {
    this.store.dispatch(RampActions.init());
  }
  initAbout() {
    this.store.dispatch(RampActions.initAbout());
  }

  // Generic dispatch
  dispatch(action: Action) {
    this.store.dispatch(action);
  }
}
