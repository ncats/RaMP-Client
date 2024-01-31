import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UpsetComponent } from './upset.component';

describe('UpsetComponent', () => {
  let component: UpsetComponent;
  let fixture: ComponentFixture<UpsetComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UpsetComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UpsetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
