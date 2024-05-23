import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NcatsDatatableComponent } from './ncats-datatable.component';

describe('NcatsDatatableComponent', () => {
  let component: NcatsDatatableComponent;
  let fixture: ComponentFixture<NcatsDatatableComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [],
      imports: [
        NcatsDatatableComponent
      ],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NcatsDatatableComponent);
    component = fixture.componentInstance;
    component.data = [];
    component.fieldsConfig = [];
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
