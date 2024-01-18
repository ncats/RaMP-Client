import { SelectionModel } from '@angular/cdk/collections';
import { NestedTreeControl } from '@angular/cdk/tree';
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
  ViewChild,
  ViewEncapsulation,
} from '@angular/core';
import { MatTree, MatTreeNestedDataSource, MatTreeModule } from '@angular/material/tree';
import { BehaviorSubject } from 'rxjs';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';

/** Flat tree item node with expandable and level information */
export class FlatNode {
  value!: string;
  children!: any[];
  level!: number;
  expandable!: boolean;
}

export class NestedNode {
  value!: string;
  children!: any[];
}

@Component({
    selector: 'ncats-object-tree',
    templateUrl: './object-tree.component.html',
    styleUrls: ['./object-tree.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: true,
    imports: [
        MatTreeModule,
        MatButtonModule,
        MatIconModule,
    ],
})
export class ObjectTreeComponent implements OnInit {
  @ViewChild(MatTree) objectTree!: MatTree<any>;

  @Output() fieldSelectChange: EventEmitter<any> = new EventEmitter<any>();
  @Output() nodeExpandChange: EventEmitter<any> = new EventEmitter<any>();

  @Input() selectable = false;
  @Input() showLinks = false;
  @Input() dynamic = false;

  @Input() expanded = true;

  @Input() loading = false;

  /**
   * initialize a private variable _data, it's a BehaviorSubject
   * @type {BehaviorSubject<any>}
   * @private
   */
  protected _data = new BehaviorSubject<any>(null);

  /**
   * pushes changed data to {BehaviorSubject}
   * @param value
   */
  @Input()
  set data(value: any) {
    // This is a hacky way to strip out extra values from a DataProperty object, if this is dynamically added to a table
    if (value && value.value) {
      this._data.next(value.value);
    } else {
      this._data.next(value);
    }
  }

  /**
   * returns value of {BehaviorSubject}
   * @returns {any}
   */
  get data() {
    return this._data.getValue();
  }

  /** The selection for checklist */
  checklistSelection = new SelectionModel<FlatNode>(true);

  treeControl = new NestedTreeControl<NestedNode>((node) => node.children);
  dataSource = new MatTreeNestedDataSource<NestedNode>();

  constructor(private changeRef: ChangeDetectorRef) {}
  ngOnInit() {
    this._data.subscribe((res) => {
      if (res && res.length) {
        this.dataSource.data = res;
        this.treeControl.dataNodes = res;
        if (this.expanded) {
          this.treeControl.expandAll();
        }
        this.changeRef.markForCheck();
      }
    });
  }

  hasChild = (_: number, node: NestedNode) =>
    !!node.children && node.children.length > 0;

  /*
  /!** Whether all the descendants of the node are selected. *!/
  descendantsAllSelected(node: FlatNode): boolean {
    const descendants = this.treeControl.getDescendants(node);
    return descendants.every(child =>
      this.checklistSelection.isSelected(child)
    );
  }

  /!** Whether part of the descendants are selected *!/
  descendantsPartiallySelected(node: FlatNode): boolean {
    const descendants = this.treeControl.getDescendants(node);
    const result = descendants.some(child => this.checklistSelection.isSelected(child));
    return result && !this.descendantsAllSelected(node);
  }
*/

  /*  /!** Toggle the to-do item selection. Select/deselect all the descendants node *!/
  todoItemSelectionToggle(node: FlatNode): void {
    this.checklistSelection.toggle(node);
    const descendants = this.treeControl.getDescendants(node);
    this.checklistSelection.isSelected(node)
      ? this.checklistSelection.select(...descendants)
      : this.checklistSelection.deselect(...descendants);

// Force update for the parent
    descendants.every(child =>
      this.checklistSelection.isSelected(child)
    );
    this.checkAllParentsSelection(node);
  }

  /!** Toggle a leaf to-do item selection. Check all the parents to see if they changed *!/
  todoLeafItemSelectionToggle(node: FlatNode): void {
    this.checklistSelection.toggle(node);
    this.checkAllParentsSelection(node);
  }

  /!* Checks all the parents when a leaf node is selected/unselected *!/
  checkAllParentsSelection(node: FlatNode): void {
    let parent: FlatNode | null = this.getParentNode(node);
    while (parent) {
      this.checkRootNodeSelection(parent);
      parent = this.getParentNode(parent);
    }
  }

  /!** Check root node checked state and change it accordingly *!/
  checkRootNodeSelection(node: FlatNode): void {
    const nodeSelected = this.checklistSelection.isSelected(node);
    const descendants = this.treeControl.getDescendants(node);
    const descAllSelected = descendants.every(child =>
      this.checklistSelection.isSelected(child)
    );
    if (nodeSelected && !descAllSelected) {
      this.checklistSelection.deselect(node);
    } else if (!nodeSelected && descAllSelected) {
      this.checklistSelection.select(node);
    }
  }

  /!* Get the parent node of a node *!/
  getParentNode(node: FlatNode): FlatNode | null {
    const currentLevel = node.level;

    if (currentLevel < 1) {
      return null;
    }

    const startIndex = this.treeControl.dataNodes.indexOf(node) - 1;

    for (let i = startIndex; i >= 0; i--) {
      const currentNode = this.treeControl.dataNodes[i];

      if (currentNode.level < currentLevel) {
        return currentNode;
      }
    }
    return null;
  }*/

  fetchData(node: any) {
    if (this.dynamic && !node.children) {
      this.nodeExpandChange.emit(node);
    }
  }

  fetchLeafData(node: any) {
    if (this.dynamic && !node.children) {
      this.nodeExpandChange.emit(node);
    }
  }
}
