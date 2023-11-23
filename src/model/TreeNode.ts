import { nanoid } from "nanoid";

export interface ITreeNode {
  componentName?: string;
  sourceName?: string;
  hidden?: boolean;
  isSourceNode?: boolean;
  id?: string;
  props?: Record<string | number | symbol, any>;
  children?: ITreeNode[];
}

const TreeNodesMap = new Map<string, TreeNode>();

export class TreeNode {
  id: string;

  root: TreeNode;

  parent: TreeNode;

  depth = 0;

  componentName: string = "NO_NAME";

  sourceName: string = "";

  props: Record<string | number | symbol, any> = {};

  children: TreeNode[] = [];

  constructor(node?: ITreeNode, parent?: TreeNode) {
    if (node instanceof TreeNode) {
      return node;
    }
    this.id = node?.id || nanoid();
    if (parent) {
      this.root = parent.root;
      this.parent = parent;
      this.depth = this.parent.depth + 1;
      TreeNodesMap.set(this.id, this);
    } else {
      this.root = this;
      TreeNodesMap.set(this.id, this);
    }
    if (node) {
      this.from(node);
    }
  }

  from(node: ITreeNode) {
    if (!node) return;
    if (node.id && node.id !== this.id) {
      TreeNodesMap.delete(this.id);
      TreeNodesMap.set(node.id, this);
      this.id = node.id;
    }
    if (node.componentName) {
      this.componentName = node.componentName;
    }
    this.props = node.props ?? {};
    //   if (node.hidden) {
    //     this.hidden = node.hidden
    //   }
    if (node.children) {
      this.children =
        node.children?.map?.((node) => {
          return new TreeNode(node, this);
        }) || [];
    }
  }

  static getById(id: string) {
    return TreeNodesMap.get(id);
  }
}
