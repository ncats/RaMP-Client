import { DOCUMENT } from '@angular/common';
import { ChangeDetectorRef, Component, Inject, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Pathway, RampQuery } from '@ramp/models/ramp-models';
import { PageCoreComponent } from '@ramp/shared/ramp/page-core';
import { DataProperty } from '@ramp/shared/ui/ncats-datatable';
import { fetchPathwaysFromAnalytes, RampFacade } from '@ramp/stores/ramp-store';
import { takeUntil } from 'rxjs';

@Component({
  selector: 'ramp-pathways-from-analytes',
  templateUrl: './pathways-from-analytes.component.html',
  styleUrls: ['./pathways-from-analytes.component.scss'],
})
export class PathwaysFromAnalytesComponent
  extends PageCoreComponent
  implements OnInit
{
  pathwayColumns: DataProperty[] = [
    new DataProperty({
      label: 'Input ID',
      field: 'inputId',
      sortable: true,
    }),
    new DataProperty({
      label: 'Pathway',
      field: 'pathwayName',
      sortable: true,
    }),
    new DataProperty({
      label: 'Pathway Source',
      field: 'pathwaySource',
      sortable: true,
    }),
    new DataProperty({
      label: 'Pathway Source ID',
      field: 'pathwayId',
      sortable: true,
    }),
    new DataProperty({
      label: 'Analyte Name',
      field: 'commonName',
      sortable: true,
    }),
  ];

  constructor(
    private ref: ChangeDetectorRef,
    protected rampFacade: RampFacade,
    protected route: ActivatedRoute,
    @Inject(DOCUMENT) protected dom: Document,
  ) {
    super(route, rampFacade, dom);
  }

  ngOnInit(): void {
    this.rampFacade.pathways$
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe(
        (
          res:
            | { data: Pathway[]; query: RampQuery; dataframe: any }
            | undefined,
        ) => {
          if (res && res.data) {
            this._mapData(res.data);
            this.matches = Array.from(
              new Set(
                res.data.map((pathway) => pathway.inputId.toLocaleLowerCase()),
              ),
            );
            this.noMatches = this.inputList.filter(
              (p: string) => !this.matches.includes(p.toLocaleLowerCase()),
            );
          }
          if (res && res.query) {
            this.query = res.query;
          }
          if (res && res.dataframe) {
            this.dataframe = res.dataframe;
            if (this.downloadQueued) {
              this._downloadFile(
                this._toTSV(this.dataframe),
                'fetchPathwaysFromAnalytes-download.tsv',
              );
              this.downloadQueued = false;
            }
          }
          this.ref.markForCheck();
        },
      );
  }

  fetchPathways(event: string[]): void {
    this.inputList = event.map((item) => (item = item.toLocaleLowerCase()));
    this.rampFacade.dispatch(fetchPathwaysFromAnalytes({ analytes: event }));
  }

  fetchPathwaysFile(event: string[]): void {
    if (!this.dataframe) {
      this.fetchPathways(event);
      this.downloadQueued = true;
    } else {
      this._downloadFile(
        this._toTSV(this.dataframe),
        'fetchPathwaysFromAnalytes-download.tsv',
      );
    }
  }

  private _mapData(data: any): void {
    this.dataAsDataProperty = data.map((analyte: Pathway) => {
      const newObj: { [key: string]: DataProperty } = {};
      Object.entries(analyte).map((value: any, index: any) => {
        newObj[value[0]] = new DataProperty({
          name: value[0],
          label: value[0],
          value: value[1],
        });
      });
      return newObj;
    });
  }
}
