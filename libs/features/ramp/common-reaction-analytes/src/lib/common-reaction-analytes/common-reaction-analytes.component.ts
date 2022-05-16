import { DOCUMENT } from "@angular/common";
import { ChangeDetectorRef, Component, Inject, OnInit } from "@angular/core";
import { ActivatedRoute } from '@angular/router';
import { RampQuery, Reaction } from '@ramp/models/ramp-models';
import { PageCoreComponent } from '@ramp/shared/ramp/page-core';
import { DataProperty } from '@ramp/shared/ui/ncats-datatable';
import {
  fetchCommonReactionAnalytes,
  RampFacade,
} from '@ramp/stores/ramp-store';
import { takeUntil } from "rxjs";

@Component({
  selector: 'ramp-common-reaction-analytes',
  templateUrl: './common-reaction-analytes.component.html',
  styleUrls: ['./common-reaction-analytes.component.scss'],
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

  constructor(
    private ref: ChangeDetectorRef,
    protected rampFacade: RampFacade,
    protected route: ActivatedRoute,
    @Inject(DOCUMENT) protected dom: Document
  ) {
    super(route, rampFacade, dom);
  }

  ngOnInit(): void {
    this.rampFacade.reactions$
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe(
      (res: { data: Reaction[]; query: RampQuery; dataframe: any; } | undefined) => {
        if (res && res.data) {
          this._mapData(res.data);
          this.matches = Array.from(new Set(res.data.map(reaction => reaction.inputAnalyte.toLocaleLowerCase())));
          this.noMatches = this.inputList.filter((p:string) => !this.matches.includes(p.toLocaleLowerCase()));
        }
        if (res && res.query) {
          this.query = res.query;
        }
        if (res && res.dataframe) {
          this.dataframe = res.dataframe;
          if (this.downloadQueued) {
            this._downloadFile(this._toTSV(this.dataframe), 'fetchCommonReactionAnalytes-download.tsv')
            this.downloadQueued = false;
          }
        }
        this.ref.markForCheck();
      }
    );
  }

  fetchReactions(event: string[]): void {
    this.inputList = event.map(item => item.toLocaleLowerCase());
    this.rampFacade.dispatch(fetchCommonReactionAnalytes({ analytes: event }));
  }

  fetchReactionsFile(event: string[]): void {
    if(!this.dataframe) {
      this.fetchReactions(event);
      this.downloadQueued = true;
    } else {
      this._downloadFile(this._toTSV(this.dataframe), 'fetchCommonReactionAnalytes-download.tsv' )
    }
  }

  private _mapData(data: any): void {
    this.dataAsDataProperty = data.map((reaction: Reaction) => {
      const newObj: { [key: string]: DataProperty } = {};
      Object.entries(reaction).map((value: any, index: any) => {
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
