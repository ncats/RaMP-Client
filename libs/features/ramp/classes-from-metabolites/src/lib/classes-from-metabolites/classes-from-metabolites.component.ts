import { DOCUMENT, TitleCasePipe } from '@angular/common';
import {
  ChangeDetectorRef,
  Component, DestroyRef,
  ElementRef, inject,
  Inject,
  OnInit,
  ViewChild
} from "@angular/core";
import { takeUntilDestroyed } from "@angular/core/rxjs-interop";
import { UntypedFormControl } from '@angular/forms';
import { select, Store } from "@ngrx/store";
import { Classes, RampQuery } from '@ramp/models/ramp-models';
import { InputRowComponent } from "@ramp/shared/ramp/input-row";
import { PageCoreComponent } from '@ramp/shared/ramp/page-core';
import { QueryPageComponent } from "@ramp/shared/ramp/query-page";
import { DescriptionComponent } from "@ramp/shared/ui/description-panel";
import { FeedbackPanelComponent } from "@ramp/shared/ui/feedback-panel";
import { DataProperty } from '@ramp/shared/ui/ncats-datatable';
import {
  ClassesFromMetabolitesActions
} from "@ramp/stores/ramp-store";
import { map, takeUntil } from "rxjs";
import { FlexModule } from '@angular/flex-layout/flex';
import * as RampSelectors from "../../../../../../stores/ramp-store/src/lib/+state/ramp-store/ramp.selectors";

@Component({
    selector: 'ramp-classes-from-metabolites',
    templateUrl: './classes-from-metabolites.component.html',
    styleUrls: ['./classes-from-metabolites.component.scss'],
    standalone: true,
    imports: [
        FlexModule,
        DescriptionComponent,
        InputRowComponent,
        FeedbackPanelComponent,
        QueryPageComponent,
        TitleCasePipe,
    ],
})
export class ClassesFromMetabolitesComponent
  extends PageCoreComponent
  implements OnInit
{
  @ViewChild('fileUpload') fileUpload!: ElementRef;
  classesColumns: DataProperty[] = [
    new DataProperty({
      label: 'Source IDs',
      field: 'sourceId',
      sortable: true,
    }),
    new DataProperty({
      label: 'Names',
      field: 'commonNames',
    }),
    new DataProperty({
      label: 'ClassyFire Super Class',
      field: 'classyFireSuperClass',
      sortable: true,
    }),
    new DataProperty({
      label: 'ClassyFire Class',
      field: 'classyFireClass',
      sortable: true,
    }),
    new DataProperty({
      label: 'ClassyFire Sub Class',
      field: 'classyFireSubClass',
      sortable: true,
    }),
    new DataProperty({
      label: 'LIPIDMAPS Category',
      field: 'lipidMapsCategory',
      sortable: true,
    }),
    new DataProperty({
      label: 'LIPIDMAPS Main Class',
      field: 'lipidMapsMainClass',
      sortable: true,
    }),
    new DataProperty({
      label: 'LIPIDMAPS Sub Class',
      field: 'lipidMapsSubClass',
      sortable: true,
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
  fileName = '';
  file?: File;
  biospecimenCtrl: UntypedFormControl = new UntypedFormControl();
  biospecimens: string[] = [
    'Blood',
    'Adipose',
    'Heart',
    'Urine',
    'Brain',
    'Liver',
    'Kidney',
    'Saliva',
    'Feces',
  ];

  constructor(
    private ref: ChangeDetectorRef,
    @Inject(DOCUMENT) protected override dom: Document,
  ) {
    super(dom);
  }

  ngOnInit(): void {
    this.store
      .pipe(
        select(RampSelectors.getClasses),
        takeUntilDestroyed(this.destroyRef),
        map(
          (res:
          | {
              dataframe: any;
              data: Classes[];
              query: RampQuery;
            }
          | undefined,
      ) => {
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
          this.matches = Array.from(
            new Set(
              res.data.map((chemClass) =>
                chemClass.sourceId.toLocaleLowerCase(),
              ),
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
              'fetchChemicalClass-download.tsv',
            );
            this.downloadQueued = false;
          }
        }
        this.ref.markForCheck();
      },
    )).subscribe();
  }

  fetchClasses(event: string[]): void {
    this.inputList = event.map((item) => item.toLocaleLowerCase());
    if (this.file) {
      this.store.dispatch(
        ClassesFromMetabolitesActions.fetchClassesFromMetabolites({
          metabolites: event,
          biospecimen: this.biospecimenCtrl.value,
          background: this.file,
        }),
      );
    } else {
      this.store.dispatch(
        ClassesFromMetabolitesActions.fetchClassesFromMetabolites({
          metabolites: event,
          biospecimen: this.biospecimenCtrl.value,
        }),
      );
    }
  }

  fetchClassesFile(event: string[]): void {
    if (!this.dataframe) {
      this.fetchClasses(event);
      this.downloadQueued = true;
    } else {
      this._downloadFile(
        this._toTSV(this.dataframe),
        'fetchChemicalClass-download.tsv',
      );
    }
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

  onFileSelected(event: any) {
    this.file = event.target.files[0];
    if (this.file) {
      this.fileName = this.file.name;
      this.ref.markForCheck();
    }
  }

  cancelUpload() {
    this.fileName = '';
    this.file = undefined;
    this.fileUpload.nativeElement.value = '';
    this.ref.markForCheck();
  }
}
