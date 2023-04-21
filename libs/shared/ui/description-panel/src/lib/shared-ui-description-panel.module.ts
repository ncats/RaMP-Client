import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatLegacyCardModule as MatCardModule } from '@angular/material/legacy-card';
import { MatLegacyListModule as MatListModule } from '@angular/material/legacy-list';
import { DescriptionComponent } from './description/description.component';

@NgModule({
  imports: [CommonModule, MatCardModule, MatListModule],
  declarations: [DescriptionComponent],
  exports: [DescriptionComponent],
})
export class SharedUiDescriptionPanelModule {}
