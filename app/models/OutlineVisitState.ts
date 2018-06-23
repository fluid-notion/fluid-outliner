import { IExtendedObservableMap, types as t } from "mobx-state-tree";
import { INode } from "./Node";
import { Outline } from "./Outline";
import { IIdentifiable, IMaybe } from "../utils/UtilTypes";

interface INodeLevel {
  node: INode;
  level: number;
  isCollapsed: boolean;
  didMatch: boolean;
  numChildren: number;
}

const iterateVisible = (
  collapsedNodes: IExtendedObservableMap<boolean>,
  searchQuery: string
) => {
  const normQuery = searchQuery.toLowerCase().trim();
  return function* iterate(nodes: INode[], level = 0): any {
    for (const node of nodes) {
      let didMatch = node.matchesQuery(normQuery);
      const isCollapsed = collapsedNodes.get(node.id);
      const numChildren = node.children.length;
      const curLevel = { node, level, isCollapsed, numChildren, didMatch };
      if (isCollapsed) {
        if (didMatch) {
          yield curLevel;
          continue;
        }
      } else {
        const children = [...iterate(node.children, level + 1)];
        didMatch = didMatch || children.length > 0;
        if (!didMatch) continue;
        yield curLevel;
        yield* children;
      }
    }
  };
};

export const OutlineVisitState = t
  .model("OutlineVisitState", {
    outline: t.reference(Outline),
    collapsedNodes: t.optional(t.map(t.boolean), {}),
    searchQuery: t.optional(t.string, ""),
    activeItemId: t.maybe(t.string),
  })
  .views(self => ({
    get flatList(): INodeLevel[] {
      return [
        ...iterateVisible(self.collapsedNodes, self.searchQuery)(
          self.outline.children
        ),
      ];
    },
    isActive(item: IIdentifiable) {
      return item ? item.id === self.activeItemId : false;
    },
  }))
  .actions(self => ({
    toggleCollapse(id: string) {
      self.collapsedNodes.set(id, !self.collapsedNodes.get(id));
    },
    setSearchQuery(query: string) {
      self.searchQuery = query;
    },
    clearSearchQuery() {
      self.searchQuery = "";
    },
    activateItem(item: IIdentifiable) {
      self.activeItemId = (item && item.id) || null;
    },
    deactivateItem(item: IMaybe<IIdentifiable>) {
      if (item && item.id) {
        if (self.activeItemId === item.id) {
          self.activeItemId = null;
        }
      } else {
        self.activeItemId = null;
      }
    },
  }));


export type IOutlineVisitState = typeof OutlineVisitState.Type;