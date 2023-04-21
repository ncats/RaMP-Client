import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MatLegacyButtonModule as MatButtonModule } from '@angular/material/legacy-button';
import { MatIconModule } from '@angular/material/icon';
import { MatLegacyTooltipModule as MatTooltipModule } from '@angular/material/legacy-tooltip';
import { DataDownloadButtonComponent } from './data-download-button/data-download-button.component';

@NgModule({
  imports: [
    CommonModule,
    MatButtonModule,
    MatTooltipModule,
    FlexLayoutModule,
    MatIconModule,
  ],
  declarations: [DataDownloadButtonComponent],
  exports: [DataDownloadButtonComponent],
})
export class SharedNcatsDataDownloadModule {}
