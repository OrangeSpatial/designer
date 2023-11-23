<template>
    <div class="render-container">
    </div>
</template>

<script name="NodeComponent" setup lang="ts">
import { PropType } from 'vue';
import { TreeNode } from '../model/TreeNode';

const props = withDefaults(defineProps<{
    node: PropType<TreeNode>
}>(), {
    node: () => new TreeNode()
});

console.log(props.node);
</script>

<style lang="scss" scoped>
.render-container {
    height: 100%;
    width: 100%;
}
</style>