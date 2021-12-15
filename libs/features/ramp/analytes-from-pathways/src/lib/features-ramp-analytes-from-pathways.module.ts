import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {RouterModule, Routes} from "@angular/router";
import {SharedNcatsDataDownloadModule} from "@ramp/shared/ncats/data-download";
import {UiCustomMaterialModule} from "@ramp/shared/ui/custom-material";
import {SharedUiDescriptionPanelModule} from "@ramp/shared/ui/description-panel";
import {SharedUiNcatsDatatableModule} from "@ramp/shared/ui/ncats-datatable";
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
    UiCustomMaterialModule,
    RouterModule.forChild(ROUTES),
    ReactiveFormsModule,
    FormsModule,
    SharedUiNcatsDatatableModule,
    SharedNcatsDataDownloadModule,
    SharedUiDescriptionPanelModule
  ],  declarations: [
    AnalytesFromPathwaysComponent
  ],
})
export class FeaturesRampAnalytesFromPathwaysModule {}
