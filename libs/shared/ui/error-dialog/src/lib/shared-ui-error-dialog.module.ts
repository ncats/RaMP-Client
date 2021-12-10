import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ErrorDialogComponent } from './error-dialog/error-dialog.component';

@NgModule({
  imports: [CommonModule],
  declarations: [
    ErrorDialogComponent
  ],
})
export class SharedUiErrorDialogModule {}
