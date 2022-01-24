import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {FlexLayoutModule} from "@angular/flex-layout";
import {MatCheckboxModule} from "@angular/material/checkbox";
import {RouterModule, Routes} from "@angular/router";
import {SharedRampQueryPageModule} from "@ramp/shared/ramp/query-page";
import {SharedUiFilterPanelModule} from "@ramp/shared/ui/filter-panel";
import {SharedUiObjectTreeModule} from "@ramp/shared/ui/object-tree";
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
        SharedRampQueryPageModule,
        SharedUiObjectTreeModule,
        MatCheckboxModule,
        SharedUiFilterPanelModule,
        FlexLayoutModule
    ],
  declarations: [
    MetabolitesFromOntologiesComponent
  ],
})
export class FeaturesRampMetabolitesFromOntologiesModule {}
