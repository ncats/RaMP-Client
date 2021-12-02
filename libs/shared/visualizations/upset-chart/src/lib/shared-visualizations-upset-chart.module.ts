import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UpsetComponent } from './upset/upset.component';

@NgModule({
  imports: [CommonModule],
  declarations: [UpsetComponent],
  exports: [UpsetComponent],
})
export class SharedVisualizationsUpsetChartModule {}
