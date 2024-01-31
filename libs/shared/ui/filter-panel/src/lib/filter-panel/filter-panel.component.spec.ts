import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { FilterPanelComponent, FilterValue } from "./filter-panel.component";

describe('FilterPanelComponent', () => {
  let component: FilterPanelComponent<FilterValue>;
  let fixture: ComponentFixture<FilterPanelComponent<FilterValue>>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [],
      imports: [
        BrowserAnimationsModule,
        FilterPanelComponent
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FilterPanelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
