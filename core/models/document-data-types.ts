import { Maybe } from "../helpers/types";

export interface NodeParent {
    children: string[]
}

export interface Node extends NodeParent {
    id: string
    parentId: Maybe<string>
    format: string
    contentHash: Maybe<string>
}

export interface Outline extends NodeParent {
    id: string
    title: string
    allNodes: { [key: string]: Node }
}

export interface NodeChange {
    startIndex: number
    type: "insert" | "delete"
    count: number
    str?: string
    message: string
}
