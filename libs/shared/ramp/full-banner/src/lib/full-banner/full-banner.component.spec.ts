import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RampFullBannerComponent } from "./full-banner.component";

describe('SharedUiFullBannerComponent', () => {
  let component: RampFullBannerComponent;
  let fixture: ComponentFixture<RampFullBannerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RampFullBannerComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(RampFullBannerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
