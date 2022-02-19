import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FlexLayoutModule } from '@angular/flex-layout';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { SharedUiHeaderTemplateModule } from '@ramp/shared/ui/header-template';
import { NcatsHeaderComponent } from './ncats-header.component';

describe('NcatsHeaderComponent', () => {
  let component: NcatsHeaderComponent;
  let fixture: ComponentFixture<NcatsHeaderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [NcatsHeaderComponent],
      imports: [
        RouterTestingModule,
        BrowserAnimationsModule,
        FlexLayoutModule,
        SharedUiHeaderTemplateModule,
      ],
      providers: [{ provide: ActivatedRoute, useValue: {} }],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NcatsHeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
