import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import * as fromRamp from './+state/ramp-store/ramp.reducer';
import { RampEffects } from './+state/ramp-store/ramp.effects';
import { RampFacade } from './+state/ramp-store/ramp.facade';
import { RampService } from './+state/ramp.service';

@NgModule({
  imports: [
    CommonModule,
    StoreModule.forFeature(fromRamp.RAMP_STORE_FEATURE_KEY, fromRamp.reducer),
    EffectsModule.forFeature([RampEffects]),
  ],
  providers: [RampFacade, RampService],
})
export class StoresRampStoreModule {}
