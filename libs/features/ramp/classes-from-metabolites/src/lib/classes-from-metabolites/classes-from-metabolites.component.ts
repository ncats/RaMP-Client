import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Classes, RampQuery } from '@ramp/models/ramp-models';
import { PageCoreComponent } from '@ramp/shared/ramp/page-core';
import { DataProperty } from '@ramp/shared/ui/ncats-datatable';
import {
  fetchClassesFromMetabolites,
  fetchClassesFromMetabolitesFile,
  RampFacade,
} from '@ramp/stores/ramp-store';
import { takeUntil } from "rxjs";

@Component({
  selector: 'ramp-classes-from-metabolites',
  templateUrl: './classes-from-metabolites.component.html',
  styleUrls: ['./classes-from-metabolites.component.scss'],
})
export class ClassesFromMetabolitesComponent
  extends PageCoreComponent
  implements OnInit
{
  classesColumns: DataProperty[] = [
    new DataProperty({
      label: 'Source IDs',
      field: 'sourceId',
      sortable: true
    }),
    new DataProperty({
      label: 'Names',
      field: 'commonNames'
    }),
    new DataProperty({
      label: 'ClassyFire Super Class',
      field: 'classyFireSuperClass',
      sortable: true
    }),
    new DataProperty({
      label: 'ClassyFire Class',
      field: 'classyFireClass',
      sortable: true
    }),
    new DataProperty({
      label: 'ClassyFire Sub Class',
      field: 'classyFireSubClass',
      sortable: true
    }),
    new DataProperty({
      label: 'LIPIDMAPS Category',
      field: 'lipidMapsCategory',
      sortable: true
    }),
    new DataProperty({
      label: 'LIPIDMAPS Main Class',
      field: 'lipidMapsMainClass',
      sortable: true
    }),
    new DataProperty({
      label: 'LIPIDMAPS Sub Class',
      field: 'lipidMapsSubClass',
      sortable: true
    }),
  /*  new DataProperty({
      label: 'ClassyFire Classes',
      field: 'classyFireTree',
      customComponent: TREE_VIEWER_COMPONENT,
    }),
    new DataProperty({
      label: 'LIPIDMAPS Classes',
      field: 'lipidMapsTree',
      customComponent: TREE_VIEWER_COMPONENT,
    }),*/
  ];

  constructor(
    private ref: ChangeDetectorRef,
    protected rampFacade: RampFacade,
    protected route: ActivatedRoute
  ) {
    super(route, rampFacade);
  }

  ngOnInit(): void {
    this.rampFacade.classes$
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe(
      (res: { data: Classes[]; query: RampQuery } | undefined) => {
        if (res && res.data) {
          const classGroup: Map<string, any> = new Map<string, any>();
          res.data.forEach((chclass) => {
            const classObj = classGroup.get(chclass.treePath);
            if (classObj) {
              classObj.sourceIds.push(chclass.sourceId);
              classGroup.set(chclass.treePath, classObj);
            } else {
              //   const temp = {...chclass};
              const temp = {
                sourceIds: [chclass.sourceId],
                classyFireTree: chclass.classyFireTree,
                lipidMapsTree: chclass.lipidMapsTree,
              };
              classGroup.set(chclass.treePath, temp);
            }
          });
          this._mapData(res.data);
          this.matches = Array.from(new Set(res.data.map(chemClass => chemClass.sourceId.toLocaleLowerCase())));
          this.noMatches = this.inputList.filter((p:string) => !this.matches.includes(p.toLocaleLowerCase()));
        }
        if (res && res.query) {
          this.query = res.query;
        }
        this.ref.markForCheck();
      }
    );
  }

  fetchClasses(event: string[]): void {
    this.inputList = event.map(item => item.toLocaleLowerCase());
    this.rampFacade.dispatch(
      fetchClassesFromMetabolites({ metabolites: event })
    );
  }

  fetchClassesFile(event: string[]): void {
    this.rampFacade.dispatch(
      fetchClassesFromMetabolitesFile({ metabolites: event, format: 'tsv' })
    );
  }

  private _mapData(data: any): void {
    this.dataAsDataProperty = data.map((obj: Classes) => {
      const newObj: { [key: string]: DataProperty } = {};
      Object.entries(obj).map((value: any, index: any) => {
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
