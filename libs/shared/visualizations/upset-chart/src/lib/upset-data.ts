export class UpsetData {
  id: string;
  sets: string[];
  size: number;
  combinations: { setId: string; member: boolean }[];
  connectorIndices: [number, number] | [undefined, undefined];

  constructor(data: {
    id: string | number;
    sets: string[];
    size: number;
    combinations?: { setId: string; member: boolean }[];
    connectorIndices?: [number, number] | [undefined, undefined];
  }) {
    this.id = data.id.toString();
    this.sets = data.sets || [];
    this.size = data.size || 0;
    this.combinations = data.combinations || [];
    this.connectorIndices = data.connectorIndices || [undefined, undefined];
  }
}
