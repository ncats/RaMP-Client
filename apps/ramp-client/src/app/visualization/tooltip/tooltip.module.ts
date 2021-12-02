import { ModuleWithProviders, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TooltipService } from './tooltip.service';

@NgModule({
  declarations: [],
  imports: [CommonModule],
})
export class TooltipModule {
  static forRoot(): ModuleWithProviders<TooltipModule> {
    return {
      ngModule: TooltipModule,
      providers: [{ provide: TooltipService }],
    };
  }
}
