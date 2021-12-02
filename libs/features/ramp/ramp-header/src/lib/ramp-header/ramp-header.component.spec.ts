import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RampHeaderComponent } from './ramp-header.component';

describe('NcatsHeaderComponent', () => {
  let component: RampHeaderComponent;
  let fixture: ComponentFixture<RampHeaderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [RampHeaderComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RampHeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
