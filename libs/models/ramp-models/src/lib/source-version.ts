import { Observable } from "rxjs";
import { EntityCount } from "./entity-count";

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
  entityCounts: EntityCount[],
  supportedIds: [{analyteType: string, idTypes: string[]}],
  metaboliteIntersects: any[],
  geneIntersects: any[],
  sourceVersions: SourceVersion[],
  databaseUrl: string[]
}
