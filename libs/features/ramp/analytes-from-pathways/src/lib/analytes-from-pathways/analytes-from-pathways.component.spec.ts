import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AnalytesFromPathwaysComponent } from './analytes-from-pathways.component';

describe('AnalytesFromPathwaysComponent', () => {
  let component: AnalytesFromPathwaysComponent;
  let fixture: ComponentFixture<AnalytesFromPathwaysComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AnalytesFromPathwaysComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AnalytesFromPathwaysComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
