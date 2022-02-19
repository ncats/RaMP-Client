import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MatCardModule } from '@angular/material/card';
import { RouterModule, Routes } from '@angular/router';
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
    FlexLayoutModule,
    MatCardModule,
  ],
  declarations: [HomeComponent],
})
export class FeaturesRampRampHomeModule {}
