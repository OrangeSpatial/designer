<template>
    <div :class="genCls('designer-right-side')">
        <os-tabs :options="tabOptions" v-model="activeTabName" />
        <div class="config-header">{{ currentNode?.componentName }}</div>
        <div class="config-form">
            <form-render v-if="configure.props" :schema="configure.props" @update:model-value="formChange"
                v-model="formValues"></form-render>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, inject, computed, Ref, watch } from "vue";
import { genCls } from "../../../utils/className";
import OsTabs from "./Tabs.vue";
import { AssetsKeyByIdSymbol, SelectedNodesSymbol } from "../../../constant";
import { DtdNode, ISelectNode } from "../../../model";
import { IAssetsNode } from "../../../types/dtd";
import FormRender from "../../render/FormRender.vue";

const selectedNodes = inject<Ref<ISelectNode[]>>(SelectedNodesSymbol, ref([]))
const tabOptions = ref(['属性', '样式', '事件'])
const activeTabName = ref('属性')

const assetsById = inject<Record<string, IAssetsNode>>(AssetsKeyByIdSymbol, {})
const currentNode = ref<DtdNode>(selectedNodes.value[0]?.node)
const configure = computed(() => assetsById[currentNode.value?.componentId]?.configure || {})

const formValues = ref<any>({})

watch(() => selectedNodes.value, () => {
    currentNode.value = selectedNodes.value[0]?.node as DtdNode
    formValues.value = configure.value.props?.reduce((acc, cur) => {
        acc[cur.name] = currentNode.value.props?.[cur.name] || cur.defaultValue
        return acc
    }, {} as any) || {}
})

function formChange(val: any) {
    currentNode.value.setProps(val)
}

</script>

<style lang="scss">
@use "../../../styles/variables" as *;

.#{$prefix} {
    &-designer-right-side {
        height: 100%;

        .config-header {
            padding: 8px;
            background-color: white;
            border-bottom: 1px solid #f0f0f0;
        }

        .config-form {
            padding: 8px;
            background-color: white;
            height: calc(100% - 100px);
            overflow: auto;
        }
    }
}
</style>