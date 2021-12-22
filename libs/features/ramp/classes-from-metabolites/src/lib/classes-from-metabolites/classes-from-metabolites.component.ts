import {ChangeDetectorRef, Component, OnInit} from '@angular/core';
import {Classes} from "@ramp/models/ramp-models";
import {DataProperty} from "@ramp/shared/ui/ncats-datatable";
import {fetchClassesFromMetabolites, RampFacade} from "@ramp/stores/ramp-store";
import {TREE_VIEWER_COMPONENT} from "../features-ramp-classes-from-metabolites.module";

@Component({
  selector: 'ramp-classes-from-metabolites',
  templateUrl: './classes-from-metabolites.component.html',
  styleUrls: ['./classes-from-metabolites.component.scss']
})
export class ClassesFromMetabolitesComponent implements OnInit {
  classesRaw!: Classes[];
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

  matches = 0;
  dataAsDataProperty!: { [key: string]: DataProperty }[];

  constructor(
    private ref: ChangeDetectorRef,
    private rampFacade: RampFacade
  ) {
  }


  ngOnInit(): void {
    this.rampFacade.classes$.subscribe((res: Classes[] | undefined) => {
      if (res && res.length) {
        //todo: download of this won't match R response
        this.classesRaw = res;
        this.matches = new Set([...res.map(obj => obj.sourceId)]).size
        this.dataAsDataProperty = res.map((classes: Classes) => {
          const newObj: { [key: string]: DataProperty } = {};
          Object.entries(classes).map((value: any, index: any) => {
            newObj[value[0]] = new DataProperty({name: value[0], label: value[0], value: value[1]});
          });
          return newObj;
        })
        console.log(this);
        this.ref.markForCheck()
      }
    })
  }

  fetchClasses(event: string[]): void {
    this.rampFacade.dispatch(fetchClassesFromMetabolites({metabolites: event}))
  }
}
