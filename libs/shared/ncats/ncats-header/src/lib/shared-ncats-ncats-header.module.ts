import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedUiHeaderTemplateModule } from '@ramp/shared/ui/header-template';
import { UiCustomMaterialModule } from '@ramp/shared/ui/custom-material';

@NgModule({
  imports: [CommonModule, SharedUiHeaderTemplateModule, UiCustomMaterialModule],
})
export class SharedNcatsNcatsHeaderModule {}
