import { IExtendedObservableMap, types as t } from "mobx-state-tree"
import isNil from "lodash/isNil"
import { INode } from "./Node"
import { Outline } from "./Outline"
import { IIdentifiable, IMaybe } from "../utils/UtilTypes"

interface INodeLevel {
    node: INode
    level: number
    isCollapsed: boolean
    didMatch: boolean
    numChildren: number
}

const iterateVisible = (
    collapsedNodes: IExtendedObservableMap<boolean>,
    searchQuery: string,
    currentRoot: IMaybe<string>
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
            const encounteredRootYet =
                encounteredRoot || node.id === currentRoot
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

export const OutlineVisitState = t
    .model("OutlineVisitState", {
        outline: t.reference(Outline),
        collapsedNodes: t.optional(t.map(t.boolean), {}),
        searchQuery: t.optional(t.string, ""),
        activeItemId: t.maybe(t.string),
        zoomStack: t.optional(t.array(t.string), []),
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
        isActive(item: IIdentifiable) {
            return item ? item.id === self.activeItemId : false
        },
        get isAnyActive() {
            return !isNil(self.activeItemId)
        }
    }))
    .actions(self => ({
        zoomIn(id: string) {
            self.zoomStack.push(id)
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
