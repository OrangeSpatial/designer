<script setup lang="ts">
import {
  computed,
  inject,
  nextTick,
  onBeforeUnmount,
  onMounted,
  ref,
  watchEffect
} from 'vue'
import DtdRecursion from './DtdRecursion.vue'
import DtdItem from './DtdItem.vue'
import DtdAuxTool from './DtdAuxTool.vue'
import { DragNodeType, DtdNode, ISelectNode, KEYBOARD_EVENTS, Mouse, MouseEventType, getNode } from '../../model';
import { DTD_MOUSE, cursorAtContainerEdgeType } from '../../constant';

defineOptions({
  name: 'DragToDrop'
})

const props = withDefaults(
  defineProps<{
    data: any
    nodeClass?: string
    dragType?: DragNodeType
    dtdClass?: string
  }>(),
  {
    dragType: DragNodeType.MOVE
  }
)

const rootRef = ref<HTMLElement>()

const auxToolRef = ref<{ updateStyle: () => void }>()

const emits = defineEmits(['change'])

const dtdData = ref(new DtdNode({ children: [] }))

const isRenderData = computed(() => !Array.isArray(props.data))

const mouse = inject<Mouse>(DTD_MOUSE)

function updateViewData(callback?: () => void) {
  nextTick(() => {
    // dtdData.value = dtdData.value.clone()
    emits('change', dtdData.value)
    callback?.()
  })
}

function deleteSelectedNodes() {
  mouse?.deleteSelectedNodes()
  updateViewData()
}

const dragEndHandle = (e: MouseEvent, targetNode?: DtdNode) => {
  if (!mouse?.dataTransfer.length) return
  if (
    targetNode &&
    mouse?.dataTransfer.find((node: DtdNode) =>
      node.isParentOf(targetNode)
    )
  )
    return
  updateViewData(() => {
    mouse?.setSelectedNodes(
      mouse?.dataTransfer.map(
        (node: DtdNode) =>
          ({ node: getNode(node.dragId), e }) as ISelectNode
      ),
      e,
      targetNode
    )
  })
}

const scrollPosition = ref({ scrollTop: 0, scrollLeft: 0 })

function podScrollHandler(e: Event) {
  const target = e.target as HTMLElement
  if (rootRef.value !== target) return
  scrollPosition.value = {
    scrollTop: target.scrollTop,
    scrollLeft: target.scrollLeft
  }
}

function getData() {
  return DtdNode.toList(dtdData.value)
}

function draggingHandler(e: MouseEvent) {
  const edgeType = cursorAtContainerEdgeType(rootRef.value!, e)
  if (edgeType === 'top') {
    rootRef.value!.scrollTop -= 10
  } else if (edgeType === 'bottom') {
    rootRef.value!.scrollTop += 10
  } else if (edgeType === 'left') {
    rootRef.value!.scrollLeft -= 10
  } else if (edgeType === 'right') {
    rootRef.value!.scrollLeft += 10
  }
}

onMounted(() => {
  if (rootRef.value) {
    rootRef.value.addEventListener('scroll', podScrollHandler)
    // 禁用右键菜单
    rootRef.value.oncontextmenu = () => false
  }
  mouse?.on(MouseEventType.DragEnd, dragEndHandle)
  // 拖拽中，如果拖拽至顶部或底部，左右边缘，自动滚动
  mouse?.on(MouseEventType.Dragging, draggingHandler)
  mouse?.keyboard?.on(
    KEYBOARD_EVENTS.delete,
    deleteSelectedNodes
  )
})
onBeforeUnmount(() => {
  if (rootRef.value) {
    rootRef.value.removeEventListener(
      'scroll',
      podScrollHandler
    )
  }
  mouse?.off(MouseEventType.DragEnd, dragEndHandle)
  mouse?.off(MouseEventType.Dragging, draggingHandler)
  mouse?.keyboard?.off(
    KEYBOARD_EVENTS.delete,
    deleteSelectedNodes
  )
  DtdNode.clearCacheAll()
})

watchEffect(() => {
  const root = isRenderData.value ? new DtdNode(props.data || { children: [] }) :
    DtdNode.fromList(props.data)
  root.dragType = props.dragType
  dtdData.value = root
  // emits('change', dtdData.value)
})

defineExpose({
  getData,
  updateAuxStyle: () => auxToolRef.value?.updateStyle()
})
</script>

<template>
  <div ref="rootRef" class="dtd-render-root">
    <template v-if="isRenderData">
      <dtd-item :data="dtdData" class="full" :class="props.dtdClass || ''">
        <slot />
        <dtd-aux-tool v-if="dtdData.dragType === DragNodeType.MOVE" ref="auxToolRef" :scrollPosition />
      </dtd-item>
    </template>
    <template v-else>
      <dtd-item :data="dtdData" class="full" :class="props.dtdClass || ''">
        <DtdRecursion :nodeClass :node="dtdData">
          <template #default="{ item }">
            <slot :item="item" />
          </template>
        </DtdRecursion>
      </dtd-item>
    </template>
  </div>
</template>

<style scoped>
.dtd-render-root {
  position: relative;
  height: 100%;
  width: 100%;
  overflow: auto;
}

.full {
  height: 100%;
  width: 100%;
}
</style>
