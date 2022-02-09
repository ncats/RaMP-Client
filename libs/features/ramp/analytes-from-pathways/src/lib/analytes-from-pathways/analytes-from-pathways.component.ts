import {ChangeDetectorRef, Component, Input, OnInit} from '@angular/core';
import {ActivatedRoute} from "@angular/router";
import {Analyte, RampQuery} from "@ramp/models/ramp-models";
import {PageCoreComponent} from "@ramp/shared/ramp/page-core";
import {DataProperty} from "@ramp/shared/ui/ncats-datatable";
import {fetchAnalytesFromPathways, fetchAnalytesFromPathwaysFile, RampFacade} from "@ramp/stores/ramp-store";

@Component({
  selector: 'ramp-analytes-from-pathways',
  templateUrl: './analytes-from-pathways.component.html',
  styleUrls: ['./analytes-from-pathways.component.scss']
})
export class AnalytesFromPathwaysComponent extends PageCoreComponent implements OnInit {
  analyteColumns: DataProperty[] = [
    new DataProperty({
      label: "Pathway Name",
      field: "pathwayName",
      sortable: true
    }),
/*    new DataProperty({
      label: "Pathway Category",
      field: "pathwayCategory",
      sortable: true
    }),*/
    new DataProperty({
      label: "Pathway Type",
      field: "pathwayType",
      sortable: true
    }),
    new DataProperty({
      label: "Analyte Name",
      field: "analyteName",
      sortable: true
    }),
    new DataProperty({
      label: "Source Analyte ID",
      field: "sourceAnalyteIDs",
      sortable: true
    }),
    new DataProperty({
      label: "Analyte Class",
      field: "geneOrCompound",
      sortable: true
    }),
  ]
  query!: RampQuery;
  dataAsDataProperty!: { [key: string]: DataProperty }[];

  constructor(
    private ref: ChangeDetectorRef,
    private rampFacade: RampFacade,
    protected route: ActivatedRoute
  ) {
    super(route);
  }


  ngOnInit(): void {
    this.rampFacade.analytes$.subscribe((res: {data: Analyte[], query: RampQuery} | undefined) => {
      if (res && res.data) {
        this._mapData(res.data);
      }
      if (res && res.query) {
        this.query = res.query;
      }
      this.ref.markForCheck();
    })
  }

  fetchAnalytes(event: string[]): void {
    this.rampFacade.dispatch(fetchAnalytesFromPathways({pathways: event}))
  }

  fetchAnalytesFile(event: string[]): void {
    this.rampFacade.dispatch(fetchAnalytesFromPathwaysFile({pathways: event, format: 'tsv'}))
  }

  private _mapData(data: any): void {
    this.dataAsDataProperty = data.map((analyte: Analyte) => {
      const newObj: { [key: string]: DataProperty } = {};
      Object.entries(analyte).map((value: any, index: any) => {
        newObj[value[0]] = new DataProperty({name: value[0], label: value[0], value: value[1]});
      });
      return newObj;
    })
  }
}
