import React from "react"
import { Loadable } from "./Loadable"
import { NodeViewModel } from "../models/NodeViewModel"
import { NodePresenter } from "./NodePresenter"
import { NodeContainer } from "./NodeContainer"

const nodeEditors: { [key: string]: any } = {
    text: Loadable(() => import("./NodeTextEditor")),
    html: Loadable(() => import("./NodeHTMLEditor")),
    markdown: Loadable(() => import("./NodeMarkdownEditor")),
}

export interface NodeEditorProps {
    node: NodeViewModel
}

export const NodeEditor = ({ node }: NodeEditorProps) => {
    const Component = node.isUnderEdit ? nodeEditors[node.node.format] : NodePresenter
    return (
        <NodeContainer node={node} key={node.id}>
            <Component node={node} />
        </NodeContainer>
    )
}
