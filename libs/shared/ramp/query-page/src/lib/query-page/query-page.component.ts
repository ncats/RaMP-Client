import {ChangeDetectorRef, Component, OnInit} from '@angular/core';
import {FormControl} from "@angular/forms";
import {DomSanitizer, SafeHtml} from "@angular/platform-browser";
import {ActivatedRoute} from "@angular/router";
import {DataProperty} from "@ramp/shared/ui/ncats-datatable";

@Component({
  template: '',
})
export class QueryPageComponent implements OnInit {
  public inputFormCtrl: FormControl = new FormControl();
  public dataAsDataProperty!: { [key: string]: DataProperty }[];
  public matches = 0;
  public queryCount = 0;
  public retArr!: string[];

  public function!: string;
  public input!: string;
  public examples!: string;
  public title!: string;
  public description!: SafeHtml;

  constructor(
               private route: ActivatedRoute,
               private sanitizer: DomSanitizer
  ) { }

  ngOnInit(): void {
      console.log(this);
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
}
