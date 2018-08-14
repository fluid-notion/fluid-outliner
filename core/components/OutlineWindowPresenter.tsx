import React from "react"
import assert from "assert"
import { inject, observer } from "mobx-react"
import * as Comlink from "comlink"
import { observable } from "mobx"
import Scrollbars from "react-custom-scrollbars"
import { autobind } from "core-decorators"

import { INodeInfo, OutlineWindow } from "../utils/OutlineWindow"
import { Repository } from "../utils/repository"
import { OutlineNodePresenter } from "./OutlineNodePresenter"
import { IMaybe } from "../utils/UtilTypes"

interface IOutlineWindowPresenterProps {
    repository?: Repository
}

@inject("repository")
@observer
export class OutlineWindowPresenter extends React.Component<IOutlineWindowPresenterProps> {
    private scrollerRef = React.createRef<Scrollbars>()

    @observable private visibleNodes: INodeInfo[] = []

    @observable.ref private outlineWindow: IMaybe<OutlineWindow> = null

    public componentDidMount() {
        const repo = this.props.repository!
        assert(repo)
        repo.onLoad(Comlink.proxyValue(async () => {
            this.outlineWindow = await repo.getOutlineWindow();
            assert(this.outlineWindow)
            this.bindToOutlineWindow(this.outlineWindow!)
        }))
    }

    public render() {
        if (!this.outlineWindow) {
            return <div />
        }
        return (
            <Scrollbars ref={this.scrollerRef} onScrollFrame={this.syncScrollState}>
                {this.visibleNodes.map(nodeInfo => (
                    <OutlineNodePresenter key={nodeInfo.node.id} nodeInfo={nodeInfo} />
                ))}
            </Scrollbars>
        )
    }

    private async bindToOutlineWindow(outlineWindow: OutlineWindow) {
        this.syncScrollState()
        this.visibleNodes = await outlineWindow.getVisibleNodes()
        outlineWindow.onChange(Comlink.proxyValue(this.onWindowChange))
    }

    @autobind
    private syncScrollState() {
        const scroller = this.scrollerRef.current
        if (!scroller) return
        if (!this.outlineWindow) return
        this.outlineWindow.syncScrollState(scroller.getValues())
    }

    @autobind
    private onWindowChange(nodes: INodeInfo[]) {
        this.visibleNodes = nodes
    }
}
