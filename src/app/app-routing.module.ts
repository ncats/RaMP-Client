import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PathwayEnrichmentAnalysisComponent } from './pathway-enrichment-analysis/pathway-enrichment-analysis.component';


const routes: Routes = [
  {
    path: 'pathway-enrichment-analysis',
    component: PathwayEnrichmentAnalysisComponent
  },
  {
    path: '**',
    component: PathwayEnrichmentAnalysisComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
