import { NgClass } from '@angular/common';
import {
  Component,
  DestroyRef,
  inject,
  Input,
  ViewEncapsulation,
} from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { Router, RouterLink } from '@angular/router';
import { slideInOutAnimation } from './header-animations';

export interface LinkTemplateProperty {
  link?: string;
  label?: string;
  children?: LinkTemplateProperty[];
  external?: boolean;
}

@Component({
  selector: 'ramp-header',
  templateUrl: './ramp-header.component.html',
  styleUrls: ['./ramp-header.component.scss'],
  animations: [slideInOutAnimation],
  encapsulation: ViewEncapsulation.None,
  standalone: true,
  imports: [
    MatToolbarModule,
    MatButtonModule,
    MatMenuModule,
    RouterLink,
    MatIconModule,
    NgClass,
    MatSidenavModule,
  ],
})
export class RampHeaderComponent {
  destroyRef = inject(DestroyRef);

  /**
   * animation state changed by scrolling
   * @type {string}
   */
  @Input() animationState = 'in';

  @Input() title?: string;

  @Input() links?: LinkTemplateProperty[] = [];

  mobile = false;

  constructor(private router: Router) {}

  /**
   * sets active section in nav
   * todo: this probably won't work in longer url paths
   * @param path
   */
  isActive(path: string | undefined): boolean {
    return this.router.url === `/${path}`;
  }
}
