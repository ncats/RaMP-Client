import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {FlexLayoutModule} from "@angular/flex-layout";
import {RouterModule, Routes} from "@angular/router";
import {SharedRampPageCoreModule} from "@ramp/shared/ramp/page-core";
import {SharedRampQueryPageModule} from "@ramp/shared/ramp/query-page";
import {SharedUiDescriptionPanelModule} from "@ramp/shared/ui/description-panel";
import { AnalytesFromPathwaysComponent } from './analytes-from-pathways/analytes-from-pathways.component';

const ROUTES: Routes = [
  {
    path: '',
    component: AnalytesFromPathwaysComponent,
  },
];

@NgModule({
    imports: [
        CommonModule,
        RouterModule.forChild(ROUTES),
        SharedRampQueryPageModule,
        SharedUiDescriptionPanelModule,
        SharedRampPageCoreModule,
        FlexLayoutModule
    ],
  declarations: [
    AnalytesFromPathwaysComponent
  ],
})
export class FeaturesRampAnalytesFromPathwaysModule {}
