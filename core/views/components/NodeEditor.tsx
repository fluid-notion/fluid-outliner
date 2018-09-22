import React from "react"
import _debug from "debug";
import { observer } from "mobx-react";
import { observable, autorun, IReactionDisposer } from "mobx";

import { Loadable } from "./Loadable"
import { NodeViewModel } from "../models/NodeViewModel"
import { NodePresenter } from "./NodePresenter"
import { NodeContainer } from "./NodeContainer"

const debug = _debug("fluid-outliner:NodeEditor");

const nodeEditors: { [key: string]: any } = {
    text: Loadable(() => import("./NodeTextEditor")),
    html: Loadable(() => import("./NodeHTMLEditor")),
    markdown: Loadable(() => import("./NodeMarkdownEditor")),
}

export interface NodeEditorProps {
    node: NodeViewModel
    defaultOutput?: string
    defaultContent?: string
}

@observer
export class NodeEditor extends React.Component<NodeEditorProps> {
    @observable
    private didFetch = false

    @observable
    private content?: string

    @observable
    output: string | undefined;
    disposeContentFetchRxn: IReactionDisposer | undefined;

    async componentDidMount() {
        this.disposeContentFetchRxn = autorun(async () => {
            debug('Running content fetch reaction')
            this.props.node.node.contentHash;
            const { content, output } = await this.props.node.getContents();
            this.content = content
            this.output = output
            this.didFetch = true
        })
    }

    componentWillUnmount() {
        this.disposeContentFetchRxn!();
    }

    render() {
        const { node } = this.props;
        let inner;
        if (this.didFetch) {
            let Component
            if (node.isUnderEdit) {
                Component = nodeEditors[node.node.format]
            } else {
                Component = NodePresenter
            }
            inner = <Component node={node} defaultContent={this.content} defaultOutput={this.output} />
        }
        return (
            <NodeContainer node={node} key={node.id}>
                {inner}
            </NodeContainer>
        )
    }
}
