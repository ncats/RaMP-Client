import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {FlexLayoutModule} from "@angular/flex-layout";
import {MatButtonModule} from "@angular/material/button";
import {MatIconModule} from "@angular/material/icon";
import {MatTooltipModule} from "@angular/material/tooltip";
import { DataDownloadButtonComponent } from './data-download-button/data-download-button.component';

@NgModule({
  imports: [CommonModule,
    MatButtonModule,
    MatTooltipModule,
    FlexLayoutModule,
    MatIconModule
  ]
  ,
  declarations: [
    DataDownloadButtonComponent
  ],
  exports: [
    DataDownloadButtonComponent
  ]
})
export class SharedNcatsDataDownloadModule {}
