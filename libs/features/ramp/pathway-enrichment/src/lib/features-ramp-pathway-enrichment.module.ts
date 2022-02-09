import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {FlexLayoutModule} from "@angular/flex-layout";
import {ReactiveFormsModule} from "@angular/forms";
import {MatCheckboxModule} from "@angular/material/checkbox";
import {MatFormFieldModule} from "@angular/material/form-field";
import {MatInputModule} from "@angular/material/input";
import {MatSliderModule} from "@angular/material/slider";
import {MatTabsModule} from "@angular/material/tabs";
import {RouterModule, Routes} from "@angular/router";
import {FeaturesRampPathwaysFromAnalytesModule} from "@ramp/features/ramp/pathways-from-analytes";
import {SharedRampInputRowModule} from "@ramp/shared/ramp/input-row";
import {SharedRampPageCoreModule} from "@ramp/shared/ramp/page-core";
import {SharedRampQueryPageModule} from "@ramp/shared/ramp/query-page";
import {SharedUiDescriptionPanelModule} from "@ramp/shared/ui/description-panel";
import {SharedUiLoadingSpinnerModule} from "@ramp/shared/ui/loading-spinner";
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
        SharedUiLoadingSpinnerModule,
        SharedRampPageCoreModule,
        SharedRampInputRowModule,
        SharedUiDescriptionPanelModule,
        MatInputModule,
        MatTabsModule,
        MatCheckboxModule
    ],
  declarations: [
    PathwayEnrichmentComponent
  ],
})
export class FeaturesRampPathwayEnrichmentModule {}
