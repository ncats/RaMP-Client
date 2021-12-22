
export class Classes {
  private _classyFireClasses: ClassLevelNode[] = [];
  classyFireTree?: any;
  lipidMapsTree?: any;
  private _lipidMapsClasses: ClassLevelNode[] = [];
  sourceId!: string;

  constructor(obj: any) {
    if (obj.sourceId) {
      this.sourceId = obj.sourceId;
    }
    if (obj.levels) {
      obj.levels.forEach((level: any) => {
        if (level.class_level_name.includes('LipidMaps')) {
          this._lipidMapsClasses.push(new ClassLevelNode(level))
        } else {
          this._classyFireClasses.push(new ClassLevelNode(level))
        }
      });
    }

    if (this._classyFireClasses.length) {
      this.classyFireTree = [
        {
          "value": this._classyFireClasses.find(node => node.level === 0)?.value,
          "children": [
            {
              "value": this._classyFireClasses.find(node => node.level === 1)?.value,
              "children": [
                {
                  "value": this._classyFireClasses.find(node => node.level === 2)?.value
                }
              ]
            }
          ]
        }
      ]
    }
    if (this._lipidMapsClasses.length) {
      this.lipidMapsTree = [
        {
          "value": this._lipidMapsClasses.find(node => node.level === 0)?.value,
          "children": [
            {
              "value": this._lipidMapsClasses.find(node => node.level === 1)?.value,
              "children": [
                {
                  "value": this._lipidMapsClasses.find(node => node.level === 2)?.value
                }
              ]
            }
          ]
        }
      ]

      console.log(this.classyFireTree);
    }
  }
}

export class ClassLevelNode {
  class_level_name!: string;
 // label!: string;
  value!: string;
  level = 1;
  expandable = true;
  children!: ClassLevelNode[];

  constructor(obj: any) {
    if(obj.class_level_name) {
      this.class_level_name = obj.class_level_name;
    }

    if(obj.class_level_name.includes("super") || obj.class_level_name.includes("category")) {
      this.level = 0;
    } else if(obj.class_level_name.includes("sub")) {
      this.level = 2;
      this.expandable = false;
    }

    if(obj.class_name) {
      this.value = obj.class_name;
    }
  }
}
