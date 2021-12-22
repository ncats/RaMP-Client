import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {RouterModule, Routes} from "@angular/router";
import {SharedRampQueryPageModule} from "@ramp/shared/ramp/query-page";
import {PathwayEnrichmentComponent} from "./pathway-enrichment/pathway-enrichment.component";

const ROUTES: Routes = [
  {
    path: '',
    component: PathwayEnrichmentComponent,
  },
];


@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(ROUTES),
    SharedRampQueryPageModule
  ],
  declarations: [
    PathwayEnrichmentComponent
  ],
})
export class FeaturesRampPathwayEnrichmentModule {}
