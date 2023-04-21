import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatLegacyProgressSpinnerModule as MatProgressSpinnerModule } from '@angular/material/legacy-progress-spinner';
import { LoadingComponent } from './loading/loading.component';

@NgModule({
  imports: [CommonModule, MatProgressSpinnerModule],
  declarations: [LoadingComponent],
  exports: [LoadingComponent],
})
export class SharedUiLoadingSpinnerModule {}
