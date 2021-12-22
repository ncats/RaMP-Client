import {ChangeDetectorRef, Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {FormControl} from "@angular/forms";
import {DomSanitizer, SafeHtml} from "@angular/platform-browser";
import {ActivatedRoute} from "@angular/router";
import {DataProperty} from "@ramp/shared/ui/ncats-datatable";

@Component({
  selector: 'ramp-query-page',
  templateUrl: './query-page.component.html',
  styleUrls: ['./query-page.component.scss']})
export class QueryPageComponent implements OnInit {
  @Input() rawData: any;
  @Input() dataColumns!: DataProperty[];
  @Input() dataAsDataProperty!: { [key: string]: DataProperty }[];
  @Input() matches = 0;

  @Output() dataSearch: EventEmitter<string[]> = new EventEmitter<string[]>();

  inputFormCtrl: FormControl = new FormControl();
  public queryCount = 0;

  public retArr!: string[];
  public function!: string;
  public input!: string;
  public examples!: string;
  public title!: string;
  public description!: SafeHtml;

  constructor(
               private route: ActivatedRoute,
               private sanitizer: DomSanitizer,
            //   private ref: ChangeDetectorRef,
  ) { }


  ngOnInit(): void {
      this.title = this.route.snapshot.data.title;
      this.description = this.sanitizer.bypassSecurityTrustHtml(this.route.snapshot.data.description);
      this.examples = this.route.snapshot.data.examples;
      this.input = this.route.snapshot.data.input;
      this.inputFormCtrl.setValue(this.examples);
  }

  public parseInput() {
    if (Array.isArray(this.inputFormCtrl.value)) {
      this.retArr = this.inputFormCtrl.value.map((val: string) => val = val.trim());
    } else {
      this.retArr = this.inputFormCtrl.value.trim().split(/[\t\n,;]+/).map((val: string) => val.trim());
    }
    this.queryCount = this.retArr.length;
    this.function = this.route.snapshot.data.function.replace('###REPLACE###', this.retArr.join(', '));
  }

  fetchData() {
    this.parseInput();
    this.dataSearch.emit(this.retArr);
  }
}
