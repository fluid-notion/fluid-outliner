import JSZip from "jszip"
import pull from "lodash/pull"
import { positionValues } from "react-custom-scrollbars"
import { INode, INodeParent, OutlineManager } from "./OutlineManager"
import { IMaybe } from "./UtilTypes"
import isEqual from "lodash/isEqual"
import * as Comlink from "comlink"

export interface INodeInfo {
    node: INode
    level: number
}

type IOutlineWindowObserver = (nodes: INodeInfo[], scrollState: IMaybe<positionValues>) => void

export class OutlineWindow {
    public scrollState: IMaybe<positionValues>

    private observers: IOutlineWindowObserver[] = []

    // @ts-ignore
    constructor(private outlineManager: OutlineManager, private zipFile: JSZip) {
        this.outlineManager.onChange(() => this.broadcastVisibleNodes())
    }

    get outline() {
        return this.outlineManager.outline
    }

    get id() {
        return this.outline.id
    }

    public syncScrollState(values: positionValues) {
        if (isEqual(values, this.scrollState)) return
        this.scrollState = values
        this.broadcastVisibleNodes()
    }

    public onChange(obs: IOutlineWindowObserver) {
        this.observers.push(obs)
        return Comlink.proxyValue(() => pull(this.observers, obs))
    }

    public getVisibleNodes(): INodeInfo[] {
        return [...this.flattenHierarchy(this.outline)]
    }

    private broadcastVisibleNodes() {
        const nodes = this.getVisibleNodes()
        for (const obs of this.observers) {
            obs(nodes, this.scrollState)
        }
    }

    private *flattenHierarchy(root: INodeParent, level = 0): any {
        if (!root.children) {
            return
        }
        for (const nodeId of root.children) {
            const node: INode = this.outline.allNodes[nodeId]
            yield { node, level }
            yield* this.flattenHierarchy(node, level + 1)
        }
    }
}
