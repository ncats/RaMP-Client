import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FeaturesRampReactionsFromAnalytesComponent } from './features-ramp-reactions-from-analytes.component';

describe('FeaturesRampReactionsFromAnalytesComponent', () => {
  let component: FeaturesRampReactionsFromAnalytesComponent;
  let fixture: ComponentFixture<FeaturesRampReactionsFromAnalytesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FeaturesRampReactionsFromAnalytesComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(
      FeaturesRampReactionsFromAnalytesComponent,
    );
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
