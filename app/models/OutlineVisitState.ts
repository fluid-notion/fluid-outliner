import { types as t } from "mobx-state-tree"
import isNil from "lodash/isNil"
import { INode, Node } from "./Node"
import { Outline } from "./Outline"
import { IIdentifiable, IMaybe } from "../utils/UtilTypes"

export interface INodeLevel {
    node: INode
    level: number
    isCollapsed: boolean
    didMatch: boolean
    numChildren: number
}

const iterateVisible = (
    collapsedNodes: { get(id: string): boolean | undefined },
    searchQuery: string,
    currentRoot: IMaybe<INode>
) => {
    const normQuery = searchQuery.toLowerCase().trim()
    return function* iterate(
        nodes: INode[],
        level = 0,
        encounteredRoot = isNil(currentRoot)
    ): any {
        for (const node of nodes) {
            let didMatch = node.matchesQuery(normQuery)
            const isCollapsed = collapsedNodes.get(node.id)
            const numChildren = node.children.length
            const curLevel = { node, level, isCollapsed, numChildren, didMatch }
            const encounteredRootYet = encounteredRoot || node === currentRoot
            const nextLevel = encounteredRootYet ? level + 1 : level
            if (isCollapsed) {
                if (didMatch) {
                    yield curLevel
                    continue
                }
            } else {
                const children = [
                    ...iterate(node.children, nextLevel, encounteredRootYet),
                ]
                didMatch = didMatch || children.length > 0
                if (!didMatch) continue
                if (encounteredRootYet) {
                    yield curLevel
                }
                yield* children
            }
        }
    }
}

const isBookmarked = (item: INodeLevel) =>
    item.node.markers.find(m => m.icon === "bookmark")

export const OutlineVisitState = t
    .model("OutlineVisitState", {
        outline: t.reference(Outline),
        collapsedNodes: t.optional(t.map(t.boolean), {}),
        searchQuery: t.optional(t.string, ""),
        activeItemId: t.maybe(t.string),
        zoomStack: t.optional(t.array(t.reference(Node)), []),
    })
    .views(self => ({
        get currentRoot() {
            return self.zoomStack[self.zoomStack.length - 1]
        },
    }))
    .views(self => ({
        get flatList(): INodeLevel[] {
            return [
                ...iterateVisible(
                    self.collapsedNodes,
                    self.searchQuery,
                    self.currentRoot
                )(self.outline.children),
            ]
        },
        get fullFlatList(): INodeLevel[] {
            return [
                ...iterateVisible(new Map(), "", undefined)(
                    self.outline.children
                ),
            ]
        },
        get bookmarkList(): INodeLevel[] {
            return this.flatList.filter(isBookmarked)
        },
        get fullBookmarkList(): INodeLevel[] {
            return this.fullFlatList.filter(isBookmarked)
        },
        isActive(item: IIdentifiable) {
            return item ? item.id === self.activeItemId : false
        },
        get isAnyActive() {
            return !isNil(self.activeItemId)
        },
    }))
    .actions(self => ({
        zoomIn(node: INode) {
            if (self.currentRoot === node) return
            self.zoomStack.push(node)
        },
        zoomOut() {
            self.zoomStack.pop()
        },
        toggleCollapse(id: string) {
            self.collapsedNodes.set(id, !self.collapsedNodes.get(id))
        },
        setSearchQuery(query: string) {
            self.searchQuery = query
        },
        clearSearchQuery() {
            self.searchQuery = ""
        },
        activateItem(item: IIdentifiable) {
            self.activeItemId = (item && item.id) || null
        },
        deactivateItem(item: IMaybe<IIdentifiable>) {
            if (item && item.id) {
                if (self.activeItemId === item.id) {
                    self.activeItemId = null
                }
            } else {
                self.activeItemId = null
            }
        },
    }))

export type IOutlineVisitState = typeof OutlineVisitState.Type
