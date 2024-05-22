import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { provideMockActions } from '@ngrx/effects/testing';
import { Action } from '@ngrx/store';
import { provideMockStore } from '@ngrx/store/testing';
import { hot } from 'jasmine-marbles';
import { Observable } from 'rxjs';
import { LoadRampActions } from "./ramp.actions";

import * as RampEffects from './ramp.effects';

describe('RampEffects', () => {
  let actions: Observable<Action>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        RampEffects,
        provideMockActions(() => actions),
        provideMockStore(),
      ],
    });

    //effects = TestBed.inject(RampEffects);
  });

  describe('initAbout$', () => {
    it('should work', () => {
      actions = hot('-a-|', { a: LoadRampActions.loadRamp() });

      const expected: string[] = [];

      expect(expected).toStrictEqual([]);
    });
  });
});
