import {ChangeDetectorRef, Component, EventEmitter, Input, OnInit, Output, SimpleChange} from '@angular/core';
import {FormControl} from "@angular/forms";
import {DomSanitizer, SafeHtml} from "@angular/platform-browser";
import {ActivatedRoute} from "@angular/router";
import {RampQuery} from "@ramp/models/ramp-models";
import {DataProperty} from "@ramp/shared/ui/ncats-datatable";

@Component({
  selector: 'ramp-query-page',
  templateUrl: './query-page.component.html',
  styleUrls: ['./query-page.component.scss']})
export class QueryPageComponent implements OnInit {
  @Input() rawData!: any;
  @Input() dataColumns!: DataProperty[];
  @Input() dataAsDataProperty!: { [key: string]: DataProperty }[];
  @Input() supportedIdTypes!: any;
  @Input() rampQuery!: RampQuery;
  @Input() matches = 0;

  @Output() dataSearch: EventEmitter<string[]> = new EventEmitter<string[]>();
  @Output() dataDownload: EventEmitter<string[]> = new EventEmitter<string[]>();

  inputFormCtrl: FormControl = new FormControl();
  public queryCount = 0;
  public retArr!: string[];
  public supportedIds!: string[];
  public function!: string;
  public input!: string;
  public examples!: string;
  public title!: string;
  public description!: SafeHtml;
  noDataArr = false;

  constructor(
               private route: ActivatedRoute,

               private sanitizer: DomSanitizer
  ) { }


  ngOnInit(): void {
    console.log("init");
      this.title = this.route.snapshot.data.title;
      this.description = this.sanitizer.bypassSecurityTrustHtml(this.route.snapshot.data.description);
      this.examples = this.route.snapshot.data.examples;
      this.input = this.route.snapshot.data.input;
      this.inputFormCtrl.setValue(this.examples);
      if(!this.retArr) {
        this.parseInput();
      }
  }

  ngOnChanges(change: {[n: string]: SimpleChange}) {
    if(change.supportedIdTypes && !change.supportedIdTypes.firstChange) {
      this.supportedIds = this.supportedIdTypes[this.route.snapshot.data.supportedIdTypes];
      console.log(this);
    }

    if(change.dataAsDataProperty && !change.dataAsDataProperty.firstChange) {
     if(!this.dataAsDataProperty.length || this.dataAsDataProperty.length === 0) {
       this.noDataArr = true;
     }
    }
    }

  public parseInput() {
    if (Array.isArray(this.inputFormCtrl.value)) {
      this.retArr = this.inputFormCtrl.value.map((val: string) => val = val.trim());
    } else {
      this.retArr = this.inputFormCtrl.value.trim().split(/[\t\n,;]+/).map((val: string) => val.trim());
    }
    this.queryCount = this.retArr.length;
  //  this.function = this.route.snapshot.data.function.replace('###REPLACE###', this.retArr.join(', '));
  }

  fetchData() {
    this.parseInput();
    this.dataSearch.emit(this.retArr);
  }

  downloadData() {
    this.parseInput();
    this.dataDownload.emit(this.retArr);
  }
}
