import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedUiHeaderTemplateModule } from '@ramp/shared/ui/header-template';
import { UiCustomMaterialModule } from '@ramp/shared/ui/custom-material';
import { RampHeaderComponent } from './ramp-header/ramp-header.component';
import { RouterModule } from '@angular/router';

@NgModule({
  imports: [
    CommonModule,
    RouterModule,
    SharedUiHeaderTemplateModule,
    UiCustomMaterialModule,
  ],
  exports: [RampHeaderComponent],
  declarations: [RampHeaderComponent],
})
export class FeaturesRampRampHeaderModule {}
