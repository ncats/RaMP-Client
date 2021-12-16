export class Pathway {
  pathwayName!: string;
  pathwaysource!: string;
  pathwaysourceId!: string;

  pathwayCategory!: string;
  pathwayType!: string;
  analyteName!: string;

  constructor(obj: any) {
  Object.assign(this, obj);
  }
  }
