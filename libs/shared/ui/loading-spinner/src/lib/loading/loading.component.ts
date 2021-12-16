import {Component, Input, OnInit} from '@angular/core';

@Component({
  selector: 'ramp-loading',
  templateUrl: './loading.component.html',
  styleUrls: ['./loading.component.scss']
})
export class LoadingComponent implements OnInit{
@Input()  isLoading = true;

constructor(){}

  ngOnInit() { }
}
