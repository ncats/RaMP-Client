import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FlexLayoutModule } from "@angular/flex-layout";
import { NcatsFooterComponent } from './ncats-footer/ncats-footer.component';

@NgModule({
  imports: [CommonModule, FlexLayoutModule],
  declarations: [
    NcatsFooterComponent
  ],
  exports: [
    NcatsFooterComponent
  ]
})
export class SharedNcatsNcatsFooterModule {}
