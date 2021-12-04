import { BrowserModule } from '@angular/platform-browser';
import { APP_INITIALIZER, NgModule } from '@angular/core';
import {EffectsModule} from "@ngrx/effects";
import {StoreModule} from "@ngrx/store";
import {StoreDevtoolsModule} from "@ngrx/store-devtools";
import {SharedVisualizationsUpsetChartModule} from "@ramp/shared/visualizations/upset-chart";
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { UiCustomMaterialModule } from '@ramp/shared/ui/custom-material';
import { FeaturesRampRampHeaderModule } from '@ramp/features/ramp/ramp-header';
import {RampFacade, RampService, StoresRampStoreModule} from '@ramp/stores/ramp-store';
import { environment } from '../environments/environment';

export function set_url(rampService: RampService) {
  return () => {
    rampService._setUrl(environment.apiBaseUrl);
  };
}

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    SharedVisualizationsUpsetChartModule,
    UiCustomMaterialModule,
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
    StoreDevtoolsModule.instrument({ maxAge: 25, logOnly: !environment.production })
  ],
  providers: [
    RampFacade,
    {
      provide: APP_INITIALIZER,
      useFactory: set_url,
      deps: [RampService],
      multi: true,
    },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
