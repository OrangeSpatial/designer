<template>
    <div :class="genCls('designer-main')">
        <dtd-pod :assetsMap class="dtd-root" @selected="onSelected">
            <DesignerExplorer>
                <left-side :assets />
                <drag-bar position="end" direction="vertical" :range="[240, 500]"></drag-bar>
            </DesignerExplorer>
            <DesignerWorkspace>
                <DragToDrop ref="dtdRenderRef" class="dtd-render-container" nodeClass="dtd-render-node-class"
                    @change="renderDataChamnge" :data="data">
                    <Render v-if="jsonSchema" :schema="jsonSchema" />
                    <empty v-else></empty>
                </DragToDrop>
            </DesignerWorkspace>
            <DesignerExplorer>
                <drag-bar position="start" direction="vertical" :range="[240, 500]"></drag-bar>
                <right-side></right-side>
            </DesignerExplorer>
            <template #ghost="{ items }">
                <div class="ghost-class">{{ items?.[0].componentName }}</div>
            </template>
        </dtd-pod>
    </div>
</template>

<script setup lang="ts">
import { genCls } from "../../utils/className";
import { inject, provide, ref, watch } from "vue";
import Render from "../render/Index.vue";
import DtdPod from "../dragger/DtdPod.vue";
import { DtdNode } from "../../model";
import DragToDrop from "../dragger/DragToDrop.vue";
import DesignerExplorer from "./explorer/Index.vue";
import DesignerWorkspace from "./workspace/Index.vue";
import LeftSide from "./explorer/LeftSide.vue";
import RightSide from "./explorer/RightSide.vue";
import DragBar from "../dragger/DragBar.vue";
import { DNode, dtdNodeToDnode } from "../render/render";
import Empty from "./workspace/Empty.vue";
import { IAssetsNode } from "../../types/dtd";
import { AssetsKeyByIdSymbol, SelectedNodesSymbol } from "../../constant";
const jsonSchema = ref<DNode>();

const props = defineProps<{
    assets: any[]
}>()

const dtdRenderRef = ref<{
    getData: () => any[]
    updateAuxStyle: () => void
}>();
const assetsMap = inject<Record<string, IAssetsNode>>(AssetsKeyByIdSymbol, {})
const data = ref<DtdNode>()

const selectedNodes = ref<DtdNode[]>([])
provide(SelectedNodesSymbol, selectedNodes)

function onSelected(nodes: DtdNode[]) {
    selectedNodes.value = nodes
}
function renderDataChamnge(val: DtdNode) {
    jsonSchema.value = dtdNodeToDnode(val)
    data.value = val
}

watch(() => data.value, (val: DtdNode | undefined) => {
    if (val) {
        renderDataChamnge(val)
        dtdRenderRef.value?.updateAuxStyle()
    }
}, { deep: true })
</script>

<style lang="scss">
@use "../../styles/variables" as *;

.#{$prefix} {
    &-designer-main {
        height: calc(100% - var(--os-header-height));

        .dtd-root {
            display: flex;
            justify-content: space-between;

            .dtd-copy-nodes {
                display: flex;
                flex-direction: column;
                gap: 10px;
            }

            .dtd-render-node-class {
                padding: 10px;
                // border: 1px solid var(--os-operation-border-color);
            }

            .dtd-render-container {
                background-color: #fff;
            }
        }

        .node-class {
            background-color: white;
        }

        .ghost-class {
            background-color: var(--os-primary-color);
            color: white;
            padding: 4px;
            height: 20px;
            min-width: 60px;
            line-height: 20px;
            text-align: center;
            border-radius: 20px;
        }
    }
}
</style>