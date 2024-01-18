import { DOCUMENT, TitleCasePipe } from '@angular/common';
import {
  ChangeDetectorRef,
  Component, DestroyRef, inject,
  Inject,
  Input,
  OnInit
} from "@angular/core";
import { takeUntilDestroyed } from "@angular/core/rxjs-interop";
import { select, Store } from "@ngrx/store";
import { Analyte, RampQuery } from '@ramp/models/ramp-models';
import { InputRowComponent } from "@ramp/shared/ramp/input-row";
import { PageCoreComponent } from '@ramp/shared/ramp/page-core';
import { QueryPageComponent } from "@ramp/shared/ramp/query-page";
import { DescriptionComponent } from "@ramp/shared/ui/description-panel";
import { FeedbackPanelComponent } from "@ramp/shared/ui/feedback-panel";
import { DataProperty } from '@ramp/shared/ui/ncats-datatable';
import { AnalyteFromPathwayActions} from "@ramp/stores/ramp-store";
import { map, takeUntil } from "rxjs";

import { FlexModule } from '@angular/flex-layout/flex';
import * as RampSelectors from "../../../../../../stores/ramp-store/src/lib/+state/ramp-store/ramp.selectors";

@Component({
    selector: 'ramp-analytes-from-pathways',
    templateUrl: './analytes-from-pathways.component.html',
    styleUrls: ['./analytes-from-pathways.component.scss'],
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
export class AnalytesFromPathwaysComponent
  extends PageCoreComponent
  implements OnInit
{
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
    new DataProperty({
      label: 'Pathway ID',
      field: 'pathwayId',
      sortable: true,
    }),
  ];

  override fuzzy = true;

  constructor(
    private ref: ChangeDetectorRef,
    @Inject(DOCUMENT) protected override dom: Document,
  ) {
    super(dom);
  }

  ngOnInit(): void {
    this.store
      .pipe(
        select(RampSelectors.getAnalytes),
        takeUntilDestroyed(this.destroyRef),
        map((res: { data: Analyte[]; query: RampQuery; dataframe: any }| undefined) => {
          if (res && res.data) {
            this._mapData(res.data);
            this.matches = Array.from(
              new Set(
                res.data.map((pathway) =>
                  pathway.pathwayName.toLocaleLowerCase(),
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
                'fetchAnalytesFromPathways-download.tsv',
              );
              this.downloadQueued = false;
            }
          }
          this.ref.markForCheck();
        })
  ).subscribe()
  }

  fetchAnalytes(event: string[]): void {
    this.inputList = event.map((item) => item.toLocaleLowerCase());
    this.store.dispatch(AnalyteFromPathwayActions.fetchAnalytesFromPathways({ pathways: event }));
  }

  fetchAnalytesFile(event: string[]): void {
    if (!this.dataframe) {
      this.fetchAnalytes(event);
      this.downloadQueued = true;
    } else {
      this._downloadFile(
        this._toTSV(this.dataframe),
        'fetchAnalytesFromPathways-download.tsv',
      );
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
