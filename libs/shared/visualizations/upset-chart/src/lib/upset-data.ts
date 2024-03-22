export class UpsetData {
  id: string;
  sets: string[];
  size = 0;
  combinations: { setId: string; member: boolean }[];
  connectorIndices: [number, number] | [undefined, undefined];

  constructor(data: Partial<UpsetData>) {
    this.id = <string>data.id;
    this.sets = data.sets || [];
    this.size = data.size || 0;
    this.combinations = data.combinations || [];
    this.connectorIndices = data.connectorIndices || [undefined, undefined];
  }
}
