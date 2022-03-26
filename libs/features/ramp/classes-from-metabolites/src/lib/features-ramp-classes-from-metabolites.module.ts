import { InjectionToken, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MatButtonModule } from "@angular/material/button";
import { MatIconModule } from "@angular/material/icon";
import { RouterModule, Routes } from '@angular/router';
import { SharedRampInputRowModule } from '@ramp/shared/ramp/input-row';
import { SharedRampPageCoreModule } from '@ramp/shared/ramp/page-core';
import { SharedRampQueryPageModule } from '@ramp/shared/ramp/query-page';
import { SharedUiDescriptionPanelModule } from '@ramp/shared/ui/description-panel';
import { SharedUiFeedbackPanelModule } from "@ramp/shared/ui/feedback-panel";
import {
  ObjectTreeComponent,
  SharedUiObjectTreeModule,
} from '@ramp/shared/ui/object-tree';
import { ClassesFromMetabolitesComponent } from './classes-from-metabolites/classes-from-metabolites.component';

export const TREE_VIEWER_COMPONENT = new InjectionToken<string>(
  'ObjectTreeViewerComponent'
);

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
    SharedRampInputRowModule,
    SharedUiObjectTreeModule,
    SharedUiDescriptionPanelModule,
    FlexLayoutModule,
    SharedUiFeedbackPanelModule,
    MatIconModule,
    MatButtonModule
  ],
  declarations: [ClassesFromMetabolitesComponent],
  providers: [
    { provide: TREE_VIEWER_COMPONENT, useValue: ObjectTreeComponent },
  ],
})
export class FeaturesRampClassesFromMetabolitesModule {}
