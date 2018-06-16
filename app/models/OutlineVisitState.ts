import { IExtendedObservableMap, types as t } from "mobx-state-tree";
import { INode } from "./Node";
import { Outline } from "./Outline";

interface INodeLevel {
  node: INode;
  level: number;
  isCollapsed: boolean;
  numChildren: number;
}

const iterateVisible = (collapsedNodes: IExtendedObservableMap<boolean>) => {
  return function* iterate(nodes: INode[], level = 0): any {
    for (const node of nodes) {
      const isCollapsed = collapsedNodes.get(node.id);
      const numChildren = node.children.length;
      yield { node, level, isCollapsed, numChildren };
      if (isCollapsed) continue;
      yield* iterate(node.children, level + 1);
    }
  };
};

export const OutlineVisitState = t
  .model("OutlineVisitState", {
    outline: t.reference(Outline),
    collapsedNodes: t.optional(t.map(t.boolean), {}),
  })
  .views(self => ({
    get flatList(): INodeLevel[] {
      return [...iterateVisible(self.collapsedNodes)(self.outline.children)];
    },
  }))
  .actions(self => ({
    toggleCollapse(id: string) {
      self.collapsedNodes.set(id, !self.collapsedNodes.get(id));
    },
  }));
