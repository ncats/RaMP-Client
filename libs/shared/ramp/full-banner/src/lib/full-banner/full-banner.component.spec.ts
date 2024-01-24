import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FullBannerComponent } from './shared-ui-full-banner.component';

describe('SharedUiFullBannerComponent', () => {
  let component: FullBannerComponent;
  let fixture: ComponentFixture<FullBannerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FullBannerComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(FullBannerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
