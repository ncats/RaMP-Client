import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FlexLayoutModule } from '@angular/flex-layout';
import { ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatRippleModule } from "@angular/material/core";
import { MatDialogModule } from "@angular/material/dialog";
import { MatDividerModule } from '@angular/material/divider';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatListModule } from '@angular/material/list';
import { MatRadioModule } from '@angular/material/radio';
import { MatSelectModule } from '@angular/material/select';
import { MatSliderModule } from '@angular/material/slider';
import { MatTabsModule } from '@angular/material/tabs';
import { MatTooltipModule } from '@angular/material/tooltip';
import { RouterModule, Routes } from '@angular/router';
import { SharedRampInputRowModule } from '@ramp/shared/ramp/input-row';
import { SharedRampPageCoreModule } from '@ramp/shared/ramp/page-core';
import { SharedRampQueryPageModule } from '@ramp/shared/ramp/query-page';
import { SharedUiDescriptionPanelModule } from '@ramp/shared/ui/description-panel';
import { SharedUiFeedbackPanelModule } from '@ramp/shared/ui/feedback-panel';
import { SharedUiLoadingSpinnerModule } from '@ramp/shared/ui/loading-spinner';
import { PathwayEnrichmentComponent } from './pathway-enrichment/pathway-enrichment.component';

const ROUTES: Routes = [
  {
    path: '',
    component: PathwayEnrichmentComponent,
  },
];

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(ROUTES),
    SharedRampQueryPageModule,
    FlexLayoutModule,
    MatFormFieldModule,
    MatSliderModule,
    ReactiveFormsModule,
    SharedUiLoadingSpinnerModule,
    SharedRampPageCoreModule,
    SharedRampInputRowModule,
    SharedUiDescriptionPanelModule,
    MatInputModule,
    MatTabsModule,
    MatCheckboxModule,
    MatRadioModule,
    MatIconModule,
    MatButtonModule,
    MatTooltipModule,
    MatDividerModule,
    SharedUiFeedbackPanelModule,
    MatListModule,
    MatSelectModule,
    MatDialogModule,
    MatRippleModule
  ],
  declarations: [PathwayEnrichmentComponent],
})
export class FeaturesRampPathwayEnrichmentModule {}
