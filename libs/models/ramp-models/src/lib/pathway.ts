export class Pathway {
  pathwayName!: string;
  pathwaySource!: string;
  pathwayId!: string;
  pathwayType!: string;
  analyteName?: string;
  commonName?: string;
  inputId!: string;

  constructor(obj: Partial<Pathway>) {
    Object.assign(this, obj);
  }
}
