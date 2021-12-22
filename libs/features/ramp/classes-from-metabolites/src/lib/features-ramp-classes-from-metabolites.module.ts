import {InjectionToken, NgModule} from '@angular/core';
import { CommonModule } from '@angular/common';
import {RouterModule, Routes} from "@angular/router";
import {SharedRampQueryPageModule} from "@ramp/shared/ramp/query-page";
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
    SharedUiObjectTreeModule
  ],
  declarations: [
    ClassesFromMetabolitesComponent
  ],
  providers: [
    {provide: TREE_VIEWER_COMPONENT, useValue: ObjectTreeComponent},
  ]
})
export class FeaturesRampClassesFromMetabolitesModule {}
