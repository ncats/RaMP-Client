import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {FlexLayoutModule} from "@angular/flex-layout";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {MatButtonModule} from "@angular/material/button";
import {MatFormFieldModule} from "@angular/material/form-field";
import {MatInputModule} from "@angular/material/input";
import {RouterModule, Routes} from "@angular/router";
import {SharedNcatsDataDownloadModule} from "@ramp/shared/ncats/data-download";
import {SharedRampQueryPageModule} from "@ramp/shared/ramp/query-page";
import {SharedUiDescriptionPanelModule} from "@ramp/shared/ui/description-panel";
import {SharedUiNcatsDatatableModule} from "@ramp/shared/ui/ncats-datatable";
import { OntologySearchComponent } from './ontology-search/ontology-search.component';

const ROUTES: Routes = [
  {
    path: '',
    component: OntologySearchComponent,
  },
];

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(ROUTES),
    SharedRampQueryPageModule
  ],
  declarations: [
    OntologySearchComponent
  ],
})
export class FeaturesRampOntologiesModule {}
