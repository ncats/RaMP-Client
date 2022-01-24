import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {MatCardModule} from "@angular/material/card";
import {MatCheckboxModule} from "@angular/material/checkbox";
import {MatTableModule} from "@angular/material/table";
import { FilterPanelComponent } from './filter-panel/filter-panel.component';

@NgModule({
  imports: [
    CommonModule,
    MatCardModule,
    MatTableModule,
    MatCheckboxModule
  ],
  declarations: [
    FilterPanelComponent
  ],
  exports: [
    FilterPanelComponent
  ]
})
export class SharedUiFilterPanelModule {}
