import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {FlexLayoutModule} from "@angular/flex-layout";
import {ReactiveFormsModule} from "@angular/forms";
import {MatButtonModule} from "@angular/material/button";
import {MatFormFieldModule} from "@angular/material/form-field";
import {MatInputModule} from "@angular/material/input";
import {RouterModule, Routes} from "@angular/router";
import {SharedNcatsDataDownloadModule} from "@ramp/shared/ncats/data-download";
import {SharedUiDescriptionPanelModule} from "@ramp/shared/ui/description-panel";
import {SharedUiNcatsDatatableModule} from "@ramp/shared/ui/ncats-datatable";
import { MetabolitesFromOntologiesComponent } from './metabolites-from-ontologies/metabolites-from-ontologies.component';


const ROUTES: Routes = [
  {
    path: '',
    component: MetabolitesFromOntologiesComponent,
  },
];

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(ROUTES),
    FlexLayoutModule,
    MatFormFieldModule,
    MatInputModule,
    ReactiveFormsModule,
    MatButtonModule,
    SharedUiNcatsDatatableModule,
    SharedNcatsDataDownloadModule,
    SharedUiDescriptionPanelModule
  ],
  declarations: [
    MetabolitesFromOntologiesComponent
  ],
})
export class FeaturesRampMetabolitesFromOntologiesModule {}
