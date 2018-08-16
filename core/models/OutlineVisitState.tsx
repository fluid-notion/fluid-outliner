import _debug from "debug"
import assert from "assert"
import { observable, computed } from "mobx"

import { Maybe } from "../helpers/types"
import { OutlineShell, Node, NodeParent } from "./OutlineShell"
import { linkProducer } from "../helpers/unidirectional-observable-bridge/producer"

const debug = _debug("fluid-outliner:OutlineVisitState")

export const DEFAULT_EMPIRICAL_NODE_HEIGHT = 40

export interface Bounds {
    height: number
    width: number
}

export interface NodeState {
    node: Node
    level: number
    isCollapsed: boolean
    numChildren: number
    canShiftForward: boolean
    canShiftBackward: boolean
}

interface VisibleNodeAccumulator {
    heightLeft: number
    nodes: NodeState[]
}

export class OutlineVisitState {
    constructor(public outlineShell: OutlineShell) {
        debug("Creating OutlineVisitState")
    }

    @observable private containerBounds: Maybe<Bounds>

    // @ts-ignore
    @observable private scrollTop: Maybe<number>

    @observable private nodeHeightMap: Map<string, number> = new Map()

    @observable private collapsedMap: Map<string, boolean> = new Map()

    @observable private startCursor: Maybe<string>

    isCollapsed(id: string) {
        if (this.collapsedMap.has(id)) {
            return this.collapsedMap.get(id)!
        }
        return false
    }

    setScrollTop(scrollTop: number) {
        this.scrollTop = scrollTop
    }

    setContainerBounds(bounds: Bounds) {
        this.containerBounds = bounds
    }

    toggleCollapsed(id: string) {
        this.collapsedMap.set(id, !this.isCollapsed(id))
    }

    setCollapsed(id: string, isCollapsed: boolean) {
        this.collapsedMap.set(id, isCollapsed)
    }

    setNodeHeight(id: string, height: number) {
        this.nodeHeightMap.set(id, height)
    }

    getNodeHeight(id: string): number {
        if (this.nodeHeightMap.has(id)) {
            return this.nodeHeightMap.get(id)!
        }
        return DEFAULT_EMPIRICAL_NODE_HEIGHT
    }

    @computed
    get visibleNodes() {
        // @ts-ignore
        const { containerBounds, startCursor, nodeHeightMap, collapsedMap } = this
        const { outline } = this.outlineShell
        if (!containerBounds || containerBounds.height === 0) return []
        const accumulator: VisibleNodeAccumulator = { heightLeft: containerBounds.height, nodes: [] }
        const effectiveStartCursor = startCursor || outline.children[0]
        this.accumulateVisible(effectiveStartCursor, accumulator)
        debug("Visible nodes:", accumulator.nodes)
        return accumulator.nodes
    }

    public visibleNodesLink = linkProducer(this, "visibleNodes")

    accumulateVisible(startId: string, accumulator: VisibleNodeAccumulator, currentLevel = 0) {
        this.accumulateVisibleSubtree(startId, accumulator, currentLevel)
        if (accumulator.heightLeft <= 0) return
        this.accumulateSubsequentSiblingSubtrees(startId, accumulator, currentLevel)
    }

    private accumulateSubsequentSiblingSubtrees(
        startId: string,
        accumulator: VisibleNodeAccumulator,
        currentLevel: number
    ) {
        const node = this.allNodes[startId]
        let parent: NodeParent
        if (node.parentId) parent = this.allNodes[node.parentId]
        else parent = this.outlineShell.outline
        assert(parent, `Parent not found: ${node.parentId} for node: ${node.id}`)
        const childIdx = parent.children.indexOf(node.id)
        assert(childIdx >= 0, `Parent of node: ${node.id} is unaware of child`)
        if (childIdx === parent.children.length - 1) return
        for (const childId of parent.children.slice(childIdx + 1)) {
            this.accumulateVisibleSubtree(childId, accumulator, currentLevel)
            if (accumulator.heightLeft <= 0) return
        }
    }

    private accumulateVisibleSubtree(startId: string, accumulator: VisibleNodeAccumulator, currentLevel: number) {
        const node = this.allNodes[startId]
        assert(node, `Node not found: ${startId}`)
        const isCollapsed = this.isCollapsed(node.id)
        if (accumulator.nodes.find(n => n.node.id === node.id)) {
            throw new Error("Attempting to revisit node")
        }
        accumulator.nodes.push({
            node,
            level: currentLevel,
            isCollapsed,
            numChildren: node.children.length,
            canShiftForward: this.outlineShell.canShiftForward(node.id),
            canShiftBackward: this.outlineShell.canShiftBackward(node.id),
        })
        accumulator.heightLeft -= this.getNodeHeight(startId)
        if (accumulator.heightLeft <= 0) return
        if (!isCollapsed) {
            for (const childId of node.children) {
                this.accumulateVisibleSubtree(childId, accumulator, currentLevel + 1)
            }
        }
    }

    private get allNodes() {
        return this.outlineShell.outline.allNodes
    }
}
