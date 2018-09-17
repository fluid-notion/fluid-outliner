import * as Comlink from "comlink"
import assert from "assert"
import pull from "lodash/pull"
import last from "lodash/last"
import first from "lodash/first"
import _debug from "debug"
// @ts-ignore
import AutoMerge from "automerge"
import { computed } from "mobx"

import { v4 as uuid } from "uuid"
import { Maybe, Fn0 } from "../helpers/types"
import { linkProducer } from "../helpers/unidirectional-observable-bridge/producer"
import { EmbeddedDataFile } from "./EmbeddedDataFile"
import { Repository } from "./Repository"

const debug = _debug("fluid-outliner:OutlineShell")

export interface NodeParent {
    children: string[]
}

export interface Node extends NodeParent {
    id: string
    parentId: Maybe<string>
    format: string
}

export interface Outline extends NodeParent {
    id: string
    title: string
    allNodes: { [key: string]: Node }
}

export const createDefaultNode: Fn0<Node> = () => ({
    parentId: null,
    id: uuid(),
    format: "text",
    children: [],
})

type OutlineChangeSubscriber = (changes: any, newOutline: Outline, oldOutline: Outline) => void

export class OutlineShell {
    repository: Repository
    idLink: any
    titleLink: any
    public static create(outlineEDF: EmbeddedDataFile<Outline>, repository: Repository) {
        const outline = AutoMerge.change(AutoMerge.init(), (doc: any) => {
            doc.id = uuid()
            doc.title = "Untitled"
            const defaultNode = createDefaultNode()
            doc.allNodes = {}
            doc.allNodes[defaultNode.id] = defaultNode
            doc.children = [defaultNode.id]
            return doc
        })
        outlineEDF.crdt = outline
        outlineEDF.save()
        debug("Creating outline", outline)
        return new this(outlineEDF, repository)
    }

    edf: Maybe<EmbeddedDataFile<Outline>>

    @computed
    get outline() {
        return this.edf!.crdt!
    }

    @computed
    get id() {
        return this.outline.id
    }

    @computed
    get title() {
        return this.outline.title
    }

    private subscribers: OutlineChangeSubscriber[] = []

    constructor(edf: EmbeddedDataFile<Outline>, repository: Repository) {
        this.edf = edf
        this.repository = repository
        this.idLink = linkProducer(this, "id")
        this.titleLink = linkProducer(this, "title")
    }

    public onChange(subscriber: OutlineChangeSubscriber) {
        this.subscribers.push(subscriber)
        return Comlink.proxyValue(() => pull(this.subscribers, subscriber))
    }

    public async serialize() {
        return AutoMerge.save(this.outline)
    }

    public async addNode(parentId: Maybe<string>): Promise<Maybe<string>> {
        let id: Maybe<string> = null
        this.edf!.makeChange((doc: Outline) => {
            const node = createDefaultNode()
            if (parentId) {
                node.parentId = parentId
                doc.allNodes[parentId].children.unshift(node.id)
            } else {
                doc.children.push(node.id)
            }
            doc.allNodes[node.id] = node
            debug("Added Node:", node)
            id = node.id
        }, "addNode")
        return id
    }

    public removeNode(nodeId: string) {
        this.edf!.makeChange(outline => {
            const antecedent = this.getAntecedent(nodeId, outline)
            const sibIdx = this.getSiblingIndex(nodeId, outline)
            antecedent.children.splice(sibIdx, 1)
            delete outline.allNodes[nodeId]
        })
    }

    public async relocateNode(id: string, parentId: string, index: number) {
        this.edf!.makeChange(outline => this.changeNodeParent(id, parentId, index, outline), `Relocate node: ${id}`)
    }

    public async setContent(id: string, content: string, output?: string) {
        const attachmentEDF = await this.getAttachmentEDF(id)
        attachmentEDF.makeChange(data => {
            data.content = content
            data.output = output
            return data
        })
        await attachmentEDF.save()
    }

    public async getContent(id: string) {
        const attachmentEDF = await this.getAttachmentEDF(id)
        return attachmentEDF.crdt!.content
    }

    public async setFormat(id: string, format: string) {
        this.edf!.makeChange(outline => {
            const node = this.getNode(id, outline)
            node.format = format
            return outline
        })
    }

    public setTitle(title: string) {
        this.edf!.makeChange(outline => {
            outline.title = title
            return outline
        })
    }

