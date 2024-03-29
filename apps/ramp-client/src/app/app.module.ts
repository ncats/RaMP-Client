import { MatDialogModule } from '@angular/material/dialog';
import { BrowserModule } from '@angular/platform-browser';
import { APP_INITIALIZER, NgModule } from '@angular/core';
import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import { SharedNcatsNcatsFooterModule } from "@ramp/shared/ncats/ncats-footer";
import { SharedUiLoadingSpinnerModule } from '@ramp/shared/ui/loading-spinner';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { FeaturesRampRampHeaderModule } from '@ramp/features/ramp/ramp-header';
import {
  RampFacade,
  RampService,
  StoresRampStoreModule,
} from '@ramp/stores/ramp-store';
import { environment } from '../environments/environment';

export function set_url(rampService: RampService) {
  return () => {
    rampService._setUrl(environment.apiBaseUrl);
  };
}

export function rampInit(rampFacade: RampFacade) {
  return () => {
    rampFacade.init();
  };
}

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule.withServerTransition({ appId: 'serverApp' }),
    AppRoutingModule,
    BrowserAnimationsModule,
    FormsModule,
    MatDialogModule,
    ReactiveFormsModule,
    HttpClientModule,
    SharedUiLoadingSpinnerModule,
    FeaturesRampRampHeaderModule,
    StoresRampStoreModule,
    StoreModule.forRoot(
      {},
      {
        metaReducers: !environment.production ? [] : [],
        runtimeChecks: {
          strictActionImmutability: true,
          strictStateImmutability: true
        }
      }
    ),
    EffectsModule.forRoot([]),
    StoreDevtoolsModule.instrument({
      maxAge: 25,
      logOnly: !environment.production
    }),
    SharedNcatsNcatsFooterModule
  ],
  providers: [
    RampFacade,
    {
      provide: APP_INITIALIZER,
      useFactory: set_url,
      deps: [RampService],
      multi: true,
    },
    {
      provide: APP_INITIALIZER,
      useFactory: rampInit,
      deps: [RampFacade],
      multi: true,
    },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
