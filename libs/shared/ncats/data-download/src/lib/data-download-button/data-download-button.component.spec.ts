import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DataDownloadButtonComponent } from './data-download-button.component';

describe('DataDownloadButtonComponent', () => {
  let component: DataDownloadButtonComponent;
  let fixture: ComponentFixture<DataDownloadButtonComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DataDownloadButtonComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DataDownloadButtonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
