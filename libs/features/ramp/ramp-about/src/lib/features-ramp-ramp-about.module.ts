import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AboutComponent } from './about/about.component';
import { UiCustomMaterialModule } from '@ramp/shared/ui/custom-material';
import { SharedVisualizationsUpsetChartModule } from '@ramp/shared/visualizations/upset-chart';
import { RouterModule, Routes } from '@angular/router';

const ROUTES: Routes = [
  {
    path: '',
    component: AboutComponent,
  },
];
@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(ROUTES),
    UiCustomMaterialModule,
    SharedVisualizationsUpsetChartModule,
  ],
  declarations: [AboutComponent],
})
export class FeaturesRampRampAboutModule {}
