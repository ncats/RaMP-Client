import { Component, Input } from '@angular/core';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { NgIf, NgClass } from '@angular/common';

@Component({
    selector: 'ramp-loading',
    templateUrl: './loading.component.html',
    styleUrls: ['./loading.component.scss'],
    standalone: true,
    imports: [
        NgIf,
        NgClass,
        MatProgressSpinnerModule,
    ],
})
export class LoadingComponent {
  @Input() isLoading = true;
  @Input() position: 'left' | 'right' | 'center' = 'center';
  @Input() size: 'small' | 'medium' | 'large' = 'large';
  sizes = {
    large: 100,
    medium: 50,
    small: 25,
  };

  positions = {
    left: 'spinner-left',
    right: 'spinner-right',
    center: '',
  };
}
