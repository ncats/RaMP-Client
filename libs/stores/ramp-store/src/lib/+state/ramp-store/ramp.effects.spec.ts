import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { provideMockActions } from '@ngrx/effects/testing';
import { Action } from '@ngrx/store';
import { provideMockStore } from '@ngrx/store/testing';
import { NxModule } from '@nrwl/angular';
import { hot } from 'jasmine-marbles';
import { Observable, of } from 'rxjs';

import * as RampActions from './ramp.actions';
import { RampEffects } from './ramp.effects';

describe('RampEffects', () => {
  let actions: Observable<Action>;
  let effects: RampEffects;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [NxModule.forRoot(), HttpClientTestingModule],
      providers: [
        RampEffects,
        provideMockActions(() => actions),
        provideMockStore(),
      ],
    });

    effects = TestBed.inject(RampEffects);
  });

  describe('initAbout$', () => {
    it('should work', () => {
      actions = hot('-a-|', { a: RampActions.initAbout() });

      const expected: any[] = [];

      expect(expected).toStrictEqual([]);
    });
  });
});
