import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialogTitle, MatDialogContent, MatDialogActions } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { NgIf, NgFor } from '@angular/common';
import { MatRippleModule } from '@angular/material/core';
import { MatIconModule } from '@angular/material/icon';
import { FlexModule } from '@angular/flex-layout/flex';

@Component({
    selector: 'ramp-complete-dialog',
    templateUrl: './complete-dialog.component.html',
    styleUrls: ['./complete-dialog.component.scss'],
    standalone: true,
    imports: [
        MatDialogTitle,
        FlexModule,
        MatIconModule,
        MatRippleModule,
        MatDialogContent,
        NgIf,
        MatDialogActions,
        NgFor,
        MatButtonModule,
    ],
})
export class CompleteDialogComponent {
  constructor(
    public dialogRef: MatDialogRef<CompleteDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
  ) {}

  close(tab?: number): void {
    this.dialogRef.close(tab);
  }
}
