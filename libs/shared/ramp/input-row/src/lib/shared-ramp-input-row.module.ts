import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {FlexLayoutModule} from "@angular/flex-layout";
import {ReactiveFormsModule} from "@angular/forms";
import {MatButtonModule} from "@angular/material/button";
import {MatFormFieldModule} from "@angular/material/form-field";
import {MatIconModule} from "@angular/material/icon";
import {MatInputModule} from "@angular/material/input";
import {MatTooltipModule} from "@angular/material/tooltip";
import { InputRowComponent } from './input-row/input-row.component';

@NgModule({
  imports: [
    CommonModule,
    MatFormFieldModule,
    ReactiveFormsModule,
    FlexLayoutModule,
    MatButtonModule,
    MatTooltipModule,
    MatInputModule,
    MatIconModule
  ],
  declarations: [
    InputRowComponent
  ],
  exports: [
    InputRowComponent
  ]
})
export class SharedRampInputRowModule {}
