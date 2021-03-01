import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BarComponent } from './bar.component';
import { TooltipModule } from '../tooltip/tooltip.module';



@NgModule({
  declarations: [
    BarComponent
  ],
  imports: [
    CommonModule,
    TooltipModule.forRoot()
  ],
  exports: [
    BarComponent
  ]
})
export class BarModule { }
