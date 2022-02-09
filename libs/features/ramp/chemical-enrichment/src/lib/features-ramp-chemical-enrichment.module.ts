import {InjectionToken, NgModule} from '@angular/core';
import { CommonModule } from '@angular/common';
import {FlexLayoutModule} from "@angular/flex-layout";
import {MatFormFieldModule} from "@angular/material/form-field";
import {MatTabsModule} from "@angular/material/tabs";
import {RouterModule, Routes} from "@angular/router";
import {SharedRampInputRowModule} from "@ramp/shared/ramp/input-row";
import {SharedRampPageCoreModule} from "@ramp/shared/ramp/page-core";
import {SharedRampQueryPageModule} from "@ramp/shared/ramp/query-page";
import {SharedUiDescriptionPanelModule} from "@ramp/shared/ui/description-panel";
import {SharedUiLoadingSpinnerModule} from "@ramp/shared/ui/loading-spinner";
import {ObjectTreeComponent, SharedUiObjectTreeModule} from "@ramp/shared/ui/object-tree";
import { ChemicalEnrichmentComponent } from './chemical-enrichment/chemical-enrichment.component';

export const TREE_VIEWER_COMPONENT = new InjectionToken<string>('ObjectTreeViewerComponent');

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
    SharedRampInputRowModule,
    SharedUiLoadingSpinnerModule,
    SharedUiObjectTreeModule,
    SharedUiDescriptionPanelModule,
    FlexLayoutModule,
    MatTabsModule,
    MatFormFieldModule
  ],
  declarations: [
    ChemicalEnrichmentComponent
  ],
  providers: [
    {provide: TREE_VIEWER_COMPONENT, useValue: ObjectTreeComponent},
  ]
})
export class FeaturesRampChemicalEnrichmentModule {}
