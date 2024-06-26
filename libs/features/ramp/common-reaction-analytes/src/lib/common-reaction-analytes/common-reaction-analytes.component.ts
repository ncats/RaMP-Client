import { TitleCasePipe } from '@angular/common';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { select } from '@ngrx/store';
import { RampResponse, Reaction } from '@ramp/models/ramp-models';
import { InputRowComponent } from '@ramp/shared/ramp/input-row';
import { PageCoreComponent } from '@ramp/shared/ramp/page-core';
import { QueryPageComponent } from '@ramp/shared/ramp/query-page';
import { DescriptionComponent } from '@ramp/shared/ui/description-panel';
import { FeedbackPanelComponent } from '@ramp/shared/ui/feedback-panel';
import { DataProperty } from '@ramp/shared/ui/ncats-datatable';
import {
  CommonReactionAnalyteActions,
  RampSelectors,
} from '@ramp/stores/ramp-store';
import { map } from 'rxjs';

@Component({
  selector: 'ramp-common-reaction-analytes',
  templateUrl: './common-reaction-analytes.component.html',
  styleUrls: ['./common-reaction-analytes.component.scss'],
  standalone: true,
  imports: [
    DescriptionComponent,
    InputRowComponent,
    FeedbackPanelComponent,
    QueryPageComponent,
    TitleCasePipe,
  ],
})
export class CommonReactionAnalytesComponent
  extends PageCoreComponent
  implements OnInit
{
  reactionColumns: DataProperty[] = [
    new DataProperty({
      label: 'Analyte Id',
      field: 'inputAnalyte',
      sortable: true,
    }),
    new DataProperty({
      label: 'Analyte',
      field: 'inputCommonNames',
      sortable: true,
    }),
    new DataProperty({
      label: 'Relation',
      field: 'queryRelation',
      sortable: true,
    }),
    new DataProperty({
      label: 'Catalyzed By',
      field: 'rxnPartnerCommonName',
      sortable: true,
    }),
    new DataProperty({
      label: 'Catalyst IDs',
      field: 'rxnPartnerIdsString',
    }),
  ];

  constructor(private ref: ChangeDetectorRef) {
    super();
  }

  ngOnInit(): void {
    this._getSupportedIds();
    this.store
      .pipe(
        select(RampSelectors.getCommonReactions),
        takeUntilDestroyed(this.destroyRef),
        map((res: RampResponse<Reaction> | undefined) => {
          if (res && res.data) {
            this._mapData(res.data);
            this.matches = Array.from(
              new Set(
                res.data.map((reaction: Reaction) =>
                  reaction.inputAnalyte.toLocaleLowerCase(),
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
                'fetchCommonReactionAnalytes-download.tsv',
              );
              this.downloadQueued = false;
            }
          }
          this.ref.markForCheck();
        }),
      )
      .subscribe();
  }

  fetchReactions(event: string[]): void {
    this.inputList = event.map((item) => item.toLocaleLowerCase());
    this.store.dispatch(
      CommonReactionAnalyteActions.fetchCommonReactionAnalytes({
        analytes: event,
      }),
    );
  }

  fetchReactionsFile(event: string[]): void {
    if (!this.dataframe) {
      this.fetchReactions(event);
      this.downloadQueued = true;
    } else {
      this._downloadFile(
        this._toTSV(this.dataframe),
        'fetchCommonReactionAnalytes-download.tsv',
      );
    }
  }
}
