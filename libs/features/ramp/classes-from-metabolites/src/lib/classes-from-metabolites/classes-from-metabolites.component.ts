import {ChangeDetectorRef, Component, OnInit} from '@angular/core';
import {Classes, RampQuery} from "@ramp/models/ramp-models";
import {DataProperty} from "@ramp/shared/ui/ncats-datatable";
import {fetchClassesFromMetabolites, fetchClassesFromMetabolitesFile, RampFacade} from "@ramp/stores/ramp-store";
import {TREE_VIEWER_COMPONENT} from "../features-ramp-classes-from-metabolites.module";

@Component({
  selector: 'ramp-classes-from-metabolites',
  templateUrl: './classes-from-metabolites.component.html',
  styleUrls: ['./classes-from-metabolites.component.scss']
})
export class ClassesFromMetabolitesComponent implements OnInit {
  classesColumns: DataProperty[] = [
    //todo this isn't sortable
    new DataProperty({
      label: "Source ID",
      field: "sourceId"
    }),
    new DataProperty({
      label: "ClassyFire Classes",
      field: "classyFireTree",
      customComponent: TREE_VIEWER_COMPONENT
    }),
    new DataProperty({
      label: "LIPIDMAPS Classes",
      field: "lipidMapsTree",
      customComponent: TREE_VIEWER_COMPONENT
    })
  ]
  query!: RampQuery;
  dataAsDataProperty!: { [key: string]: DataProperty }[];
  supportedIds!: {
    metabolites: string[],
    genes: string[]
  } | undefined;

  constructor(
    private ref: ChangeDetectorRef,
    private rampFacade: RampFacade
  ) {
  }


  ngOnInit(): void {
    this.rampFacade.supportedIds$.subscribe(ids => {
      this.supportedIds = ids
      this.ref.markForCheck()
    })

    this.rampFacade.classes$.subscribe((res: {data: Classes[], query: RampQuery} | undefined) => {
      if (res && res.data) {
        this._mapData(res.data);
      }
      if (res && res.query) {
        this.query = res.query;
      }
      this.ref.markForCheck();
    })
  }

  fetchClasses(event: string[]): void {
    this.rampFacade.dispatch(fetchClassesFromMetabolites({metabolites: event}))
  }

  fetchClassesFile(event: string[]): void {
    this.rampFacade.dispatch(fetchClassesFromMetabolitesFile({metabolites: event, format: 'tsv'}))
  }

  private _mapData(data: any): void {
    this.dataAsDataProperty = data.map((obj: Classes) => {
      const newObj: { [key: string]: DataProperty } = {};
      Object.entries(obj).map((value: any, index: any) => {
        newObj[value[0]] = new DataProperty({name: value[0], label: value[0], value: value[1]});
      });
      return newObj;
    })
  }
}
