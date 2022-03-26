import { DOCUMENT } from "@angular/common";
import { ChangeDetectorRef, Component, Inject, Input, OnInit } from "@angular/core";
import { ActivatedRoute } from '@angular/router';
import { Analyte, RampQuery } from '@ramp/models/ramp-models';
import { PageCoreComponent } from '@ramp/shared/ramp/page-core';
import { DataProperty } from '@ramp/shared/ui/ncats-datatable';
import {
  fetchAnalytesFromPathways,
  RampFacade,
} from '@ramp/stores/ramp-store';
import { takeUntil } from "rxjs";

@Component({
  selector: 'ramp-analytes-from-pathways',
  templateUrl: './analytes-from-pathways.component.html',
  styleUrls: ['./analytes-from-pathways.component.scss'],
})
export class AnalytesFromPathwaysComponent extends PageCoreComponent implements OnInit {
  analyteColumns: DataProperty[] = [
    new DataProperty({
      label: 'Pathway Name',
      field: 'pathwayName',
      sortable: true,
    }),
    new DataProperty({
      label: 'Pathway Type',
      field: 'pathwayType',
      sortable: true,
    }),
    new DataProperty({
      label: 'Analyte Name',
      field: 'analyteName',
      sortable: true,
    }),
    new DataProperty({
      label: 'Source Analyte ID',
      field: 'sourceAnalyteIDs',
      sortable: true,
    }),
    new DataProperty({
      label: 'Analyte Class',
      field: 'geneOrCompound',
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
    this.rampFacade.analytes$
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe(
        (res: { data: Analyte[]; query: RampQuery, dataframe: any } | undefined) => {
          if (res && res.data) {
            this._mapData(res.data);
            this.matches = Array.from(new Set(res.data.map(pathway => pathway.pathwayName.toLocaleLowerCase())));
            this.noMatches = this.inputList.filter((p: string) => !this.matches.includes(p.toLocaleLowerCase()));
          }
          if (res && res.query) {
            this.query = res.query;
          }
          if (res && res.dataframe) {
            this.dataframe = res.dataframe;
            if (this.downloadQueued) {
              this._downloadFile(this._toTSV(this.dataframe), 'fetchAnalytesFromPathways-download.tsv')
              this.downloadQueued = false;
            }
          }
          this.ref.markForCheck();
        }
      );
  }

  fetchAnalytes(event: string[]): void {
    this.inputList = event.map(item => item.toLocaleLowerCase());
    this.rampFacade.dispatch(fetchAnalytesFromPathways({ pathways: event }));
  }

  fetchAnalytesFile(event: string[]): void {
    if(!this.dataframe) {
      this.fetchAnalytes(event);
      this.downloadQueued = true;
    } else {
      this._downloadFile(this._toTSV(this.dataframe), 'fetchAnalytesFromPathways-download.tsv')
    }
  }

  private _mapData(data: any): void {
    this.dataAsDataProperty = data.map((analyte: Analyte) => {
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
