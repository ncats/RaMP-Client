import {ChangeDetectorRef, Component, OnInit} from '@angular/core';
import {ActivatedRoute} from "@angular/router";
import {Pathway, RampQuery} from "@ramp/models/ramp-models";
import {PageCoreComponent} from "@ramp/shared/ramp/page-core";
import {DataProperty} from "@ramp/shared/ui/ncats-datatable";
import {
  fetchPathwaysFromAnalytes,
  fetchPathwaysFromAnalytesFile,
  RampFacade
} from "@ramp/stores/ramp-store";

@Component({
  selector: 'ramp-pathways-from-analytes',
  templateUrl: './pathways-from-analytes.component.html',
  styleUrls: ['./pathways-from-analytes.component.scss']
})
export class PathwaysFromAnalytesComponent extends PageCoreComponent implements OnInit {
  pathwayColumns: DataProperty[] = [
    new DataProperty({
      label: "Pathway",
      field: "pathwayName",
      sortable: true
    }),
    new DataProperty({
      label: "Pathway Source",
      field: "pathwaySource",
      sortable: true
    }),
    new DataProperty({
      label: "Pathway Source ID",
      field: "pathwayId",
      sortable: true
    }),
    new DataProperty({
      label: "Analyte Name",
      field: "commonName",
      sortable: true
    })
  ]
  query!: RampQuery;
  dataAsDataProperty!: { [key: string]: DataProperty }[];


  constructor(
    private ref: ChangeDetectorRef,
    private rampFacade: RampFacade,
    protected  route: ActivatedRoute
) {
    super(route);
  }


  ngOnInit(): void {
/*    this.rampFacade.supportedIds$.subscribe(ids => {
      this.supportedIds = ids
      this.ref.markForCheck()
    })*/

    this.rampFacade.pathways$.subscribe((res: {data: Pathway[], query: RampQuery} | undefined) => {
      if (res && res.data) {
        this._mapData(res.data);
      }
      if (res && res.query) {
        this.query = res.query;
      }
      this.ref.markForCheck();
    })
  }

  fetchPathways(event: string[]): void {
    this.rampFacade.dispatch(fetchPathwaysFromAnalytes({analytes: event}))
  }

  fetchPathwaysFile(event: string[]): void {
    this.rampFacade.dispatch(fetchPathwaysFromAnalytesFile({analytes: event, format: 'tsv'}))
  }

  private _mapData(data: any): void {
    this.dataAsDataProperty = data.map((analyte: Pathway) => {
      const newObj: { [key: string]: DataProperty } = {};
      Object.entries(analyte).map((value: any, index: any) => {
        newObj[value[0]] = new DataProperty({name: value[0], label: value[0], value: value[1]});
      });
      return newObj;
    })
  }
}
