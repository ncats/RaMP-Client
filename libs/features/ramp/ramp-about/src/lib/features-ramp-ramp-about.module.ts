import {CdkScrollableModule} from "@angular/cdk/scrolling";
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {FlexLayoutModule} from "@angular/flex-layout";
import {MatListModule} from "@angular/material/list";
import {SharedUiNcatsDatatableModule} from "@ramp/shared/ui/ncats-datatable";
import { AboutComponent } from './about/about.component';
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
    SharedVisualizationsUpsetChartModule,
    SharedUiNcatsDatatableModule,
    FlexLayoutModule,
    MatListModule,
    CdkScrollableModule
  ],
  declarations: [AboutComponent],
})
export class FeaturesRampRampAboutModule {}
