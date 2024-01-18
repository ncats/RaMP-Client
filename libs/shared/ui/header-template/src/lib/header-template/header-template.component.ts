import { Component, Input } from '@angular/core';
import { slideInOutAnimation } from './header-animations';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { ExtendedModule } from '@angular/flex-layout/extended';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatButtonModule } from '@angular/material/button';
import { NgFor, NgIf, NgClass } from '@angular/common';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatSidenavModule } from '@angular/material/sidenav';

export interface LinkTemplateProperty {
  link?: string;
  label?: string;
  children?: LinkTemplateProperty[];
  external?: boolean;
}

@Component({
    selector: 'ncats-frontend-library-header-template',
    templateUrl: './header-template.component.html',
    styleUrls: ['./header-template.component.scss'],
    animations: [slideInOutAnimation],
    standalone: true,
    imports: [
        MatSidenavModule,
        MatToolbarModule,
        NgFor,
        NgIf,
        MatButtonModule,
        MatMenuModule,
        RouterLink,
        MatIconModule,
        NgClass,
        ExtendedModule,
    ],
})
export class HeaderTemplateComponent {
  /**
   * animation state changed by scrolling
   * @type {string}
   */
  @Input() animationState = 'in';

  @Input() title?: string;

  @Input() links?: LinkTemplateProperty[] = [];

  constructor(
    private route: ActivatedRoute,
    private router: Router,
  ) {}

  /**
   * sets active section in nav
   * todo: this probably won't work in longer url paths
   * @param path
   */
  isActive(path: string | undefined): boolean {
    return this.router.url === `/${path}`;
  }
}
