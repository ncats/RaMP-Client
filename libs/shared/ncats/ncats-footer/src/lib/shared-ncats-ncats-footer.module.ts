import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { NcatsFooterComponent } from './ncats-footer/ncats-footer.component';

@NgModule({
  imports: [CommonModule, MatIconModule],
  declarations: [NcatsFooterComponent],
  exports: [NcatsFooterComponent],
})
export class SharedNcatsNcatsFooterModule {}
