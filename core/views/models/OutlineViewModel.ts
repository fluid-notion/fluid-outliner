// import * as Comlink from "comlink"
import _debug from "debug"
import { OutlineShell } from "../../models/OutlineShell"
import { Maybe } from "../../helpers/types"
import { observable, Lambda, computed, action } from "mobx"
import { linkConsumer } from "../../helpers/unidirectional-observable-bridge/consumer"
import { OutlineVisitState, NodeState } from "../../models/OutlineVisitState"
import { NodeViewModel } from "./NodeViewModel"

const debug = _debug("fluid-outliner:OutlineViewModel")

export class OutlineViewModel {
    @observable public id: Maybe<string>

    @observable public title: Maybe<string>

    @observable public rawVisibleNodes: NodeState[] = []

    @observable public nodeUnderEdit: Maybe<string>

    @observable public activeNodeId: Maybe<string>

    @computed
    public get visibleNodes() {
        return this.rawVisibleNodes.map(
            rawNode =>
                new NodeViewModel({
                    ...rawNode,
                    outline: this,
                })
        )
    }

    @computed
    public get activeNode() {
        const nodes = this.visibleNodes
        if (!this.activeNodeId) return null
        return nodes.find(n => n.id === this.activeNodeId)
    }

    idLink: Lambda
    titleLink: Lambda
    visibleNodesLink: Lambda

    constructor(public outlineShellProxy: OutlineShell, public outlineVisitStateProxy: OutlineVisitState) {
        debug("Creating OutlineViewModel")
        this.idLink = linkConsumer(outlineShellProxy, "idLink", this, "id")
        this.titleLink = linkConsumer(outlineShellProxy, "titleLink", this, "title")
        this.visibleNodesLink = linkConsumer(outlineVisitStateProxy, "visibleNodesLink", this, "rawVisibleNodes")
    }

    @action
    setActive(id: string) {
        this.activeNodeId = id
    }
}
