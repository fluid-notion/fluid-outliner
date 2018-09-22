import _debug from "debug"
import assert from "assert"
import { observable, computed, action } from "mobx"

import { Maybe } from "../helpers/types"
import { OutlineShell, Node, NodeParent } from "./OutlineShell"
import { linkProducer } from "../helpers/unidirectional-observable-bridge/producer"

const debug = _debug("fluid-outliner:OutlineVisitState")

export const DEFAULT_EMPIRICAL_NODE_HEIGHT = 40
export const BUFFER_EXTRANEOUS_NODE_COUNT = 5

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
        this.startCursor = this.outlineShell.outline.children[0]

    }

    @observable private containerBounds: Maybe<Bounds>

    @observable private scrollTop = 0
    @observable private baseScrollTop = 0
    @observable private headerPadding = 0
    @observable private footerPadding = 0

    @observable private nodeHeightMap: Map<string, number> = new Map()

    @observable private collapsedMap: Map<string, boolean> = new Map()

    @observable private startCursor: Maybe<string>

    get effectiveStartCursor() {
        return this.startCursor || this.outlineShell.outline.children[0]
    }

    isCollapsed(id: string) {
        if (this.collapsedMap.has(id)) {
            return this.collapsedMap.get(id)!
        }
        return false
    }

    @action
    setScrollTop(scrollTop: number) {
        this.scrollTop = scrollTop
        if (this.scrollTop > this.baseScrollTop) {
            const nextBaseScrollTop = this.baseScrollTop + this.getNodeHeight(this.effectiveStartCursor);
            if (this.scrollTop < nextBaseScrollTop) return;
            const nextVisible = this.getNextVisible(this.effectiveStartCursor)
            if (!nextVisible) return;
            this.startCursor = nextVisible
            this.baseScrollTop = nextBaseScrollTop
        } else if (this.scrollTop < this.baseScrollTop) {
            const prevVisible = this.getPrevVisible(this.effectiveStartCursor)
            if (!prevVisible) return;
            this.baseScrollTop = this.scrollTop - this.getNodeHeight(prevVisible)
            this.startCursor = prevVisible
        }
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

    getNextVisible(id: string) {
        let node: Node | null = this.outlineShell.getNode(id);
        if (!this.isCollapsed(id) && node.children.length > 0) {
            return node.children[0];
        }
        while (node) {
            const sib = this.outlineShell.getNextSibling(node.id)
            if (sib) return sib
            node = this.outlineShell.getParentOf(node.id)
        }
        return null
    }

    getPrevVisible(id: string) {
        let node: Node | null = this.outlineShell.getNode(id)
        const sib = this.outlineShell.getPrevSibling(node.id)
        if (sib) return sib
        return node.parentId
    }
}
