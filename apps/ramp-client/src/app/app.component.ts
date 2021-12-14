import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  OnInit,
  ViewChild,
  ViewEncapsulation,
} from '@angular/core';
import {MatDialog} from "@angular/material/dialog";
import {MatSidenav} from '@angular/material/sidenav';
import {ErrorDialogComponent} from "@ramp/shared/ui/error-dialog";
import {LinkTemplateProperty} from "@ramp/shared/ui/header-template";
import {RampFacade} from "@ramp/stores/ramp-store";


@Component({
  selector: 'ramp-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AppComponent implements OnInit {
  @ViewChild('sideNav', { read: MatSidenav, static: false })

  title = 'ramp-client';
  sideNav!: MatSidenav;
  loading = true;
  links: LinkTemplateProperty[] = [
    {
      link: "Queries",
      children: [
        {
          link: "analytes-from-pathways",
          label: "Analytes from Pathways"
        },
        {
          link: "pathways-from-analytes",
          label: "Pathways from Analytes"
        },
        {
          link: "common-reaction-analytes",
          label: "Common Reaction Analytes"
        }
      ]
    },
    {
      link: "Analysis",
      children: [
        {
          link: "pathway-enrichment-analysis",
          label: "Pathway Enrichment Analysis"
        },
        {
          link: "chemical-analysis",
          label: "Chemical Analysis"
        }
      ]
    },
    {
      link: "Ontologies",
      children: [
        {
          link: "ontologies",
          label: "Pathway Enrichment Analysis"
        },
        {
          link: "chemical-analysis",
          label: "Chemical Analysis"
        }
      ]
    },
    {
      link: "about",
      label: "About"
    }
  ]

  constructor(
    public dialog: MatDialog,
    private changeRef: ChangeDetectorRef,
    private rampFacade: RampFacade
  ) {

  }

  ngOnInit() {
    console.log('app');

    this.rampFacade.error$.subscribe(error=> {
      if(error) {
        console.log(error);
        this.dialog.open(ErrorDialogComponent, {
          data: {
            error: error,
          },
        });
      }
    })

    this.rampFacade.loading$.subscribe(res=> {
      console.log(res);
      this.loading = res;
      this.changeRef.markForCheck();

    });
  }
}
