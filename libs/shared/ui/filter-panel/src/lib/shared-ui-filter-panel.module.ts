import { ScrollingModule } from '@angular/cdk/scrolling';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { MatLegacyCardModule as MatCardModule } from '@angular/material/legacy-card';
import { MatLegacyCheckboxModule as MatCheckboxModule } from '@angular/material/legacy-checkbox';
import { MatLegacyInputModule as MatInputModule } from '@angular/material/legacy-input';
import { MatLegacyTableModule as MatTableModule } from '@angular/material/legacy-table';
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
