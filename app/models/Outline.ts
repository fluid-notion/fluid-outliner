import memoize from "lodash/memoize"
import { IObservableArray } from "mobx"
import {
    IExtendedObservableMap,
    IModelType,
    Snapshot,
    types as t,
    onPatch,
    IJsonPatch,
    applyPatch,
} from "mobx-state-tree"
import { v4 as uuid } from "uuid"
import { INode, Node } from "./Node"

export const defaultRootNodeId = memoize(() => uuid())
export const defaultOutlineId = memoize(() => uuid())

interface IPatchLink {
    originalTimestamp: number
    forward: IJsonPatch
    backward: IJsonPatch
}

export interface IOutline {
    id: string
    title: string
    allNodes: IExtendedObservableMap<INode>
    children: IObservableArray<INode>
    spliceChildren(start: number, delCount: number, ...nodes: INode[]): any
    registerNode(node: INode): void
    setTitle(t: string): void
    getNode(id: string): INode
    removeNode(id: string): void
    undo(): void
    redo(): void
}

export const Outline: IModelType<Snapshot<IOutline>, IOutline> = t
    .model("Outline", {
        id: t.optional(t.identifier(t.string), () => uuid()),
        title: t.optional(t.string, "Untitled"),
        allNodes: t.optional(t.map(Node), {
            [defaultRootNodeId()]: {
                outline: defaultOutlineId(),
                id: defaultRootNodeId(),
                content: "Double click/tap to edit me",
            },
        }),
        children: t.optional(t.array(t.reference(Node)), [defaultRootNodeId()]),
    })
    .actions(self => ({
        getNode(id: string) {
            return self.allNodes.get(id)!
        },
        registerNode(node: INode) {
            self.allNodes.set(node.id, node)
        },
        spliceChildren(start: number, delCount: number, ...nodes: INode[]) {
            return self.children.splice(start, delCount, ...nodes)
        },
        setTitle(title: string) {
            self.title = title
        },
        removeNode(id: string) {
            const node = self.allNodes.get(id)
            if (!node) return
            if (node.parent) node.parent.spliceChildren(node.siblingIdx, 1)
            self.allNodes.delete(id)
        },
    }))
    .actions(self => {
        // History of patches:
        let patches: IPatchLink[] = []
        let patchPos = 0
        let trackPatches = true
        const afterCreate = () => {
            onPatch(self, (forward, backward) => {
                if (!trackPatches) return
                const patchLink: IPatchLink = {
                    forward,
                    backward,
                    originalTimestamp: Date.now(),
                }
                // We leave the first patch because otherwise
                // we will not be able to revert to the original pristine state
                if (patches.length > 1) {
                    const lastPatch = patches[patches.length - 1]
                    if (
                        lastPatch.forward.op === patchLink.forward.op &&
                        lastPatch.forward.path === patchLink.forward.path &&
                        patchLink.originalTimestamp -
                            lastPatch.originalTimestamp <=
                            1000
                    ) {
                        // Consolidate changes to the same patch within a second
                        lastPatch.forward.value = forward.value
                        lastPatch.backward.value = backward.value
                        return
                    }
                }
                // New patch entry:
                patches.splice(patchPos, patches.length - patchPos, patchLink)
                patchPos++
                // Cap patch history
                if (patches.length > 1000) {
                    patches = patches.slice(-1000)
                    patchPos = patches.length
                }
            })
        }
        const undo = () => {
            if (patches.length === 0 || patchPos === 0) return
            trackPatches = false
            patchPos--
            applyPatch(self, patches[patchPos].backward)
            trackPatches = true
        }
        const redo = () => {
            if (patchPos === patches.length) return
            trackPatches = false
            applyPatch(self, patches[patchPos].forward)
            patchPos++
            trackPatches = true
        }
        return {
            afterCreate,
            undo,
            redo,
        }
    })
