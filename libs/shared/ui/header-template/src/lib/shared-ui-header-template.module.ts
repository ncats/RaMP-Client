import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeaderTemplateComponent } from './header-template/header-template.component';
import { RouterModule } from '@angular/router';
import { UiCustomMaterialModule } from '@ramp/shared/ui/custom-material';

@NgModule({
  imports: [CommonModule, RouterModule, UiCustomMaterialModule],
  exports: [HeaderTemplateComponent],
  declarations: [HeaderTemplateComponent],
})
export class SharedUiHeaderTemplateModule {}
