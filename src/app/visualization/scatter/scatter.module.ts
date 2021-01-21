import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ScatterComponent } from './scatter.component';
import { TooltipService } from '../tooltip/tooltip.service';
import { TooltipModule } from '../tooltip/tooltip.module';

@NgModule({
  declarations: [
    ScatterComponent
  ],
  imports: [
    CommonModule,
    TooltipModule.forRoot()
  ],
  exports: [
    ScatterComponent
  ]
})
export class ScatterModule { }
