import { DTD_BASE_KEY, uid } from '../constant'
import { DragNodeType } from './Mouse'

interface IDtdNode {
  dragId?: string
  slotName?: string
  id?: string // componentId
  componentId?: string
  componentName?: string
  droppable?: boolean
  placeholder?: boolean
  dropWhiteList?: string[] // drop component id white list
  props?: Record<string, any>
  children?: IDtdNode[]
}

const TreeNodes = new Map<string, DtdNode>()

export const DefaultComponentName = 'div'

export class DtdNode {
  root!: DtdNode
  parent!: DtdNode
  depth = 0
  dragId!: string
  componentId!: string
  componentName: string = DefaultComponentName
  slotName?: string
  dropWhiteList?: string[]
  dragType: DragNodeType = DragNodeType.MOVE
  placeholder = false
  droppable = false
  props: IDtdNode['props'] = {}
  children: DtdNode[] = []

  constructor(node: IDtdNode, parent?: DtdNode) {
    if (node instanceof DtdNode) {
      return node
    }
    this.dragId = node.dragId || uid()
    if (parent) {
      this.depth = parent.depth + 1
      this.parent = parent
      this.root = parent.root
    } else {
      this.droppable = true
      this.root = this
    }

    if (node) {
      this.props = node.props || {}
      this.slotName = node.slotName
      this.componentId = node.id || node.componentId || `node_${uid()}`
      this.componentName = node.componentName || DefaultComponentName
      this.dropWhiteList = node.dropWhiteList
      if (node.placeholder) this.placeholder = node.placeholder
      if (node.droppable) this.droppable = node.droppable || this.placeholder
      
      if (this.parent && this.droppable && !this.placeholder && this.children?.length < 1) {
        this.children.push(new DtdNode({
          dragId: this.dragId,
          componentName: DefaultComponentName,
          droppable: true,
          placeholder: true
        }, this))
      } else {
        this.children = (node.children || []).map(
          child => new DtdNode(child, this)
        )
      }
    }
    TreeNodes.set(this.dragId, this)
  }

  setProps(props: Record<string, any>) {
    this.props = props
  }

  clone() {
    return new DtdNode(DtdNode.getIDtdNode(this), this.parent)
  }

  static fromList(list: IDtdNode[]) {
    return new DtdNode({ children: list })
  }

  static toList(node: DtdNode): any[] {
    return node.children.map(child => {
      const children = child.children?.length
        ? DtdNode.toList(child)
        : undefined
      return {
        ...child.props,
        children
      }
    })
  }

  static getIDtdNode(node: DtdNode): IDtdNode {
    return {
      id: node.componentId,
      dragId: node.dragId,
      props: node.props,
      droppable: node.droppable,
      placeholder: node.placeholder,
      dropWhiteList: node.dropWhiteList,
      componentName: node.componentName,
      slotName: node.droppable ? 'default' : undefined,
      children: node.children?.length ?
        node.children.map(child => DtdNode.getIDtdNode(child)) :
        undefined
    }
  }

  static deleteCache(root: DtdNode) {
    TreeNodes.delete(root.dragId)
    root.children.forEach(child => DtdNode.deleteCache(child))
  }

  static clearCacheAll() {
    TreeNodes.clear()
  }

  // 判断节点是否是自己或者父节点
  isParentOf(node: DtdNode): boolean {
    return node == this || (node.parent && this.isParentOf(node.parent))
  }
}

function deleteNodeFromParentByDragId(parent: DtdNode, dragId: string) {
  parent.children = parent.children.filter(child => child.dragId !== dragId)
}

export function deleteNode(node: DtdNode | DtdNode[], deleteCache = false) {
  if (!node) return
  if (Array.isArray(node)) {
    node.forEach(n => deleteNode(n))
    return
  }
  const parent = node.parent || node
  deleteNodeFromParentByDragId(parent, node.dragId)
  if (deleteCache) {
    TreeNodes.delete(node.dragId)
  }
}

export function getNode(dragId: string) {
  if (!TreeNodes.has(dragId)) return undefined
  return TreeNodes.get(dragId)
}

export function getClosetDroppableNode(dragId: string) {
  let node = getNode(dragId)
  while (node && !node.droppable) {
    node = node.parent
  }
  return node
}

export function clearTreeNodes() {
  TreeNodes.clear()
}
