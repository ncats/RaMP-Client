export interface EntityCount {
  category: string;
  [key: string]: any;
  hmdb?: number;
  lipidmaps?: number;
  reactome?: number;
  wiki?: number;
  chebi?: number;
  kegg?: number;
}

export interface SourceCount {
  entity: string;
  entitySourceId: string;
  entitySourceName: string;
  entityCount: number;
}
