import { EntityCount } from './entity-count';

export interface SourceVersion {
  ramp_db_version: string;
  db_mod_date: string;
  status: string;
  data_source_id: string;
  data_source_name: string;
  data_source_url: string;
  data_source_version: string;
}

export interface Stats {
  entityCounts?: EntityCount[];
  supportedIds?: { analyteType: string; idTypes: string[] }[];
  metaboliteIntersects?: { id: string; sets: string[]; size: number }[];
  geneIntersects?: { id: string; sets: string[]; size: number }[];
  sourceVersions?: SourceVersion[];
  databaseUrl?: string;
}
