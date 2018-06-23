import { IExtendedObservableMap, types as t } from "mobx-state-tree";
import { INode } from "./Node";
import { Outline } from "./Outline";

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
  })
  .views(self => ({
    get flatList(): INodeLevel[] {
      return [
        ...iterateVisible(self.collapsedNodes, self.searchQuery)(
          self.outline.children
        ),
      ];
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
  }));
