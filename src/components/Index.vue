<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref } from 'vue'
import { TreeNode } from '../model/TreeNode';
import { Cursor, CursorStatus, ICursorPosition } from '../model/Cursor';
import NodeComponent from './NodeComponent.vue';

const dragEventElment = document.body
const cursor = ref(new Cursor())

const ghostRef = ref<HTMLElement>()
const ghostVisible = ref(false)

const rootNode = ref(new TreeNode({
  componentName: "ROOT"
}))

const components = ref([
  new TreeNode({
    componentName: 'DIV'
  }),
  new TreeNode({
    componentName: 'Span'
  })
])

const containerRef = ref<HTMLElement>()

function dragStart(e: MouseEvent) {
  const position: ICursorPosition = {
    pageX: e.pageX,
    pageY: e.pageY,
    clientX: e.clientX,
    clientY: e.clientY
  }
  // 记录开始位置，进入开始拖拽状态
  cursor.value.setDragStartPosition(position)
  cursor.value.setDragStartAt(Date.now())
}

const currentDragEl = ref<TreeNode>()

function updateGhostPosition(position: ICursorPosition) {
  if(ghostRef.value) {
    const offsetTop = ghostRef.value.offsetTop
    const offsetLeft = ghostRef.value.offsetLeft
    ghostRef.value.style.transform =
    `translate3d(${(position.clientX! - offsetLeft)}px, ${position.clientY! -offsetTop}px, 0)`
  }
}

function dragMove(e: MouseEvent) {
  // console.log('move', e);
  const position: ICursorPosition = {
    pageX: e.pageX,
    pageY: e.pageY,
    clientX: e.clientX,
    clientY: e.clientY
  }
  const distance = Math.sqrt(
      Math.pow(e.pageX - cursor.value.dragStartPosition.pageX!, 2) +
        Math.pow(e.pageY - cursor.value.dragStartPosition.pageY!, 2)
    )
  const timeDelta = Date.now() - cursor.value.dragStartAt
  if (timeDelta > 10 && cursor.value.status === CursorStatus.Normal && distance > 4) {
    cursor.value.setStatus(CursorStatus.DragStart)
    const nodeId = (e.target as HTMLElement)?.getAttribute("data-designer-id")
    if(nodeId) {
      currentDragEl.value = TreeNode.getById(nodeId)
    } else {
      return
    }
  } else if([CursorStatus.DragStart, CursorStatus.Dragging].includes(cursor.value.status)) {
    cursor.value.setStatus(CursorStatus.Dragging)
    // 移动
    updateGhostPosition(position)
    ghostVisible.value = true
  }
}

function dragEnd(e: MouseEvent) {
  console.log('end', e.target);
  cursor.value.setDragStartAt(Infinity)
  if(cursor.value.status === CursorStatus.Dragging) {
    cursor.value.setStatus(CursorStatus.DragStop)
    if(ghostRef.value) {
      ghostRef.value.style.transform =
      `translate3d(0, 0, 0)`
    }
    ghostVisible.value = false
  }
  cursor.value.setStatus(CursorStatus.Normal)
}

function addDragEvent(el: HTMLElement) {
  el.addEventListener('mousedown', dragStart)
  el.addEventListener('mousemove', dragMove)
  el.addEventListener('mouseup', dragEnd)
}

function removeDragEvent(el: HTMLElement) {
  el.removeEventListener('mousedown', dragStart)
  el.removeEventListener('mousemove', dragMove)
  el.removeEventListener('mouseup', dragEnd)
}

onMounted(() => {
  addDragEvent(dragEventElment)
})

onBeforeUnmount(() => {
  removeDragEvent(dragEventElment)
})

</script>

<template>
  <div ref="containerRef" class="container">
    <div class="drag">
      <div 
      class="component"
      v-for="item in components"
      :data-designer-id="item.id"
      :key="item.id">
          {{ item.componentName }}
      </div>
    </div>
    <div class="dragDrop">
      <NodeComponent :node="rootNode"></NodeComponent>
    </div>
  </div>
  <div ref="ghostRef" v-show="ghostVisible" class="ghost">
  {{ currentDragEl?.componentName }}</div>
</template>

<style scoped>
.container {
  height: 700px;
  display: flex;
  gap: 20px;
}

.drag {
  background-color: rgb(215, 213, 202);
  flex: 1;
  padding: 10px;
  display: grid;
  gap: 10px;
  grid-template-columns: repeat(auto-fill, 60px);
  grid-auto-rows: 60px;
}

.component{
  padding: 10px;
  border-radius: 4px;
  background-color: white;
  width: 40px;
  height: 40px;
  line-height: 40px;
  text-align: center;
  cursor: move;
  user-select: none;
}

.dragDrop {
  flex: 2;
  background-color: rgb(168, 213, 253);
}

.ghost {
  color: white;
  line-height: 24px;
  height: 24px;
  text-align: center;
  width: fit-content;
  min-width: 60px;
  font-size: 14px;
  border-radius: 16px;
  background-color: rgb(6, 126, 231);
  pointer-events: none;
  position: fixed;
  z-index: 9999;
  left: 0px;
  top: 0px;
  transform: translate3d(0, 0, 0);
}
</style>
