import { Pathway } from '../pathway-enrichment-analysis/pathway.model';

export interface PathwayMatch {
  input: string;
  pathwayRampIdList: Array<string>;
  pathwaySourceList: Array<string>;
  pathwaySources: string;
  numPathways: number;
  pathwayCategoryList: Array<string>;
  pathwayCategories: string;
  pathways: Array<Pathway>;
  pathwayName: string;
}
