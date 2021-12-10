import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {RouterModule, Routes} from "@angular/router";
import {UiCustomMaterialModule} from "@ramp/shared/ui/custom-material";
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
    UiCustomMaterialModule,
    RouterModule.forChild(ROUTES),
    ReactiveFormsModule,
    FormsModule],
  declarations: [
    OntologySearchComponent
  ],
})
export class FeaturesRampOntologiesModule {}