    private changeNodeParent(id: string, parentId: string, index: number, outline: Outline) {
        const node = this.getNode(id, outline)
        const curSibIdx = this.getSiblingIndex(id, outline)
        if (node.parentId === parentId && curSibIdx === index) {
            return outline
        }
        const antecedent = this.getAntecedent(node.id, outline)
        const parent = this.getNodeParent(parentId, outline)
        antecedent.children.splice(curSibIdx, 1)
        if (parentId === node.parentId && curSibIdx < index) {
            parent.children.splice(index - 1, 0, id)
        } else {
            parent.children.splice(index, 0, id)
        }
        if (parent.id === outline.id) {
            node.parentId = null
        } else {
            node.parentId = parentId
        }
        return outline
    }

    public getNode(id: string, outline = this.outline) {
        const node = outline.allNodes[id]
        assert(node, `Unable to find node with id: ${id}`)
        return node
    }

    public getNodeParent(id: string, outline = this.outline) {
        if (id === outline.id) return outline
        return this.getNode(id, outline)
    }

    public getParentOf(nodeId: string, outline = this.outline) {
        const { parentId } = this.getNode(nodeId, outline)
        if (!parentId) return null
        return this.getNode(parentId, outline)
    }

    public getGrandParentOf(nodeId: string, outline = this.outline) {
        const parent = this.getParentOf(nodeId, outline)
        if (!parent) return null
        return this.getParentOf(parent.id, outline)
    }

    public getChildrenOf(nodeId: string, outline = this.outline) {
        const { children } = this.getNode(nodeId, outline)
        if (children.length === 0) return []
        return children.map(id => this.getNode(id, outline))
    }

    public getAntecedent(nodeId: string, outline = this.outline) {
        const { parentId } = this.getNode(nodeId, outline)
        if (parentId) return this.getNode(parentId, outline)
        return outline
    }

    public getGrandAntecedent(nodeId: string, outline = this.outline) {
        const parent = this.getParentOf(nodeId, outline)
        if (!parent) return null
        return this.getAntecedent(parent.id, outline)
    }

    public getSiblingIndex(nodeId: string, outline = this.outline) {
        const idx = this.getAntecedent(nodeId, outline).children.indexOf(nodeId)
        assert(idx >= 0, `Parent of node ${nodeId} unaware of its child`)
        return idx
    }

    public getPrevSiblings(nodeId: string, outline = this.outline) {
        const antecedent = this.getAntecedent(nodeId, outline)
        const sibIdx = this.getSiblingIndex(nodeId, outline)
        return antecedent.children.slice(0, sibIdx)
    }

    public getNextSiblings(nodeId: string, outline = this.outline) {
        const antecedent = this.getAntecedent(nodeId, outline)
        const sibIdx = this.getSiblingIndex(nodeId, outline)
        return antecedent.children.slice(sibIdx + 1)
    }

    public getPrevSibling(nodeId: string, outline = this.outline) {
        return last(this.getPrevSiblings(nodeId, outline))
    }

    public getNextSibling(nodeId: string, outline = this.outline) {
        return first(this.getNextSiblings(nodeId, outline))
    }

    public canShiftForward(nodeId: string, outline = this.outline) {
        return this.getSiblingIndex(nodeId, outline) > 0
    }

    public canShiftBackward(nodeId: string, outline = this.outline) {
        return !!this.getGrandParentOf(nodeId, outline)
    }

    public shiftForward(nodeId: string) {
        const prevSiblingId = this.getPrevSibling(nodeId)
        if (!prevSiblingId) return
        const prevSibling = this.getNode(prevSiblingId)
        this.relocateNode(nodeId, prevSiblingId, prevSibling.children.length)
    }

    public shiftBackward(nodeId: string) {
        this.edf!.makeChange(outline => {
            const grandPa = this.getGrandAntecedent(nodeId, outline)
            const node = this.getNode(nodeId, outline)
            if (!grandPa) return
            const nextSiblings = this.getNextSiblings(nodeId, outline)
            const parSibIdx = this.getSiblingIndex(node.parentId!, outline)
            let tgtIdx = node.children.length
            for (const sibId of nextSiblings) {
                this.changeNodeParent(sibId, nodeId, tgtIdx, outline)
                tgtIdx += 1
            }
            this.changeNodeParent(nodeId, grandPa.id, parSibIdx + 1, outline)
            return outline
        })
    }

    private async getAttachmentEDF(id: string) {
        const attachmentEDF = this.repository.getAttachmentEDF(id)
        await attachmentEDF.safeLoad()
        return attachmentEDF
    }
}
