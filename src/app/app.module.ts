import { BrowserModule } from '@angular/platform-browser';
import { APP_INITIALIZER, NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';
import { PathwayEnrichmentAnalysisComponent } from './pathway-enrichment-analysis/pathway-enrichment-analysis.component';
import { MatCardModule } from '@angular/material/card';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatRadioModule } from '@angular/material/radio';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { HttpClientModule } from '@angular/common/http';
import { LoadingModule } from './loading/loading.module';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { MatIconModule } from '@angular/material/icon';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import { MatTabsModule } from '@angular/material/tabs';
import { AboutComponent } from './about/about.component';
import { ScatterModule } from './visualization/scatter/scatter.module';
import { BarModule } from './visualization/bar/bar.module';
import { MatDividerModule } from '@angular/material/divider';
import { UpsetModule } from './visualization/upset/upset.module';
import { AnalytesComponent } from './analytes/analytes.component';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { TableDialogComponent } from './table-dialog/table-dialog.component';
import { MatDialogModule } from '@angular/material/dialog';
import { MatTooltipModule } from '@angular/material/tooltip';
import { ConfigService } from './config/config.service';
import { configServiceFactory } from './config/config.factory';

@NgModule({
  declarations: [
    AppComponent,
    PageNotFoundComponent,
    PathwayEnrichmentAnalysisComponent,
    AboutComponent,
    AnalytesComponent,
    TableDialogComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MatToolbarModule,
    MatSidenavModule,
    MatListModule,
    MatCardModule,
    FormsModule,
    ReactiveFormsModule,
    MatRadioModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    HttpClientModule,
    LoadingModule.forRoot(),
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatIconModule,
    MatTabsModule,
    ScatterModule,
    BarModule,
    MatDividerModule,
    UpsetModule,
    MatCheckboxModule,
    MatDialogModule,
    MatTooltipModule
  ],
  providers: [
    ConfigService,
    {
        provide: APP_INITIALIZER,
        useFactory: configServiceFactory,
        deps: [ConfigService],
        multi: true
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
