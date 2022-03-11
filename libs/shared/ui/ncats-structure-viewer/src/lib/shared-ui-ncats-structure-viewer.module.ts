import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StructureViewerComponent } from './structure-viewer/structure-viewer.component';

@NgModule({
  imports: [CommonModule],
  declarations: [StructureViewerComponent],
  exports: [StructureViewerComponent],
})
export class SharedUiNcatsStructureViewerModule {}
