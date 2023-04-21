import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FlexLayoutModule } from "@angular/flex-layout";
import { MatLegacyButtonModule as MatButtonModule } from "@angular/material/legacy-button";
import { MatRippleModule } from "@angular/material/core";
import { MatLegacyDialogModule as MatDialogModule } from "@angular/material/legacy-dialog";
import { MatIconModule } from "@angular/material/icon";
import { CompleteDialogComponent } from './complete-dialog/complete-dialog.component';

@NgModule({
  imports: [CommonModule, MatDialogModule, FlexLayoutModule, MatIconModule, MatRippleModule, MatButtonModule],
  declarations: [CompleteDialogComponent],
})
export class SharedUiCompleteDialogModule {}
