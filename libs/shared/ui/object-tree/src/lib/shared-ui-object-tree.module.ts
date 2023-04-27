import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatIconModule } from '@angular/material/icon';
import { MatTreeModule } from '@angular/material/tree';
import { ObjectTreeComponent } from './object-tree/object-tree.component';

@NgModule({
  imports: [
    CommonModule,
    MatTreeModule,
    MatCheckboxModule,
    MatIconModule,
    MatButtonModule,
  ],
  declarations: [ObjectTreeComponent],
  exports: [ObjectTreeComponent],
})
export class SharedUiObjectTreeModule {}
