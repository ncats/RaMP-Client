import { NgModule } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { EffectsModule } from '@ngrx/effects';
import { StoreModule, Store } from '@ngrx/store';
import { NxModule } from '@nrwl/angular';
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
import * as RampStoreSelectors from './ramp.selectors';

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
          NxModule.forRoot(),
          StoreModule.forRoot({}),
          EffectsModule.forRoot([]),
          CustomFeatureModule,
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
    it('loadAll() should return empty list with loaded == true', async () => {
      let list = await readFirst(facade.allRampStore$);
      let isLoaded = await readFirst(facade.loaded$);

      expect(list.length).toBe(0);
      expect(isLoaded).toBe(false);

      facade.init();

      list = await readFirst(facade.allRampStore$);
      isLoaded = await readFirst(facade.loaded$);

      expect(list.length).toBe(0);
      expect(isLoaded).toBe(true);
    });

    /**
     * Use `loadRampStoreSuccess` to manually update list
     */
    it('allRampStore$ should return the loaded list; and loaded flag == true', async () => {
      let list = await readFirst(facade.allRampStore$);
      let isLoaded = await readFirst(facade.loaded$);

      expect(list.length).toBe(0);
      expect(isLoaded).toBe(false);

      store.dispatch(
        RampEffects.loadRampStoreSuccess({
          rampStore: [createRampEntity('AAA'), createRampEntity('BBB')],
        })
      );

      list = await readFirst(facade.allRampStore$);
      isLoaded = await readFirst(facade.loaded$);

      expect(list.length).toBe(2);
      expect(isLoaded).toBe(true);
    });
  });
});
