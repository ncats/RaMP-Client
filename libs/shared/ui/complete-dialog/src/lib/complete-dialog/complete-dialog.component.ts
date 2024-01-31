import { Component, Inject } from '@angular/core';
import {
  MAT_DIALOG_DATA,
  MatDialogRef,
  MatDialogTitle,
  MatDialogContent,
  MatDialogActions,
} from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';

import { MatRippleModule } from '@angular/material/core';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'ramp-complete-dialog',
  templateUrl: './complete-dialog.component.html',
  styleUrls: ['./complete-dialog.component.scss'],
  standalone: true,
  imports: [
    MatDialogTitle,
    MatIconModule,
    MatRippleModule,
    MatDialogContent,
    MatDialogActions,
    MatButtonModule,
  ],
})
export class CompleteDialogComponent {
  constructor(
    public dialogRef: MatDialogRef<CompleteDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: {
    title?: string,
    message?: string,
    tabs?: string[],
  },
  ) {}

  close(tab?: number): void {
    this.dialogRef.close(tab);
  }
}
