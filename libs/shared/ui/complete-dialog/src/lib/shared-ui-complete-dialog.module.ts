import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MatButtonModule } from '@angular/material/button';
import { MatRippleModule } from '@angular/material/core';
import { MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { CompleteDialogComponent } from './complete-dialog/complete-dialog.component';

@NgModule({
  imports: [
    CommonModule,
    MatDialogModule,
    FlexLayoutModule,
    MatIconModule,
    MatRippleModule,
    MatButtonModule,
  ],
  declarations: [CompleteDialogComponent],
})
export class SharedUiCompleteDialogModule {}
