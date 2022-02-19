import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FlexLayoutModule } from '@angular/flex-layout';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { SharedNcatsDataDownloadModule } from '@ramp/shared/ncats/data-download';
import { SharedUiDescriptionPanelModule } from '@ramp/shared/ui/description-panel';
import { SharedUiNcatsDatatableModule } from '@ramp/shared/ui/ncats-datatable';

import { QueryPageComponent } from './query-page.component';

describe('QueryPageComponent', () => {
  let component: QueryPageComponent;
  let fixture: ComponentFixture<QueryPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [QueryPageComponent],
      imports: [
        BrowserAnimationsModule,
        RouterTestingModule,
        ReactiveFormsModule,
        FormsModule,
        MatFormFieldModule,
        FlexLayoutModule,
        MatInputModule,
        MatButtonModule,
        SharedUiDescriptionPanelModule,
        SharedUiNcatsDatatableModule,
        SharedNcatsDataDownloadModule,
      ],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: {
              data: {
                title: 'Analytes From Pathways',
                input: 'pathways',
                function:
                  'analytes <- RaMP::getAnalyteFromPathway(pathway="###REPLACE###")',
                examples:
                  'De Novo Triacylglycerol Biosynthesis, sphingolipid metabolism',
                description:
                  'Analytes (genes, proteins, metabolites) can be retrieve by pathway. Enter a list of exact pathway names.',
              },
            },
          },
        },
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(QueryPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
