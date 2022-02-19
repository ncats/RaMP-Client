import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'ramp-loading',
  templateUrl: './loading.component.html',
  styleUrls: ['./loading.component.scss'],
})
export class LoadingComponent implements OnInit {
  @Input() isLoading = true;
  @Input() position: 'left' | 'right' | 'center' = 'center';
  @Input() size: 'small' | 'medium' | 'large' = 'large';
  sizes = {
    large: 100,
    medium: 50,
    small: 25,
  };

  positions = {
    left: 'spinner-left',
    right: 'spinner-right',
    center: '',
  };

  constructor() {}

  ngOnInit() {}
}
