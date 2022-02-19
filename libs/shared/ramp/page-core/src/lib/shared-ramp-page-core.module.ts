import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PageCoreComponent } from './page-core/page-core.component';

@NgModule({
  imports: [CommonModule],
  declarations: [PageCoreComponent],
  exports: [PageCoreComponent],
})
export class SharedRampPageCoreModule {}
