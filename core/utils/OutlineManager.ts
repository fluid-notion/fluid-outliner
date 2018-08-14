import { IMaybe, IFn0 } from "./UtilTypes"
import pull from "lodash/pull"
// @ts-ignore
import AutoMerge from "automerge"

import { v4 as uuid } from "uuid"

export interface INode extends INodeParent {
    id: string
    content: string
    format: string
}

export interface INodeParent {
    children: string[]
}

export interface IOutline extends INodeParent {
    id: string
    title: string
    allNodes: { [key: string]: INode }
}

export const createDefaultNode: IFn0<INode> = () => ({
    id: uuid(),
    content: "Edit Me",
    format: "text",
    children: [],
})

type IOutlineChangeSubscriber = (changes: any, newOutline: IOutline, oldOutline: IOutline) => void

export class OutlineManager {
    public static create() {
        const outline = AutoMerge.change(AutoMerge.init(), (doc: any) => {
            doc.id = uuid()
            doc.title = "Untitled"
            const defaultNode = createDefaultNode()
            doc.allNodes = {}
            doc.allNodes[defaultNode.id] = defaultNode
            doc.children = [defaultNode.id]
            return doc
        })
        return new OutlineManager(outline)
    }

    public static load(raw: string) {
        return new OutlineManager(AutoMerge.load(raw))
    }

    public outline: IOutline

    private subscribers: IOutlineChangeSubscriber[] = []

    constructor(outline: IOutline) {
        this.outline = outline
    }

    public onChange(subscriber: IOutlineChangeSubscriber) {
        this.subscribers.push(subscriber)
        return () => pull(this.subscribers, subscriber)
    }

    public async serialize() {
        return AutoMerge.save(this.outline)
    }

    public async addNode(parentId: IMaybe<string>) {
        this.makeChange((doc: IOutline) => {
            const node = createDefaultNode()
            doc.allNodes[node.id] = node
            if (parentId) {
                doc.allNodes[parentId].children.unshift(node.id)
            } else {
                doc.children.push(node.id)
            }
        }, "addNode")
    }

    // @ts-ignore
    public async relocateNode(id: string, parentId: string, index: number) {}

    // @ts-ignore
    public async updateNode(id: string, content: string) {}

    private makeChange(mutate: (doc: IOutline) => void, msg = "Update outline") {
        const oldDoc = this.outline
        const newDoc = AutoMerge.change(oldDoc, msg, mutate)
        const changes = AutoMerge.getChanges(oldDoc, newDoc)
        this.outline = newDoc
        this.broadcastChanges(changes, newDoc, oldDoc)
    }

    private broadcastChanges(...args: any[]) {
        for (const subscriber of this.subscribers) {
            (subscriber as any)(...args)
        }
    }

}
