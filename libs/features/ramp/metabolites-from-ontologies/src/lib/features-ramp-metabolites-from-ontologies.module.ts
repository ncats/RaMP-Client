import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {RouterModule, Routes} from "@angular/router";
import {SharedRampQueryPageModule} from "@ramp/shared/ramp/query-page";
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
    SharedRampQueryPageModule
  ],
  declarations: [
    MetabolitesFromOntologiesComponent
  ],
})
export class FeaturesRampMetabolitesFromOntologiesModule {}
