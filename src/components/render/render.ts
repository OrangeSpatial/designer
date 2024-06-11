import { DtdNode } from "../../model";

type DNodeType = string | DNode | DNode[] | Record<string, DNode[]> | undefined;


const placeholderStyle = (node: DtdNode) => {
    return {
        width: '100%',
        height: '100%',
        minHeight: node.droppable ? '60px' : '20px',
        minWidth: '40px',
        backgroundColor: 'rgba(0, 0, 0, 0.1)',
        boxSizing: 'border-box',
        border: '1px dashed rgba(0, 0, 0, 0.5)',
    }
};

const rootNodeStyle = {
    width: '100%',
    height: '100%',
};

const placeholderContent = 'Drop here';

function getStyle(node: DtdNode) {
    if (!node.parent) {
        return rootNodeStyle;
    }
    if (node.placeholder) {
        return placeholderStyle(node);
    }
    return node.props?.style;
}

export interface DNode {
    id?: string;
    componentId: string;
    componentName: string;
    props: Record<string, any> | undefined;
    children: DNodeType;
}

export function dtdNodeToDnode(node: DtdNode): DNode {
    return {
        id: node.dragId,
        componentId: node.componentId,
        componentName: node.componentName,
        props: {
            ...node.props,
            style: getStyle(node),
            content: node.placeholder ? placeholderContent : undefined,
        },
        children: node.children.map(dtdNodeToDnode),
    };
}
