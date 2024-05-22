import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'ramp-full-banner',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatButtonModule, MatIconModule],
  templateUrl: './full-banner.component.html',
  styleUrl: './full-banner.component.scss',
})
export class RampFullBannerComponent {
  @Input() showBanner = true;

  closeBanner() {
    this.showBanner = false;
  }
}
