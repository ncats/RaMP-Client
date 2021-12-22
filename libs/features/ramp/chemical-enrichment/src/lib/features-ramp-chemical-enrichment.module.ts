import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {RouterModule, Routes} from "@angular/router";
import {SharedRampQueryPageModule} from "@ramp/shared/ramp/query-page";
import { ChemicalEnrichmentComponent } from './chemical-enrichment/chemical-enrichment.component';

const ROUTES: Routes = [
  {
    path: '',
    component: ChemicalEnrichmentComponent,
  },
];


@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(ROUTES),
    SharedRampQueryPageModule
  ],
  declarations: [
    ChemicalEnrichmentComponent
  ],
})
export class FeaturesRampChemicalEnrichmentModule {}
