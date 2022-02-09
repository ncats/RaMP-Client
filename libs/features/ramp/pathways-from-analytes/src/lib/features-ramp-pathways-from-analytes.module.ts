import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {FlexLayoutModule} from "@angular/flex-layout";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {MatButtonModule} from "@angular/material/button";
import {MatFormFieldModule} from "@angular/material/form-field";
import {MatInputModule} from "@angular/material/input";
import {RouterModule, Routes} from "@angular/router";
import {SharedNcatsDataDownloadModule} from "@ramp/shared/ncats/data-download";
import {SharedRampInputRowModule} from "@ramp/shared/ramp/input-row";
import {SharedRampQueryPageModule} from "@ramp/shared/ramp/query-page";
import {SharedUiDescriptionPanelModule} from "@ramp/shared/ui/description-panel";
import {SharedUiNcatsDatatableModule} from "@ramp/shared/ui/ncats-datatable";
import { PathwaysFromAnalytesComponent } from './pathways-from-analytes/pathways-from-analytes.component';

const ROUTES: Routes = [
  {
    path: '',
    component: PathwaysFromAnalytesComponent,
  },
];

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(ROUTES),
    SharedRampQueryPageModule,
    SharedRampInputRowModule,
    SharedUiDescriptionPanelModule,
    FlexLayoutModule
  ],
  declarations: [
    PathwaysFromAnalytesComponent
  ],
  exports: [
    PathwaysFromAnalytesComponent
  ]
})
export class FeaturesRampPathwaysFromAnalytesModule {}
