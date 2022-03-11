export class Classes {
  commonNames!: string;
  classyFireSuperClass!: string;
  classyFireClass!: string;
  classyFireSubClass!: string;
  lipidMapsCategory!: string;
  lipidMapsMainClass!: string;
  lipidMapsSubClass!: string;
  private _classyFireClasses: ClassLevelNode[] = [];
  classyFireTree?: any;
  lipidMapsTree?: any;
  private _lipidMapsClasses: ClassLevelNode[] = [];
  treePath!: string;
  sourceId!: string;

  constructor(obj: any) {
    if (obj.sourceId) {
      this.sourceId = obj.sourceId;
    }
    if (obj.levels) {
      obj.levels.forEach((level: any) => {
        if (level.common_names) {
          this.commonNames = level.common_names;
        }

        if(level.class_level_name === "ClassyFire_super_class") {
          this.classyFireSuperClass = level.class_name;
        }
        if(level.class_level_name === "ClassyFire_class") {
          this.classyFireClass = level.class_name;
        }
        if(level.class_level_name === "ClassyFire_sub_class") {
          this.classyFireSubClass = level.class_name;
        }

        if(level.class_level_name === "LipidMaps_category") {
          this.lipidMapsCategory = level.class_name;
        }
        if(level.class_level_name === "LipidMaps_main_class") {
          this.lipidMapsMainClass = level.class_name;
        }
        if(level.class_level_name === "LipidMaps_sub_class") {
          this.lipidMapsSubClass = level.class_name;
        }

      //  this[class_level_name] =
        if (level.class_level_name.includes('LipidMaps')) {
          this._lipidMapsClasses.push(new ClassLevelNode(level));
        } else {
          this._classyFireClasses.push(new ClassLevelNode(level));
        }
      });
    }

    if (this._classyFireClasses.length) {
      this.classyFireTree = [
        {
          value: this._classyFireClasses.find((node) => node.level === 0)
            ?.value,
          children: [
            {
              value: this._classyFireClasses.find((node) => node.level === 1)
                ?.value,
              children: [
                {
                  value: this._classyFireClasses.find(
                    (node) => node.level === 2
                  )?.value,
                },
              ],
            },
          ],
        },
      ];
      this.treePath = (
        this.classyFireTree[0].value +
        this.classyFireTree[0].children[0].value +
        this.classyFireTree[0].children[0].children[0].value
      )
        .toLocaleLowerCase()
        .replace(/ /g, '');
    }
    if (this._lipidMapsClasses.length) {
      this.lipidMapsTree = [
        {
          value: this._lipidMapsClasses.find((node) => node.level === 0)?.value,
          children: [
            {
              value: this._lipidMapsClasses.find((node) => node.level === 1)
                ?.value,
              children: [
                {
                  value: this._lipidMapsClasses.find((node) => node.level === 2)
                    ?.value,
                },
              ],
            },
          ],
        },
      ];
      this.treePath =
        this.treePath +
        (
          this.lipidMapsTree[0].value +
          this.lipidMapsTree[0].children[0].value +
          this.lipidMapsTree[0].children[0].children[0].value
        )
          .toLocaleLowerCase()
          .replace(/ /g, '');
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
    if (obj.class_level_name) {
      this.class_level_name = obj.class_level_name;
    }

    if (
      obj.class_level_name.includes('super') ||
      obj.class_level_name.includes('category')
    ) {
      this.level = 0;
    } else if (obj.class_level_name.includes('sub')) {
      this.level = 2;
      this.expandable = false;
    }

    if (obj.class_name) {
      this.value = obj.class_name;
    }
  }
}
