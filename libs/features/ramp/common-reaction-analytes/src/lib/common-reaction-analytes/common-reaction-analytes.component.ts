import {ChangeDetectorRef, Component, OnInit} from '@angular/core';
import {DomSanitizer} from "@angular/platform-browser";
import {ActivatedRoute} from "@angular/router";
import {Reaction} from "@ramp/models/ramp-models";
import {QueryPageComponent} from "@ramp/shared/ramp/query-page";
import {DataProperty} from "@ramp/shared/ui/ncats-datatable";
import {fetchCommonReactionAnalytes, RampFacade} from "@ramp/stores/ramp-store";

@Component({
  selector: 'ramp-common-reaction-analytes',
  templateUrl: './common-reaction-analytes.component.html',
  styleUrls: ['./common-reaction-analytes.component.scss']
})
export class CommonReactionAnalytesComponent implements OnInit {
  reactionRaw!: Reaction[];
  reactionColumns: DataProperty[] = [
    new DataProperty({
      label: "Analyte",
      field: "inputAnalyte",
      sortable: true
    }),
    new DataProperty({
      label: "Catalyzed By",
      field: "inputCatalyzedByCommonName",
      sortable: true
    }),
    new DataProperty({
      label: "Catalyst IDs",
      field: "inputCatalyzedBySourceIdsString",
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
    this.rampFacade.reactions$.subscribe((res: Reaction[] | undefined) => {
      if (res && res.length) {
        this.reactionRaw = res;
        //  this.matches = new Set([...res.map(ont => ont.sourceId)]).size
        this.dataAsDataProperty = res.map((reaction: Reaction) => {
          const newObj: { [key: string]: DataProperty } = {};
          Object.entries(reaction).map((value: any, index: any) => {
            newObj[value[0]] = new DataProperty({name: value[0], label: value[0], value: value[1]});
          });
          return newObj;
        })
        this.ref.markForCheck()
      }
    })
  }

  fetchReactions(event: string[]): void {
    this.rampFacade.dispatch(fetchCommonReactionAnalytes({analytes: event}))
  }
}
