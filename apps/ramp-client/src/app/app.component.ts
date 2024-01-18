import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component, DestroyRef, inject,
  OnInit,
  ViewEncapsulation
} from "@angular/core";
import { takeUntilDestroyed } from "@angular/core/rxjs-interop";
import { MatDialog } from '@angular/material/dialog';
import { select, Store } from "@ngrx/store";
import { LinkTemplateProperty, RampHeaderComponent } from "@ramp/features/ramp/ramp-header";
import { NcatsFooterComponent } from "@ramp/shared/ncats/ncats-footer";
import { LoadingComponent } from "@ramp/shared/ui/loading-spinner";
import { map } from "rxjs";
import { environment } from '../environments/environment';
import { RouterOutlet } from '@angular/router';
import { NgIf } from '@angular/common';
import { RampSelectors } from "@ramp/stores/ramp-store";

@Component({
    selector: 'ramp-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss'],
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: true,
    imports: [
      NgIf,
      RouterOutlet,
      NcatsFooterComponent,
      LoadingComponent,
      RampHeaderComponent
    ],
})
export class AppComponent implements OnInit {
  private readonly store = inject(Store);
  destroyRef = inject(DestroyRef);

  title = 'ramp-client';
  loading = true;
  showBanner = false;
  links: LinkTemplateProperty[] = [
    {
      link: 'Biological Pathways',
      children: [
        {
          link: 'pathways-from-analytes',
          label: 'Pathways from Input Analytes',
        },
        {
          link: 'analytes-from-pathways',
          label: 'Analytes from Input Pathways',
        },
      ],
    },
    {
      link: 'Ontologies',
      children: [
        {
          link: 'ontologies-from-metabolites',
          label: 'Ontologies from Input Metabolites',
        },
        {
          link: 'metabolites-from-ontologies',
          label: 'Metabolites from Input Ontologies',
        },
      ],
    },
    {
      link: 'Chemical Descriptions',
      children: [
        {
          link: 'classes-from-metabolites',
          label: 'Chemical Classes from Metabolites',
        },
        {
          link: 'properties-from-metabolites',
          label: 'Chemical Properties from Input Metabolites',
        },
      ],
    },
    {
      link: 'Reactions',
      children: [
        {
          link: 'common-reaction-analytes',
          label:
            'Retrieve Analytes involved in Same Reactions as input Analytes\n',
        },
      ],
    },
    {
      link: 'Enrichment Analyses',
      children: [
        {
          link: 'pathway-enrichment',
          label: 'Biological Pathway Enrichment\n',
        },
        {
          link: 'chemical-enrichment',
          label: 'Chemical Class Enrichment',
        },
      ],
    },
    {
      link: 'about',
      label: 'About',
    },
    {
      link: 'api',
      label: 'API',
      //external: true
    },
  ];

  constructor(
    public dialog: MatDialog,
    private changeRef: ChangeDetectorRef,
  ) {}

  ngOnInit() {
    this.showBanner = !environment.production;
/*    this.error$.subscribe((error) => {
      if (error) {
        // console.log(error);
        /!* this.dialog.open(ErrorDialogComponent, {
          data: {
            error: error,
          },
        });*!/
      }
    });*/

    this.store
      .pipe(
        select(RampSelectors.getRampLoaded),
        takeUntilDestroyed(this.destroyRef),
      map((res: boolean) => {
      this.loading = res;
      this.changeRef.markForCheck();
    })
      ).subscribe();
  }
}
