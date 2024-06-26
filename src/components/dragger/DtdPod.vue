<script setup lang="ts">
import { useCursor } from '../../hooks/useCursor'
import DtdGhost from './DtdGhost.vue'
import { onBeforeUnmount, ref, onMounted } from 'vue'
import { useKeyboard } from '../../hooks/useKeyboard'
import { DragNodeType, DtdNode, ISelectNode, MouseEventType } from '../../model';
import { NodeLayout, cursorAtContainerEdge, getCursorPositionInDtdNode, getLayoutNodeInContainer } from '../../constant';
import { IAssetsNode, IInsertOptions } from '../../types/dtd';

defineOptions({
  name: 'DtdPod'
})

const props = defineProps<{
  assetsMap: Record<string, IAssetsNode>
}>()

const emits = defineEmits<{
  (e: 'selected', data: any): void;
  (e: 'inserted', data: IInsertOptions): void;
}>()

const podRef = ref<HTMLElement>()
const { keyboard } = useKeyboard()
const { mouse } = useCursor(keyboard)

function dragEndHandler(e: MouseEvent, targetNode?: DtdNode) {
  const sourceNode = mouse.dataTransfer
  const positionObj = getCursorPositionInDtdNode(e)
  carryNode.value = []
  if (
    !targetNode ||
    !sourceNode.length ||
    !positionObj ||
    !mouse.dragElement
  )
    return
  const parentNode = sourceNode.find(node =>
    node.isParentOf(targetNode)
  )
  if (parentNode) return
  // COPY组 拖拽不允许插入到容器内
  if (targetNode.root.dragType === DragNodeType.COPY) return
  const dragType = sourceNode[0].root.dragType
  const isContainerEdge = cursorAtContainerEdge(
    positionObj.rect,
    e
  )
  const isVertical =
    getLayoutNodeInContainer(positionObj.targetEl) ===
    NodeLayout.VERTICAL
  const insertBefore = isVertical
    ? positionObj.insertBefore
    : positionObj.isLeft
  const insertNodes = mouse.insertNode(
    targetNode,
    sourceNode,
    insertBefore,
    dragType,
    targetNode?.droppable && !isContainerEdge,
    props.assetsMap
  )
  emits('inserted', {
    targetNode,
    sourceNodes: insertNodes as DtdNode[],
    insertBefore,
    dragType,
    isContainer: targetNode?.droppable && !isContainerEdge
  })
}

const carryNode = ref<DtdNode[]>([])

function ghostMounted(el: HTMLElement) {
  mouse.setGhostElement(el)
}

function selectHandler(selectedNodes: ISelectNode[]) {
  emits('selected', selectedNodes)
}

function dragStartHandler() {
  carryNode.value = mouse.dataTransfer
}

onMounted(() => {
  if (podRef.value) {
    mouse.setPodElement(podRef.value)
  }
  mouse.on(MouseEventType.SelectChange, selectHandler)
  mouse.on(MouseEventType.DragStart, dragStartHandler)
  mouse.on(MouseEventType.DragEnd, dragEndHandler)
})

onBeforeUnmount(() => {
  mouse.off(MouseEventType.SelectChange, selectHandler)
  mouse.off(MouseEventType.DragStart, dragStartHandler)
  mouse.off(MouseEventType.DragEnd, dragEndHandler)
})
</script>

<template>
  <div ref="podRef" class="dtd-pod">
    <slot></slot>
    <dtd-ghost @mounted="ghostMounted">
      <slot name="ghost" v-if="carryNode.length" :items="carryNode" />
    </dtd-ghost>
  </div>
</template>

<style scoped>
.dtd-pod {
  position: relative;
  height: 100%;
  width: 100%;
}
</style>
