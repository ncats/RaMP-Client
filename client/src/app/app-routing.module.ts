import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AboutComponent } from './about/about.component';
import { AnalytesFromPathwayComponent } from './analytes-from-pathway/analytes-from-pathway.component';
import { ChemicalAnalysisComponent } from './chemical-analysis/chemical-analysis.component';
import { CommonReactionAnalytesComponent } from './common-reaction-analytes/common-reaction-analytes.component';
import { OntologiesComponent } from './ontologies/ontologies.component';
import { PathwayEnrichmentAnalysisComponent } from './pathway-enrichment-analysis/pathway-enrichment-analysis.component';
import { PathwaysFromAnalytesComponent } from './pathways-from-analytes/pathways-from-analytes.component';

const routes: Routes = [
  {
    path: 'about',
    component: AboutComponent,
    data: {
      id: 'about',
      display: 'About',
      order: 1,
      isMainNav: true
    }
  },
  {
    path: 'pathway-enrichment-analysis',
    component: PathwayEnrichmentAnalysisComponent,
    data: {
      id: 'pea',
      display: 'Pathway enrichment analysis',
      order: 2,
      isMainNav: true
    }
  },
  {
    path: 'analytes-from-pathways',
    component: AnalytesFromPathwayComponent,
    data: {
      id: 'afp',
      display: 'Analytes from pathways',
      order: 3,
      isMainNav: true
    }
  },
  {
    path: 'pathways-from-analytes',
    component: PathwaysFromAnalytesComponent,
    data: {
      id: 'pfa',
      display: 'Pathways from analytes',
      order: 4,
      isMainNav: true
    }
  },
  {
    path: 'common-reaction-analytes',
    component: CommonReactionAnalytesComponent,
    data: {
      id: 'cra',
      display: 'Common reaction analytes',
      order: 5,
      isMainNav: true
    }
  },
  {
    path: 'ontologies',
    component: OntologiesComponent,
    data: {
      id: 'ontologies',
      display: 'Ontologies',
      order: 6,
      isMainNav: true
    }
  },
  {
    path: 'chemical-analysis',
    component: ChemicalAnalysisComponent,
    data: {
      id: 'chemicalAnalysis',
      display: 'Chemical Analysis',
      order: 7,
      isMainNav: true
    }
  },
  {
    path: '**',
    component: AboutComponent
  }
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, {
      scrollPositionRestoration: 'top',
      anchorScrolling: 'enabled',
      onSameUrlNavigation: 'reload',
     // scrollOffset: [0, 120],
      initialNavigation: 'enabled'
    })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
