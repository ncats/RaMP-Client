export interface UpsetIntersection {
    name: string;
    num: number;
    setName?: string;
    values?: Array<any>;
}

export class UpsetData {
  intersections: Array<UpsetIntersection>
  soloSets: Array<UpsetIntersection> | any
  allData: Array<UpsetIntersection>
}
