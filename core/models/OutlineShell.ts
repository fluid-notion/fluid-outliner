import * as Comlink from "comlink"
import assert from "assert"
import pull from "lodash/pull"
import last from "lodash/last"
import first from "lodash/first"
import _debug from "debug"
import md5 from "js-md5"
// @ts-ignore
import AutoMerge from "automerge"
import { computed } from "mobx"

import { v4 as uuid } from "uuid"
import { Maybe, Fn0 } from "../helpers/types"
import { linkProducer } from "../helpers/unidirectional-observable-bridge/producer"
import { Repository } from "./Repository"
import { Outline, Node } from "./document-data-types";
import { EmbeddedCRDTFile } from "./EmbeddedCRDTFile";

const debug = _debug("fluid-outliner:OutlineShell")

export const createDefaultNode: Fn0<Node> = () => ({
    parentId: null,
    id: uuid(),
    format: "text",
    children: [],
    contentHash: null
})

type OutlineChangeSubscriber = (changes: any, newOutline: Outline, oldOutline: Outline) => void

export class OutlineShell {
    repository: Repository
    idLink: any
    titleLink: any

    public static create(embeddedOutlineFile: EmbeddedCRDTFile<Outline>, repository: Repository) {
        const outline = AutoMerge.change(AutoMerge.init(), (doc: any) => {
            doc.id = uuid()
            doc.title = "Untitled"
            const defaultNode = createDefaultNode()
            doc.allNodes = {}
            doc.allNodes[defaultNode.id] = defaultNode
            doc.children = [defaultNode.id]
            return doc
        })
        embeddedOutlineFile.crdt = outline
        embeddedOutlineFile.save()
        debug("Creating outline", outline)
        return new this(embeddedOutlineFile, repository)
    }

    embeddedFile: Maybe<EmbeddedCRDTFile<Outline>>

    @computed
    get outline() {
        return this.embeddedFile!.crdt!
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

    constructor(edf: EmbeddedCRDTFile<Outline>, repository: Repository) {
        this.embeddedFile = edf
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

    public getLevelOf(nodeId: string, curLevel = 0): number {
        const node = this.getNode(nodeId)
        if (node && node.parentId) {
            return this.getLevelOf(node.parentId, curLevel + 1)
        }
        return curLevel
    }

    public async addNode(parentId: Maybe<string>, index: number): Promise<Maybe<string>> {
        let id: Maybe<string> = null
        this.embeddedFile!.makeChange((doc: Outline) => {
            const node = createDefaultNode()
            if (parentId) {
                node.parentId = parentId
                doc.allNodes[parentId].children.splice(index, 0, node.id)
            } else {
                doc.children.splice(index, 0, node.id)
            }
            doc.allNodes[node.id] = node
            debug("Added Node:", node)
            id = node.id
        }, "addNode")
        return id
    }

    public removeNode(nodeId: string) {
        this.embeddedFile!.makeChange(outline => {
            const antecedent = this.getAntecedent(nodeId, outline)
            const sibIdx = this.getSiblingIndex(nodeId, outline)
            antecedent.children.splice(sibIdx, 1)
            delete outline.allNodes[nodeId]
        })
    }

    public async relocateNode(id: string, parentId: string, index: number) {
        this.embeddedFile!.makeChange(outline => this.changeNodeParent(id, parentId, index, outline), `Relocate node: ${id}`)
    }

    public async setContent(id: string, content: string, output?: string) {
        const node = this.getNode(id)
        const ecf = await this.getEmbeddedContentFile(id, node.format)
        ecf.makeChange(data => {
            data.content = data.content || new AutoMerge.Text();
            data.output = output
            return data
        })
        this.embeddedFile!.makeChange(outline => {
            const node = this.getNode(id, outline)
            node.contentHash = md5(content)
            return outline
        })
        await ecf.save()
    }

    public async applyContentOperation(id: string, changes: NodeChange[]) {
        const attachmentEDF = await this.getEmbeddedContentFile(id)
        attachmentEDF.makeChange(data => {
            data.content = data.content || new AutoMerge.Text();

        })
    }

    public async getContents(id: string) {
        const attachmentEDF = await this.getEmbeddedContentFile(id)
        const { content, output } = attachmentEDF.crdt!
        return { content, output }
    }

    public async setFormat(id: string, format: string) {
        this.embeddedFile!.makeChange(outline => {
            const node = this.getNode(id, outline)
            node.format = format
            return outline
        })
    }

    public setTitle(title: string) {
        this.embeddedFile!.makeChange(outline => {
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

    public hasChildren(nodeId: string, outline = this.outline) {
        const { children } = this.getNode(nodeId, outline);
        return children.length > 0;
    }

    public getFirstChildOf(nodeId: string, outline = this.outline) {
        const { children } = this.getNode(nodeId, outline);
        if (children.length > 0) {
            return this.getNode(children[0], outline);
        }
        return null
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
        this.embeddedFile!.makeChange(outline => {
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

    private async getEmbeddedContentFile(id: string, format: string) {
        const ecf = this.repository.getEmbeddedContentFile(id, format)
        await ecf.safeLoad()
        return ecf
    }
}
