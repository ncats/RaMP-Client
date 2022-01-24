import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {MatCardModule} from "@angular/material/card";
import {MatListModule} from "@angular/material/list";
import { DescriptionComponent } from './description/description.component';

@NgModule({
    imports: [CommonModule, MatCardModule, MatListModule],
  declarations: [
    DescriptionComponent
  ],
  exports: [DescriptionComponent]
})
export class SharedUiDescriptionPanelModule {}
