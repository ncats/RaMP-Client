import { ScrollingModule } from '@angular/cdk/scrolling';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatInputModule } from '@angular/material/input';
import { MatTableModule } from '@angular/material/table';
import { SharedUiHighlightModule } from '@ramp/shared/ui/highlight';
import { FilterPanelComponent } from './filter-panel/filter-panel.component';

@NgModule({
  imports: [
    CommonModule,
    MatCardModule,
    MatTableModule,
    MatCheckboxModule,
    ScrollingModule,
    MatInputModule,
    ReactiveFormsModule,
    SharedUiHighlightModule,
  ],
  declarations: [FilterPanelComponent],
  exports: [FilterPanelComponent],
})
export class SharedUiFilterPanelModule {}
