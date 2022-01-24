export class Pathway {
  pathwayName!: string;
  pathwaysource!: string;
  pathwaysourceId!: string;
  pathwayType!: string;
  analyteName!: string;

  constructor(obj: any) {
  Object.assign(this, obj);
  }
  }
