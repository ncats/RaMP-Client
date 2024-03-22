import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FeaturesRampReactionClassesFromAnalytesComponent } from './features-ramp-reaction-classes-from-analytes.component';

describe('FeaturesRampReactionClassesFromAnalytesComponent', () => {
  let component: FeaturesRampReactionClassesFromAnalytesComponent;
  let fixture: ComponentFixture<FeaturesRampReactionClassesFromAnalytesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FeaturesRampReactionClassesFromAnalytesComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(
      FeaturesRampReactionClassesFromAnalytesComponent,
    );
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
