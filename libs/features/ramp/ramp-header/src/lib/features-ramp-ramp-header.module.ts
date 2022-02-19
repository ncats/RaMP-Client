import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FlexLayoutModule } from '@angular/flex-layout';
import { SharedUiHeaderTemplateModule } from '@ramp/shared/ui/header-template';
import { RampHeaderComponent } from './ramp-header/ramp-header.component';

@NgModule({
  imports: [CommonModule, SharedUiHeaderTemplateModule, FlexLayoutModule],
  exports: [RampHeaderComponent],
  declarations: [RampHeaderComponent],
})
export class FeaturesRampRampHeaderModule {}
