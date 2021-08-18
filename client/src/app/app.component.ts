import { Component, ViewChild, HostListener, AfterViewInit, OnInit, OnDestroy } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { MatIconRegistry } from '@angular/material/icon';
import { MatSidenav } from '@angular/material/sidenav';
import { ActivationEnd, ResolveEnd, Router } from '@angular/router';
import { MainNavItem } from './main-nav.model';
import { Subscription } from 'rxjs';
import { GoogleAnalyticsService } from './google-analytics/google-analytics.service';

@Component({
  selector: 'ramp-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit, AfterViewInit, OnDestroy {
  hasBackdrop = false;
  @ViewChild('sideNav', { read: MatSidenav, static: false }) sideNav: MatSidenav;
  navItems: Array<MainNavItem> = [];
  activeNavItemId = '';
  private routerSubscription: Subscription;

  constructor(
    public iconRegistry: MatIconRegistry,
    public sanitizer: DomSanitizer,
    private router: Router,
    private gaService: GoogleAnalyticsService
  ){
    iconRegistry.addSvgIcon(
      'menu',
      sanitizer.bypassSecurityTrustResourceUrl('/assets/icons/menu-24px.svg'));
  }

  ngOnInit() {

    // this.navItems = this.router.config
    //   .filter(item => item.data != null && item.data.isMainNav).map(item => {
    //     return {
    //       id: item.data.id,
    //       path: `/${item.data.path || item.path}`,
    //       display: item.data.display,
    //       order: item.data.order
    //     };
    //   })
    //   .sort((a, b) => a.order - b.order);

    this.routerSubscription = this.router.events.subscribe(event => {
      if (event instanceof ActivationEnd) {
        this.activeNavItemId = event.snapshot.data && event.snapshot.data.id || '';
      }
      if (event instanceof ResolveEnd) {
        this.gaService.sendPageView(event.state.root.firstChild.data.display, event.state.url);
      }
    });
  }

  ngAfterViewInit() {
    // if (window.innerWidth < 1200) {
    //   this.hasBackdrop = true;
    //   this.sideNav.mode = 'over';
    //   this.sideNav.close();
    // } else {
    //   this.hasBackdrop = false;
    //   this.sideNav.mode = 'side';
    //   this.sideNav.open();
    // }
  }

  ngOnDestroy() {
    if (this.routerSubscription != null) {
      this.routerSubscription.unsubscribe();
    }
  }

  // openSideNav(): void {
  //   this.sideNav.mode = 'over';
  //   this.sideNav.open();
  // }

  @HostListener('window:resize', ['$event'])
  onResize(event: any) {
    this.ngAfterViewInit();
  }
}
