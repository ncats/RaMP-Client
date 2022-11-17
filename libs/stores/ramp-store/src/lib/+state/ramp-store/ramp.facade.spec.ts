import { HttpClientTestingModule } from '@angular/common/http/testing';
import { NgModule } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { EffectsModule } from '@ngrx/effects';
import { StoreModule, Store } from '@ngrx/store';
import { readFirst } from '@nrwl/angular/testing';

import * as RampActions from './ramp.actions';
import { RampEffects } from './ramp.effects';
import { RampFacade } from './ramp.facade';
import { RampEntity } from './ramp.models';
import {
  RAMP_STORE_FEATURE_KEY,
  State,
  initialState,
  reducer,
} from './ramp.reducer';
import * as RampSelectors from './ramp.selectors';

interface TestSchema {
  rampStore: State;
}

describe('RampFacade', () => {
  let facade: RampFacade;
  let store: Store<TestSchema>;
  const createRampEntity = (id: string, name = ''): RampEntity => ({
    id,
    name: name || `name-${id}`,
  });

  describe('used in NgModule', () => {
    beforeEach(() => {
      @NgModule({
        imports: [
          StoreModule.forFeature(RAMP_STORE_FEATURE_KEY, reducer),
          EffectsModule.forFeature([RampEffects]),
        ],
        providers: [RampFacade],
      })
      class CustomFeatureModule {}

      @NgModule({
        imports: [
          StoreModule.forRoot({}),
          EffectsModule.forRoot([]),
          CustomFeatureModule,
          HttpClientTestingModule,
        ],
      })
      class RootModule {}
      TestBed.configureTestingModule({ imports: [RootModule] });

      store = TestBed.inject(Store);
      facade = TestBed.inject(RampFacade);
    });

    /**
     * The initially generated facade::loadAll() returns empty array
     */
    it('loadAll() should return empty list with loading == false', async () => {
      // @ts-ignore
      let list = await readFirst(facade.allRampEntity$);
      // @ts-ignore
      let isLoaded = await readFirst(facade.loading$);

      expect(list.length).toBe(0);
      expect(isLoaded).toBe(false);

      facade.init();

      // @ts-ignore
      list = await readFirst(facade.allRampEntity$);
      // @ts-ignore
      isLoaded = await readFirst(facade.loading$);

      //  expect(list.length).toBe(0);
      expect(isLoaded).toBe(true);
    });

    /**
     * Use `loadRampStoreSuccess` to manually update list
     */
    it('allRampEntity$ should return the loaded list; and loading flag == false', async () => {
      // @ts-ignore
      let list = await readFirst(facade.allRampEntity$);
      // @ts-ignore
      let isLoaded = await readFirst(facade.loading$);

      expect(list.length).toBe(0);
      expect(isLoaded).toBe(false);

      store.dispatch(
        RampActions.loadRampSuccess({
          rampStore: [createRampEntity('AAA'), createRampEntity('BBB')],
        })
      );
      // @ts-ignore
      list = await readFirst(facade.allRampEntity$);
      // @ts-ignore
      isLoaded = await readFirst(facade.loading$);

      expect(list.length).toBe(2);
      expect(isLoaded).toBe(false);
    });
  });
});
