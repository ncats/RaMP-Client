import {InjectionToken, NgModule} from '@angular/core';
import { CommonModule } from '@angular/common';
import {FlexLayoutModule} from "@angular/flex-layout";
import {RouterModule, Routes} from "@angular/router";
import {SharedRampPageCoreModule} from "@ramp/shared/ramp/page-core";
import {SharedRampQueryPageModule} from "@ramp/shared/ramp/query-page";
import {SharedUiDescriptionPanelModule} from "@ramp/shared/ui/description-panel";
import {ObjectTreeComponent, SharedUiObjectTreeModule} from "@ramp/shared/ui/object-tree";
import { ClassesFromMetabolitesComponent } from './classes-from-metabolites/classes-from-metabolites.component';

export const TREE_VIEWER_COMPONENT = new InjectionToken<string>('ObjectTreeViewerComponent');

const ROUTES: Routes = [
  {
    path: '',
    component: ClassesFromMetabolitesComponent,
  },
];


@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(ROUTES),
    SharedRampQueryPageModule,
    SharedRampPageCoreModule,
    SharedUiObjectTreeModule,
    SharedUiDescriptionPanelModule,
    FlexLayoutModule
  ],
  declarations: [
    ClassesFromMetabolitesComponent
  ],
  providers: [
    {provide: TREE_VIEWER_COMPONENT, useValue: ObjectTreeComponent},
  ]
})
export class FeaturesRampClassesFromMetabolitesModule {}
