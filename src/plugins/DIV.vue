<template>
    <div>
        <slot v-if="slots.default" />
        <template v-else>
            {{ content }}
        </template>
    </div>
</template>

<script setup lang="ts">
import { useSlots } from 'vue';

const slots = useSlots();
defineProps<{
    content?: string
}>()
</script>