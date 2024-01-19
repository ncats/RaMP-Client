import { CommonModule } from "@angular/common";
import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogModule } from "@angular/material/dialog";

@Component({
  selector: 'ramp-error-dialog',
  templateUrl: './error-dialog.component.html',
  styleUrls: ['./error-dialog.component.scss'],
  standalone: true,
  imports: [CommonModule, MatDialogModule]
})
export class ErrorDialogComponent {
  constructor(@Inject(MAT_DIALOG_DATA) public error: Error) {}
}
