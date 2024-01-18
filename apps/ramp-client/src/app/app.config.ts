import {
  provideHttpClient, withFetch,
  withInterceptorsFromDi
} from "@angular/common/http";
import { APP_INITIALIZER, ApplicationConfig, importProvidersFrom, inject } from "@angular/core";
import {
  BrowserModule,
  provideClientHydration,
} from '@angular/platform-browser';
import { provideAnimations } from '@angular/platform-browser/animations';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import {
  PreloadAllModules,
  provideRouter, withComponentInputBinding,
  withEnabledBlockingInitialNavigation,
  withInMemoryScrolling,
  withPreloading, withViewTransitions
} from "@angular/router";
import { EffectsModule, provideEffects } from "@ngrx/effects";
import { provideRouterStore, routerReducer, StoreRouterConnectingModule } from "@ngrx/router-store";
import { provideState, provideStore, Store, StoreModule } from "@ngrx/store";
import { provideStoreDevtools, StoreDevtoolsModule } from "@ngrx/store-devtools";
import { LoadRampActions, RAMP_STORE_FEATURE_KEY, rampReducer, RampService, RampEffects } from "@ramp/stores/ramp-store";
import { environment } from '../environments/environment';

import { routes } from './app.routes';

export function set_url(rampService: RampService) {
  return () => {
    rampService._setUrl(environment.apiBaseUrl);
  };
}

export function rampInit(store = inject(Store)) {
  return () => {
    store.dispatch(LoadRampActions.loadRamp());
  };
}

export const appConfig: ApplicationConfig = {
  providers: [
    {
      provide: APP_INITIALIZER,
      useFactory: set_url,
      deps: [RampService],
      multi: true,
    },
    {
      provide: APP_INITIALIZER,
      useFactory: rampInit,
      deps: [],
      multi: true,
    },
    provideRouter(
      routes,
      withViewTransitions(),
      withComponentInputBinding(),
      withEnabledBlockingInitialNavigation(),
      withInMemoryScrolling({
        anchorScrolling: "enabled",
        scrollPositionRestoration: "enabled"
      }),
      withPreloading(PreloadAllModules)
    ),
    provideStore({rampStore: rampReducer}),
  //  provideRouterStore(),
    provideStoreDevtools(),
    provideEffects([RampEffects]),
    provideState(RAMP_STORE_FEATURE_KEY, rampReducer),
    provideAnimations(),
    provideAnimationsAsync(),
    provideHttpClient(withInterceptorsFromDi(), withFetch())
  ]
};
