import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {FlexLayoutModule} from "@angular/flex-layout";
import {ReactiveFormsModule} from "@angular/forms";
import {MatFormFieldModule} from "@angular/material/form-field";
import {MatInputModule} from "@angular/material/input";
import {MatSliderModule} from "@angular/material/slider";
import {RouterModule, Routes} from "@angular/router";
import {SharedRampPageCoreModule} from "@ramp/shared/ramp/page-core";
import {SharedRampQueryPageModule} from "@ramp/shared/ramp/query-page";
import {SharedUiDescriptionPanelModule} from "@ramp/shared/ui/description-panel";
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
    SharedRampQueryPageModule,
    FlexLayoutModule,
    MatFormFieldModule,
    MatSliderModule,
    ReactiveFormsModule,
    SharedRampPageCoreModule,
    SharedUiDescriptionPanelModule,
    MatInputModule
  ],
  declarations: [
    PathwayEnrichmentComponent
  ],
})
export class FeaturesRampPathwayEnrichmentModule {}
