import React from "react"

import { NodeViewModel } from "../models/NodeViewModel"
import { observer } from "../../../node_modules/mobx-react"

export interface NodePresenterProps {
    node: NodeViewModel
    children: any
}

@observer
export class NodePresenter extends React.Component<NodePresenterProps> {
    render() {
        const { node } = this.props
        if (node.output) {
            return <div dangerouslySetInnerHTML={{ __html: node.output }} />
        }
        return node.content
    }
}
