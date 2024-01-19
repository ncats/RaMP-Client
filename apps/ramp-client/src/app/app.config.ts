import {
  provideHttpClient, withFetch,
  withInterceptorsFromDi
} from "@angular/common/http";
import { APP_INITIALIZER, ApplicationConfig, inject } from "@angular/core";
import {
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
import { provideEffects } from "@ngrx/effects";
import { provideState, provideStore, Store } from "@ngrx/store";
import { provideStoreDevtools } from "@ngrx/store-devtools";
import {
  LoadRampActions,
  RampService,
  RampEffects,
  rampReducer,
  RAMP_STORE_FEATURE_KEY
} from "@ramp/stores/ramp-store";
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
    provideHttpClient(withInterceptorsFromDi(), withFetch()),
    provideClientHydration()
  ]
};
