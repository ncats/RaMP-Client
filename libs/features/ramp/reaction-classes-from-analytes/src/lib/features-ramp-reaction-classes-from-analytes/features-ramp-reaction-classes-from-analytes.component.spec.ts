import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { FeaturesRampReactionClassesFromAnalytesComponent } from './features-ramp-reaction-classes-from-analytes.component';

describe('FeaturesRampReactionClassesFromAnalytesComponent', () => {
  let component: FeaturesRampReactionClassesFromAnalytesComponent;
  let fixture: ComponentFixture<FeaturesRampReactionClassesFromAnalytesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [],
      imports: [
        BrowserAnimationsModule,
        FeaturesRampReactionClassesFromAnalytesComponent
      ]
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
