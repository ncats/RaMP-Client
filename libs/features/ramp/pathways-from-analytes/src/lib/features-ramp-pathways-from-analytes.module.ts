import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FlexLayoutModule } from '@angular/flex-layout';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatLegacyButtonModule as MatButtonModule } from '@angular/material/legacy-button';
import { MatLegacyCardModule as MatCardModule } from "@angular/material/legacy-card";
import { MatLegacyFormFieldModule as MatFormFieldModule } from '@angular/material/legacy-form-field';
import { MatLegacyInputModule as MatInputModule } from '@angular/material/legacy-input';
import { RouterModule, Routes } from '@angular/router';
import { SharedNcatsDataDownloadModule } from '@ramp/shared/ncats/data-download';
import { SharedRampInputRowModule } from '@ramp/shared/ramp/input-row';
import { SharedRampQueryPageModule } from '@ramp/shared/ramp/query-page';
import { SharedUiDescriptionPanelModule } from '@ramp/shared/ui/description-panel';
import { SharedUiFeedbackPanelModule } from "@ramp/shared/ui/feedback-panel";
import { SharedUiNcatsDatatableModule } from '@ramp/shared/ui/ncats-datatable';
import { PathwaysFromAnalytesComponent } from './pathways-from-analytes/pathways-from-analytes.component';

const ROUTES: Routes = [
  {
    path: '',
    component: PathwaysFromAnalytesComponent,
  },
];

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(ROUTES),
    SharedRampQueryPageModule,
    SharedRampInputRowModule,
    SharedUiDescriptionPanelModule,
    FlexLayoutModule,
    MatCardModule,
    SharedUiFeedbackPanelModule
  ],
  declarations: [PathwaysFromAnalytesComponent],
  exports: [PathwaysFromAnalytesComponent],
})
export class FeaturesRampPathwaysFromAnalytesModule {}
