import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FlexLayoutModule } from "@angular/flex-layout";
import { RouterModule, Routes } from "@angular/router";
import { RampApiComponent } from './ramp-api/ramp-api.component';

const ROUTES: Routes = [
  {
    path: '',
    component: RampApiComponent,
  },
];

@NgModule({
  imports: [
    CommonModule,
    FlexLayoutModule,
    RouterModule.forChild(ROUTES)
  ],
  declarations: [RampApiComponent],
})
export class FeaturesRampRampApiModule {}
