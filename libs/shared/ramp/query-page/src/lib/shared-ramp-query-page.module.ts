import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {FlexLayoutModule} from "@angular/flex-layout";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {MatButtonModule} from "@angular/material/button";
import {MatFormFieldModule} from "@angular/material/form-field";
import {MatIconModule} from "@angular/material/icon";
import {MatInputModule} from "@angular/material/input";
import {MatTooltipModule} from "@angular/material/tooltip";
import {SharedNcatsDataDownloadModule} from "@ramp/shared/ncats/data-download";
import {SharedUiDescriptionPanelModule} from "@ramp/shared/ui/description-panel";
import {SharedUiNcatsDatatableModule} from "@ramp/shared/ui/ncats-datatable";
import { QueryPageComponent } from './query-page/query-page.component';

@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    MatFormFieldModule,
    FlexLayoutModule,
    MatInputModule,
    MatButtonModule,
    SharedUiDescriptionPanelModule,
    SharedUiNcatsDatatableModule,
    SharedNcatsDataDownloadModule,
    MatIconModule,
    MatTooltipModule
  ],
  declarations: [
    QueryPageComponent
  ],
  exports: [
    QueryPageComponent
  ]
})
export class SharedRampQueryPageModule {}
