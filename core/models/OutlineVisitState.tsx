// import _debug from "debug"
import assert from "assert"
import size from "lodash/size"
import { observable, computed, action } from "mobx"

import { Maybe } from "../helpers/types"
import { OutlineShell, Node } from "./OutlineShell"
import { linkProducer } from "../helpers/unidirectional-observable-bridge/producer"

// const debug = _debug("fluid-outliner:OutlineVisitState")

export const DEFAULT_EMPIRICAL_NODE_HEIGHT = 40
export const BUFFER_EXTRANEOUS_NODE_COUNT = 5
export const EXTRA_VERTICAL_PADDING = 40

//
//                                           ] EXTRA_VERTICAL_PADDING
//          _    ___________________________  _________ baseScrollTop
//          |  ..|..........................|..... ---- scrollTop  ---,
//          |  . |__________________________|    .                    |
//          |  .     |                      |    .                    |- Visible Buffer
// outline  |  ................................... ___________________|
//          |        |______________________|
//          |            |                  |
//          |            |__________________|
//          |_           |__________________|
//                                            ] EXTRA_VERTICAL_PADDING

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

export interface BufferWindow {
    visibleNodes: NodeState[]
    headerPadding: number
    footerPadding: number
}

export class OutlineVisitState {
    constructor(public outlineShell: OutlineShell) {
        console.log("Creating OutlineVisitState")
        this.startCursor = this.outlineShell.outline.children[0]

    }

    @observable private containerBounds: Maybe<Bounds>

    @observable private scrollTop = 0
    @observable private baseScrollTop = EXTRA_VERTICAL_PADDING
    @observable private headerPadding = EXTRA_VERTICAL_PADDING

    @observable private nodeHeightMap: Map<string, number> = new Map()

    @observable private collapsedMap: Map<string, boolean> = new Map()

    @observable private startCursor: Maybe<string>

    @computed
    get effectiveStartCursor() {
        return this.startCursor || this.outlineShell.outline.children[0]
    }

    @computed
    get bufferHeight() {
        return this.visibleNodes.reduce((sum, n) => (
            sum + this.getNodeHeight(n.node.id)
        ), 0);
    }

    @computed
    get totalHeightEstimate() {
        let estimate = (size(this.outlineShell.outline.allNodes) * DEFAULT_EMPIRICAL_NODE_HEIGHT)
        // @ts-ignore
        for (const [_nodeId, height] of this.nodeHeightMap.entries()) {
            estimate -= DEFAULT_EMPIRICAL_NODE_HEIGHT;
            estimate += height
        }
        return estimate
    }

    @computed
    get footerPadding() {
        return this.totalHeightEstimate - this.bufferHeight - this.headerPadding + 2 * EXTRA_VERTICAL_PADDING
    }

    isCollapsed(id: string) {
        if (this.collapsedMap.has(id)) {
            return this.collapsedMap.get(id)!
        }
        return false
    }


    @action
    setScrollTop(scrollTop: number) {
        console.log('Updating to scrollTop :', scrollTop)
        const prevScrollTop = this.scrollTop
        this.scrollTop = scrollTop
        if (this.scrollTop > prevScrollTop) {
            while (true) {
                console.log("Scrolling Down")
                const nextBaseScrollTop = this.baseScrollTop + this.getNodeHeight(this.effectiveStartCursor);
                console.log('this.scrollTop =>', this.scrollTop, 'nextBaseScrollTop =>', nextBaseScrollTop, 'baseScrollTop =>', this.baseScrollTop)
                if (this.scrollTop < nextBaseScrollTop) return;
                const nextVisible = this.getNextVisible(this.effectiveStartCursor)
                if (!nextVisible) return;
                console.log("Shifting start cursor ->", nextVisible)
                if (this.startCursor) {
                    this.headerPadding += this.getNodeHeight(this.startCursor)
                }
                this.startCursor = nextVisible
                this.baseScrollTop = nextBaseScrollTop
            }
        } else if (this.scrollTop < prevScrollTop) {
            while (this.scrollTop < this.baseScrollTop) {
                console.log("Scrolling Up")
                const prevVisible = this.getPrevVisible(this.effectiveStartCursor)
                if (!prevVisible) return;
                console.log("Shifting start cursor ->", prevVisible)
                const nextHeaderPadding = this.headerPadding - this.getNodeHeight(prevVisible)
                this.headerPadding = nextHeaderPadding > EXTRA_VERTICAL_PADDING ? nextHeaderPadding : EXTRA_VERTICAL_PADDING
                const nextBaseScrollTop = this.scrollTop - this.getNodeHeight(prevVisible)
                this.baseScrollTop = nextBaseScrollTop > EXTRA_VERTICAL_PADDING ? nextBaseScrollTop : EXTRA_VERTICAL_PADDING
                this.startCursor = prevVisible
            }
        }
    }

    @action
    setContainerBounds(bounds: Bounds) {
        const didWidthChange = this.containerBounds && bounds.width !== this.containerBounds.width
        this.containerBounds = bounds
        this.scrollTop = 0
        this.baseScrollTop = EXTRA_VERTICAL_PADDING
        this.headerPadding = EXTRA_VERTICAL_PADDING
        if (didWidthChange) {
            this.nodeHeightMap = new Map()
        }
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
    get currentWindow(): BufferWindow {
        return {
            visibleNodes: this.visibleNodes,
            headerPadding: this.headerPadding,
            footerPadding: this.footerPadding
        }
    }

    public currentWindowLink = linkProducer(this, "currentWindow")

    @computed
    get visibleNodes() {
        // @ts-ignore
        const { containerBounds, startCursor, nodeHeightMap, collapsedMap } = this
        const { outline } = this.outlineShell
        if (!containerBounds || containerBounds.height === 0) return []
        const accumulator: VisibleNodeAccumulator = { heightLeft: containerBounds.height, nodes: [] }
        const effectiveStartCursor = startCursor || outline.children[0]
        this.accumulateVisible(effectiveStartCursor, accumulator)
        console.log("Visible nodes:", accumulator.nodes)
        return accumulator.nodes
    }

    private accumulateVisible(startId: string, accumulator: VisibleNodeAccumulator) {
        let currentLevel = this.outlineShell.getLevelOf(startId);
        console.log("Accumulating visible nodes starting from:", startId)
        this.accumulateVisibleSubtree(startId, accumulator, currentLevel)
        if (accumulator.heightLeft <= 0) return
        this.accumulateSubsequentSiblingSubtrees(startId, accumulator, currentLevel)
    }

    private accumulateSubsequentSiblingSubtrees(
        startId: string,
        accumulator: VisibleNodeAccumulator,
        currentLevel: number
    ) {
        let node: Maybe<Node> = this.allNodes[startId]
        while (node && accumulator.heightLeft > 0) {
            console.log("Accumulating sibling tree after", node && node.id, " height left:", accumulator.heightLeft)
            const antecedent = this.outlineShell.getAntecedent(node.id)
            const childIdx = antecedent.children.indexOf(node.id)
            assert(childIdx >= 0, `Parent of node: ${node.id} is unaware of child`)
            if (childIdx !== antecedent.children.length - 1) {
                for (const childId of antecedent.children.slice(childIdx + 1)) {
                    this.accumulateVisibleSubtree(childId, accumulator, currentLevel)
                }
            }
            if (node.parentId) {
                node = this.outlineShell.getNode(node.parentId)
            } else break
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
