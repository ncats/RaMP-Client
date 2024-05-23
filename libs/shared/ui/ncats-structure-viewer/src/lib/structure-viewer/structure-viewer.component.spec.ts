import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DataProperty } from '@ramp/shared/ui/ncats-datatable';

import { StructureViewerComponent } from './structure-viewer.component';

describe('StructureViewerComponent', () => {
  let component: StructureViewerComponent;
  let fixture: ComponentFixture<StructureViewerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StructureViewerComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(StructureViewerComponent);
    component = fixture.componentInstance;
    component.data = new DataProperty({ value: 'c1ccc2CCCc2c1' });
    component.url =
      'https://pharos.ncats.nih.gov/idg/api/v1/render/c1ccc2CCCc2c1?size=150';
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
