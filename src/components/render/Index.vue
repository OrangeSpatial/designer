<script lang="ts">
import { VNode, defineComponent, h } from "vue";
import { antvComponents } from "../../plugins/antv";
import { DTD_BASE_KEY } from "../../constant";
import { DNode } from "./render";

function renderNode(schema: DNode) {
    if (!schema) return h('div')
    return h(
        antvComponents[schema.componentName] || schema.componentName,
        {
            ...schema.props,
            [DTD_BASE_KEY]: schema.id // DragToDrop base key
        },
        schema.children ? renderNodes(schema.children) : undefined
    )
}

function renderNodes(children: any) {
    // group children by slotName
    const slotGroups = children.reduce((acc: any, child: any) => {
        const slotName = child.slotName || 'default'
        if (!acc[slotName]) {
            acc[slotName] = []
        }
        acc[slotName].push(child)
        return acc
    }, { default: [] })
    if (slotGroups.default.length === children.length) {
        return () => children.map((node: any) => renderNode(node))
    }
    const slots: Record<string, () => VNode> = {}
    for (const slotName in slotGroups) {
        slots[slotName] = () => slotGroups[slotName].map((node: any) => renderNode(node))
    }
    return slots
}

export default defineComponent({
    name: 'NodeRender',
    props: {
        schema: {
            type: Object as () => DNode,
            required: true
        }
    },
    setup(props: { schema: DNode }) {
        return () => {
            console.log('NodeRender', props.schema)
            return renderNode(props.schema)
        }
    }
})
</script>