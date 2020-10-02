import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AboutComponent } from './about/about.component';
import { PathwayEnrichmentAnalysisComponent } from './pathway-enrichment-analysis/pathway-enrichment-analysis.component';


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
    path: '**',
    component: AboutComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
