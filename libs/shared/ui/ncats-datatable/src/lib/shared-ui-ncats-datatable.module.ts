import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {RouterModule} from "@angular/router";
import {UiCustomMaterialModule} from "@ramp/shared/ui/custom-material";
import {PropertyDisplayComponent} from "./ncats-datatable/components/property-display/property-display.component";
import {NcatsDatatableComponent} from "./ncats-datatable/ncats-datatable.component";

@NgModule({
  imports: [CommonModule, RouterModule, UiCustomMaterialModule],
  declarations: [NcatsDatatableComponent, PropertyDisplayComponent],
  exports: [NcatsDatatableComponent]
})
export class SharedUiNcatsDatatableModule {}
