import { BrowserModule } from '@angular/platform-browser';
import { APP_INITIALIZER, NgModule } from '@angular/core';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { PathwayEnrichmentAnalysisComponent } from './pathway-enrichment-analysis/pathway-enrichment-analysis.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { LoadingModule } from './loading/loading.module';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import { AboutComponent } from './about/about.component';
import { UpsetModule } from './visualization/upset/upset.module';
import { TableDialogComponent } from './table-dialog/table-dialog.component';
import { ConfigService } from './config/config.service';
import { configServiceFactory } from './config/config.factory';
import { OntologiesComponent } from './ontologies/ontologies.component';
import { PathwaysFromAnalytesComponent } from './pathways-from-analytes/pathways-from-analytes.component';
import { CommonReactionAnalytesComponent } from './common-reaction-analytes/common-reaction-analytes.component';
import { AnalytesFromPathwayComponent } from './analytes-from-pathway/analytes-from-pathway.component';
import { SpaceToNewlinePipe } from './utilities/space-to-newline/space-to-newline.pipe';
import { ChemicalAnalysisComponent } from './chemical-analysis/chemical-analysis.component';
import { UiCustomMaterialModule } from '@ramp/shared/ui/custom-material';
import { FeaturesRampRampHeaderModule } from '@ramp/features/ramp/ramp-header';
import { RampService } from '@ramp/stores/ramp-store';
import { environment } from '../environments/environment';

export function set_url(rampService: RampService) {
  return () => {
    rampService._setUrl(environment.apiBaseUrl);
  };
}

@NgModule({
  declarations: [
    AppComponent,
    PageNotFoundComponent,
    PathwayEnrichmentAnalysisComponent,
    AboutComponent,
    TableDialogComponent,
    OntologiesComponent,
    PathwaysFromAnalytesComponent,
    CommonReactionAnalytesComponent,
    AnalytesFromPathwayComponent,
    SpaceToNewlinePipe,
    ChemicalAnalysisComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    LoadingModule.forRoot(),
    UpsetModule,
    UiCustomMaterialModule,
    FeaturesRampRampHeaderModule,
  ],
  providers: [
    ConfigService,
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
