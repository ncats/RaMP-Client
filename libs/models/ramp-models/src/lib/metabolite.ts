export class Metabolite {
  pathwayName!: string;

  constructor(obj: any) {
    Object.assign(this, obj);
  }
}
