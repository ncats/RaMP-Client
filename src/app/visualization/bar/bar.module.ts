import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BarComponent } from './bar.component';



@NgModule({
  declarations: [
    BarComponent
  ],
  imports: [
    CommonModule
  ],
  exports: [
    BarComponent
  ]
})
export class BarModule { }
