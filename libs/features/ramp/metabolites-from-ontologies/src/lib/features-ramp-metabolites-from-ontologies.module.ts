import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FlexLayoutModule } from '@angular/flex-layout';
import { ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatTabsModule } from '@angular/material/tabs';
import { MatTooltipModule } from '@angular/material/tooltip';
import { RouterModule, Routes } from '@angular/router';
import { SharedRampInputRowModule } from '@ramp/shared/ramp/input-row';
import { SharedRampPageCoreModule } from '@ramp/shared/ramp/page-core';
import { SharedRampQueryPageModule } from '@ramp/shared/ramp/query-page';
import { SharedUiDescriptionPanelModule } from '@ramp/shared/ui/description-panel';
import { SharedUiFilterPanelModule } from '@ramp/shared/ui/filter-panel';
import { SharedUiObjectTreeModule } from '@ramp/shared/ui/object-tree';
import { MetabolitesFromOntologiesComponent } from './metabolites-from-ontologies/metabolites-from-ontologies.component';

const ROUTES: Routes = [
  {
    path: '',
    component: MetabolitesFromOntologiesComponent,
  },
];

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(ROUTES),
    SharedRampQueryPageModule,
    SharedRampInputRowModule,
    SharedUiDescriptionPanelModule,
    SharedUiObjectTreeModule,
    SharedRampPageCoreModule,
    MatCheckboxModule,
    SharedUiFilterPanelModule,
    FlexLayoutModule,
    MatFormFieldModule,
    MatInputModule,
    ReactiveFormsModule,
    MatIconModule,
    MatButtonModule,
    MatTooltipModule,
    MatTabsModule,
  ],
  declarations: [MetabolitesFromOntologiesComponent],
})
export class FeaturesRampMetabolitesFromOntologiesModule {}
