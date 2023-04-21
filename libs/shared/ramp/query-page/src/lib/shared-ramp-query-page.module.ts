import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FlexLayoutModule } from '@angular/flex-layout';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatLegacyButtonModule as MatButtonModule } from '@angular/material/legacy-button';
import { MatLegacyFormFieldModule as MatFormFieldModule } from '@angular/material/legacy-form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatLegacyInputModule as MatInputModule } from '@angular/material/legacy-input';
import { MatLegacyTooltipModule as MatTooltipModule } from '@angular/material/legacy-tooltip';
import { SharedNcatsDataDownloadModule } from '@ramp/shared/ncats/data-download';
import { SharedUiDescriptionPanelModule } from '@ramp/shared/ui/description-panel';
import { SharedUiNcatsDatatableModule } from '@ramp/shared/ui/ncats-datatable';
import { QueryPageComponent } from './query-page/query-page.component';

@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    MatFormFieldModule,
    FlexLayoutModule,
    MatInputModule,
    MatButtonModule,
    SharedUiDescriptionPanelModule,
    SharedUiNcatsDatatableModule,
    SharedNcatsDataDownloadModule,
    MatIconModule,
    MatTooltipModule,
  ],
  declarations: [QueryPageComponent],
  exports: [QueryPageComponent],
})
export class SharedRampQueryPageModule {}
