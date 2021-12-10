import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {RouterModule, Routes} from "@angular/router";
import {UiCustomMaterialModule} from "@ramp/shared/ui/custom-material";
import { HomeComponent } from './home/home.component';

const ROUTES: Routes = [
  {
    path: '',
    component: HomeComponent,
  },
];


@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(ROUTES),
    UiCustomMaterialModule
  ],
  declarations: [
    HomeComponent
  ],
})
export class FeaturesRampRampHomeModule {}
