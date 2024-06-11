import { DragNodeType, DtdNode } from "../model"

export interface IInsertOptions {
    targetNode: DtdNode
    sourceNodes: DtdNode[]
    insertBefore: boolean
    dragType: DragNodeType
    isContainer: boolean
}

export interface IArgument {
    name: string
    type: string
    description: string
}

export interface ISchema {
    componentId?: string
    componentName: string
    props: Record<string, any>
    children?: ISchema[]
}

export interface ISetter {
    name: string
    props: Record<string, any>
}

export interface IComponentPropsSchema {
    name: string
    type: string
    title: string
    description: string
    defaultValue: any
    setter: string | ISetter
}

export interface IComponentEventSchema {
    name: string
    title: string
    description: string
    arguments: IArgument[]
}

export interface IComponentSlotSchema {
    name: string
    title: string
    description: string
}

export interface IConfigure {
    props: IComponentPropsSchema[]
    events: IComponentEventSchema[]
    slots: IComponentSlotSchema[]
}

export interface IAssetsNode {
    id: string
    componentName: string
    category: string
    title: string
    schema: ISchema
    configure: IConfigure
}