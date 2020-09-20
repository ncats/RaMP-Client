import { Component, ViewChild, HostListener, AfterViewInit } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { MatIconRegistry } from '@angular/material/icon';
import { MatSidenav } from '@angular/material/sidenav';

@Component({
  selector: 'ramp-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements AfterViewInit {
  hasBackdrop = false;
  @ViewChild('sideNav', { read: MatSidenav, static: false }) sideNav: MatSidenav;
  fixedTopGap = 64;

  constructor(
    iconRegistry: MatIconRegistry,
    sanitizer: DomSanitizer
  ){
    iconRegistry.addSvgIcon(
      'menu',
      sanitizer.bypassSecurityTrustResourceUrl('/assets/icons/menu-24px.svg'));
  }

  ngAfterViewInit() {
    if (window.innerWidth < 1800) {
      this.hasBackdrop = true;
      this.sideNav.mode = 'over';
      this.sideNav.close();
    } else {
      this.hasBackdrop = false;
      this.sideNav.mode = 'side';
      this.sideNav.open();
    }
  }

  openSideNav(): void {
    this.sideNav.mode = 'over';
    this.sideNav.open();
  }

  @HostListener('window:resize', ['$event'])
  onResize(event: any) {
    this.ngAfterViewInit();
  }
}
