import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CommonReactionAnalytesComponent } from './common-reaction-analytes.component';

describe('CommonReactionAnalytesComponent', () => {
  let component: CommonReactionAnalytesComponent;
  let fixture: ComponentFixture<CommonReactionAnalytesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [CommonReactionAnalytesComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CommonReactionAnalytesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
