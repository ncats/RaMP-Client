import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatLegacyDialogModule as MatDialogModule } from '@angular/material/legacy-dialog';
import { ErrorDialogComponent } from './error-dialog/error-dialog.component';

@NgModule({
  imports: [CommonModule, MatDialogModule],
  declarations: [ErrorDialogComponent],
})
export class SharedUiErrorDialogModule {}
