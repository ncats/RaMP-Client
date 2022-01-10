import {ChangeDetectorRef, Component, OnInit} from '@angular/core';
import {Pathway, RampQuery} from "@ramp/models/ramp-models";
import {DataProperty} from "@ramp/shared/ui/ncats-datatable";
import {fetchPathwaysFromAnalytes, RampFacade} from "@ramp/stores/ramp-store";

@Component({
  selector: 'ramp-pathways-from-analytes',
  templateUrl: './pathways-from-analytes.component.html',
  styleUrls: ['./pathways-from-analytes.component.scss']
})
export class PathwaysFromAnalytesComponent implements OnInit {
  pathwayRaw!: Pathway[];
  pathwayColumns: DataProperty[] = [
    new DataProperty({
      label: "Analyte Name",
      field: "commonName",
      sortable: true
    }),
    new DataProperty({
      label: "Pathway",
      field: "pathwayName",
      sortable: true
    }),
    new DataProperty({
      label: "Pathway Source",
      field: "pathwaysource",
      sortable: true
    }),
    new DataProperty({
      label: "Pathway Source ID",
      field: "pathwaysourceId",
      sortable: true
    }),
  ]
  query!: RampQuery;
  dataAsDataProperty!: { [key: string]: DataProperty }[];

  constructor(
    private ref: ChangeDetectorRef,
    private rampFacade: RampFacade
) {
  }


  ngOnInit(): void {

    this.rampFacade.pathways$.subscribe((res: {data: Pathway[], query: RampQuery} | undefined) => {
      if (res && res.data) {
        this.pathwayRaw = res.data;
      //  this.matches = new Set([...res.map(ont => ont.sourceId)]).size
        this.dataAsDataProperty = res.data.map((pathway: Pathway) => {
          const newObj: { [key: string]: DataProperty } = {};
          Object.entries(pathway).map((value: any, index: any) => {
            newObj[value[0]] = new DataProperty({name: value[0], label: value[0], value: value[1]});
          });
          return newObj;
        })
        this.ref.markForCheck()
      }
      if (res && res.query) {
        this.query = res.query;
      }
    })
  }

  fetchPathways(event: string[]): void {
    this.rampFacade.dispatch(fetchPathwaysFromAnalytes({analytes: event}))
  }
}
