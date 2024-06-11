<script setup lang="ts">
import { computed } from 'vue'
import { DTD_BASE_KEY } from '../../constant';
import { DtdNode } from '../../model';

interface DragToDropItemProps {
  data: DtdNode
  disabled?: boolean
}

const props = defineProps<DragToDropItemProps>()
const customProps = computed(() => {
  return {
    [DTD_BASE_KEY]: props.disabled ? undefined : props.data.dragId
  }
})
</script>

<template>
  <div v-bind="customProps" :class="{
    'drag-disabled': disabled
  }">
    <slot></slot>
  </div>
</template>

<style scoped>
.drag-disabled {
  opacity: 0.5;
}
</style>
