import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FlexLayoutModule } from '@angular/flex-layout';
import { ReactiveFormsModule } from '@angular/forms';
import { MatLegacyButtonModule as MatButtonModule } from '@angular/material/legacy-button';
import { MatLegacyCheckboxModule as MatCheckboxModule } from '@angular/material/legacy-checkbox';
import { MatLegacyFormFieldModule as MatFormFieldModule } from '@angular/material/legacy-form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatLegacyInputModule as MatInputModule } from '@angular/material/legacy-input';
import { MatLegacyTabsModule as MatTabsModule } from '@angular/material/legacy-tabs';
import { MatLegacyTooltipModule as MatTooltipModule } from '@angular/material/legacy-tooltip';
import { RouterModule, Routes } from '@angular/router';
import { SharedRampInputRowModule } from '@ramp/shared/ramp/input-row';
import { SharedRampPageCoreModule } from '@ramp/shared/ramp/page-core';
import { SharedRampQueryPageModule } from '@ramp/shared/ramp/query-page';
import { SharedUiDescriptionPanelModule } from '@ramp/shared/ui/description-panel';
import { SharedUiFeedbackPanelModule } from '@ramp/shared/ui/feedback-panel';
import { SharedUiFilterPanelModule } from '@ramp/shared/ui/filter-panel';
import { SharedUiLoadingSpinnerModule } from "@ramp/shared/ui/loading-spinner";
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
    SharedUiFeedbackPanelModule,
    SharedUiLoadingSpinnerModule
  ],
  declarations: [MetabolitesFromOntologiesComponent],
})
export class FeaturesRampMetabolitesFromOntologiesModule {}
