import {Component, Input, OnInit} from '@angular/core';
import {RampFacade} from "@ramp/stores/ramp-store";

@Component({
  selector: 'ramp-loading',
  templateUrl: './loading.component.html',
  styleUrls: ['./loading.component.scss']
})
export class LoadingComponent implements OnInit{
@Input()  isLoading = true;

constructor(
  private rampFacade: RampFacade
){}

  ngOnInit() {
  this.rampFacade.loaded$.subscribe(res => this.isLoading = res);
  }
}
