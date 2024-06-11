<template>
    <div :class="genCls('designer-tool')">
        designer
    </div>
</template>

<script setup lang="ts">
import { genCls } from "../../../utils";

</script>

<style lang="scss">
@use "../../../styles/variables" as *;

.#{$prefix} {
    &-designer-tool {
        height: 100%;
        background-color: var(--os-primary-bg-color);
        width: var(--os-toolbar-width);
    }
}
</style>