import {InjectionToken, NgModule} from '@angular/core';
import { CommonModule } from '@angular/common';
import {FlexLayoutModule} from "@angular/flex-layout";
import {RouterModule, Routes} from "@angular/router";
import {SharedRampPageCoreModule} from "@ramp/shared/ramp/page-core";
import {SharedRampQueryPageModule} from "@ramp/shared/ramp/query-page";
import {SharedUiDescriptionPanelModule} from "@ramp/shared/ui/description-panel";
import {SharedUiNcatsStructureViewerModule, StructureViewerComponent} from "@ramp/shared/ui/ncats-structure-viewer";

import { PropertiesFromMetabolitesComponent } from './properties-from-metabolites/properties-from-metabolites.component';

export const STRUCTURE_VIEWER_COMPONENT = new InjectionToken<string>('StructureViewerComponent');

const ROUTES: Routes = [
  {
    path: '',
    component: PropertiesFromMetabolitesComponent,
  },
];


@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(ROUTES),
    SharedRampQueryPageModule,
    SharedRampPageCoreModule,
    SharedUiNcatsStructureViewerModule,
    SharedUiDescriptionPanelModule,
    FlexLayoutModule
  ],
  declarations: [
    PropertiesFromMetabolitesComponent
  ],
  providers: [
    {provide: STRUCTURE_VIEWER_COMPONENT, useValue: StructureViewerComponent},
  ]
})
export class FeaturesRampPropertiesFromMetabolitesModule {}
