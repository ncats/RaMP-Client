export class Pathway {
  pathwayName!: string;
  pathwaySource!: string;
  pathwayId!: string;
  pathwayType!: string;
  analyteName!: string;
  inputId!: string;

  constructor(obj: any) {
    Object.assign(this, obj);
  }
}
