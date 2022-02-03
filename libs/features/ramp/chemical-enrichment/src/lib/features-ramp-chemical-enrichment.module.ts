import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {FlexLayoutModule} from "@angular/flex-layout";
import {RouterModule, Routes} from "@angular/router";
import {SharedRampPageCoreModule} from "@ramp/shared/ramp/page-core";
import {SharedRampQueryPageModule} from "@ramp/shared/ramp/query-page";
import {SharedUiDescriptionPanelModule} from "@ramp/shared/ui/description-panel";
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
    SharedRampQueryPageModule,
    SharedRampPageCoreModule,
    SharedUiDescriptionPanelModule,
    FlexLayoutModule
  ],
  declarations: [
    ChemicalEnrichmentComponent
  ],
})
export class FeaturesRampChemicalEnrichmentModule {}
