import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { ReactionsFromAnalytesComponent } from './features-ramp-reactions-from-analytes.component';

describe('ReactionsFromAnalytesComponent', () => {
  let component: ReactionsFromAnalytesComponent;
  let fixture: ComponentFixture<ReactionsFromAnalytesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        BrowserAnimationsModule,
        ReactionsFromAnalytesComponent
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(
      ReactionsFromAnalytesComponent,
    );
    component = fixture.componentInstance;

    fixture.detectChanges();
  })

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
