<template>
    <a-form v-if="formValues" :model="formValues" layout="vertical">
        <a-form-item :label="field.title" v-for="field in schema" :key="field.name">
            <template v-if="field.setter === 'SwitchSetter'">
                <component :is="getComponent(field.setter as string)" v-model:checked="formValues[field.name]">
                </component>
            </template>
            <template v-else>
                <component :is="getComponent(field.setter as string)" v-model:value="formValues[field.name]">
                </component>
            </template>
        </a-form-item>
    </a-form>
</template>

<script setup lang="ts">
import { Input, Select, Switch } from "ant-design-vue";
import { ref, watch } from "vue";
import { IComponentPropsSchema } from "../../types/dtd";
import { Form as AForm, FormItem as AFormItem } from "ant-design-vue";

const props = defineProps<{
    schema: IComponentPropsSchema[],
    modelValue: Record<string, any>
}>()

const emits = defineEmits<{
    (e: 'update:modelValue', val: IComponentPropsSchema): void
}>()

const components = {
    InputSetter: Input,
    SwitchSetter: Switch,
    SelectSetter: Select,
} as any

const formValues = ref(props.modelValue)

watch(() => props.modelValue, (val) => {
    formValues.value = val
})

watch(() => formValues.value, (val: any) => {
    emits('update:modelValue', val)
}, { deep: true })

const getComponent = (setter: string) => components[setter]

</script>