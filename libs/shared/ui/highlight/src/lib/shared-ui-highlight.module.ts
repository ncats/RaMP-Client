import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HighlightPipe } from './highlight.pipe';

@NgModule({
  imports: [CommonModule],
  declarations: [
    HighlightPipe
  ],
  exports: [
    HighlightPipe
  ]
})
export class SharedUiHighlightModule {}
