export interface EntityCount {
  entity: string;
  counts: { [sourceName: string]: number };
}

export interface SourceCount {
  entity: string;
  entitySourceId: string;
  entitySourceName: string;
  entityCount: number;
}
