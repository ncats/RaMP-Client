import {PortalModule} from "@angular/cdk/portal";
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {FlexLayoutModule} from "@angular/flex-layout";
import {MatCheckboxModule} from "@angular/material/checkbox";
import {MatPaginatorModule} from "@angular/material/paginator";
import {MatSortModule} from "@angular/material/sort";
import {MatTableModule} from "@angular/material/table";
import {MatTooltipModule} from "@angular/material/tooltip";
import {RouterModule} from "@angular/router";
import {PropertyDisplayComponent} from "./ncats-datatable/components/property-display/property-display.component";
import {NcatsDatatableComponent} from "./ncats-datatable/ncats-datatable.component";

@NgModule({
  imports: [CommonModule,
    RouterModule,
    FlexLayoutModule,
    MatPaginatorModule,
    MatTableModule,
    MatSortModule,
    MatCheckboxModule,
    PortalModule, MatTooltipModule
  ],
  declarations: [NcatsDatatableComponent, PropertyDisplayComponent],
  exports: [NcatsDatatableComponent]
})
export class SharedUiNcatsDatatableModule {}
