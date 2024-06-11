<template>
    <div :class="genCls('designer-root')">
        <DesignerHeader />
        <DesignerMain :assets="assetList" />
    </div>
</template>

<script setup lang="ts">
import { provide, ref } from 'vue';
import { genCls } from './utils/className';
import assets from './data/assets.json';
import { AssetsKeyByIdSymbol } from './constant/injectSymbol';
import DesignerHeader from './components/header/DesignerHeader.vue';
import DesignerMain from './components/main/DesignerMain.vue';
import { IAssetsNode } from './types/dtd';


const assetsKeyById = assets.reduce((acc, asset) => {
    acc[asset.id] = asset as IAssetsNode;
    return acc;
}, {} as Record<string, IAssetsNode>); // TODO any

provide<Record<string, IAssetsNode>>(AssetsKeyByIdSymbol, assetsKeyById);

const assetList = ref(assets);

</script>

<style lang="scss">
@use "./styles/variables" as *;

.#{$prefix} {
    &-designer-root {
        display: flex;
        flex-direction: column;
        height: 100%;
    }
}
</style>