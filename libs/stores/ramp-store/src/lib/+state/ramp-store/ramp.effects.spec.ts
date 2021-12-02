import { TestBed } from '@angular/core/testing';
import { provideMockActions } from '@ngrx/effects/testing';
import { Action } from '@ngrx/store';
import { provideMockStore } from '@ngrx/store/testing';
import { NxModule } from '@nrwl/angular';
import { hot } from '@nrwl/angular/testing';
import { Observable } from 'rxjs';

import * as RampActions from './ramp.actions';
import { RampEffects } from './ramp.effects';

describe('RampEffects', () => {
  let actions: Observable<Action>;
  let effects: RampEffects;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [NxModule.forRoot()],
      providers: [
        RampEffects,
        provideMockActions(() => actions),
        provideMockStore(),
      ],
    });

    effects = TestBed.inject(RampEffects);
  });

  describe('init$', () => {
    it('should work', () => {
      actions = hot('-a-|', { a: RampEffects.init() });

      const expected = hot('-a-|', {
        a: RampEffects.loadRampStoreSuccess({ rampStore: [] }),
      });

      expect(effects.init$).toBeObservable(expected);
    });
  });
});
