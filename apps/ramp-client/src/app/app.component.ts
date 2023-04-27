import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component, ElementRef,
  OnInit, ViewChild,
  ViewEncapsulation
} from "@angular/core";
import { MatDialog } from '@angular/material/dialog';
import { ErrorDialogComponent } from '@ramp/shared/ui/error-dialog';
import { LinkTemplateProperty } from '@ramp/shared/ui/header-template';
import { RampFacade } from '@ramp/stores/ramp-store';


@Component({
  selector: 'ramp-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppComponent implements OnInit {
  title = 'ramp-client';
  loading = true;
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
        }
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
          label: 'Retrieve Analytes involved in Same Reactions as input Analytes\n',
        }
        ]
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
    protected rampFacade: RampFacade
  ) {}

  ngOnInit() {
    this.rampFacade.error$.subscribe((error) => {
      if (error) {
        console.log(error);
        /* this.dialog.open(ErrorDialogComponent, {
          data: {
            error: error,
          },
        });*/
      }
    });

    this.rampFacade.loading$.subscribe((res) => {
      this.loading = res;
      this.changeRef.markForCheck();
    });
  }
}
