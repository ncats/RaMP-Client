import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FlexLayoutModule } from "@angular/flex-layout";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { RouterTestingModule } from "@angular/router/testing";

import { NcatsFooterComponent } from './ncats-footer.component';

describe('NcatsFooterComponent', () => {
  let component: NcatsFooterComponent;
  let fixture: ComponentFixture<NcatsFooterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NcatsFooterComponent ],
      imports: [
        RouterTestingModule,
        BrowserAnimationsModule,
        FlexLayoutModule
      ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NcatsFooterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
