import memoize from "lodash/memoize";
import { IObservableArray } from "mobx";
import {
  IExtendedObservableMap,
  IModelType,
  Snapshot,
  types as t
} from "mobx-state-tree";
import { v4 as uuid } from "uuid";

export interface INode {
  id: string;
  content: string;
  parent: INode | null;
  children: INode[];
  outline: IOutline;
  siblingIdx: number;
  setContent(content: string): void;
  spliceChildren(start: number, delCount: number, ...nodes: INode[]): any;
  addSibling(): void;
  indentForward(): void;
  indentBackward(): void;
}

export const Node: IModelType<Snapshot<INode>, INode> = t
  .model("Node", {
    id: t.optional(t.identifier(t.string), () => uuid()),
    content: t.optional(t.string, ''),
    outline: t.reference(t.late(() => Outline)),
    parent: t.late(() => t.maybe(t.reference(Node))),
    children: t.late(() => t.optional(t.array(t.reference(Node)), []))
  })
  .views(self => ({
    get antecedent() {
      return self.parent || self.outline;
    }
  }))
  .views(self => ({
    get siblingIdx() {
      return self.antecedent.children.indexOf(self as any);
    }
  }))
  .actions(self => ({
    setContent(content: string) {
      self.content = content;
    },
    spliceChildren(start: number, delCount: number, ...nodes: INode[]) {
      return self.children.splice(start, delCount, ...nodes);
    }
  }))
  .actions(self => ({
    addSibling() {
      const node = Node.create({
        parent: self.parent,
        outline: self.outline
      });
      self.outline.registerNode(node);
      self.antecedent.spliceChildren(self.siblingIdx + 1, 0, node);
    },
    indentForward() {
      if (!self.antecedent) return;
      if (self.siblingIdx === 0) return;
      const newParent = self.antecedent.children[self.siblingIdx - 1];
      self.antecedent.spliceChildren(self.siblingIdx, 1);
      newParent.spliceChildren(newParent.children.length, 0, self as any);
      self.parent = newParent;
    },
    indentBackward() {
      const curParent = self.parent;
      if (!curParent) return;
      const gParent = curParent.parent;
      if (!gParent) return;
      const newIdx = curParent.siblingIdx + 1;
      const newChildren = curParent.children.slice(self.siblingIdx + 1);
      curParent.spliceChildren(self.siblingIdx, newChildren.length + 1);
      self.children.push(...newChildren);
      gParent.spliceChildren(newIdx, 0, self as any);
      self.parent = gParent;
    }
  }));

export const defaultRootNodeId = memoize(() => uuid());
export const defaultOutlineId = memoize(() => uuid());

export interface IOutline {
  id: string;
  title: string;
  allNodes: IExtendedObservableMap<INode>;
  children: IObservableArray<INode>;
  spliceChildren(start: number, delCount: number, ...nodes: INode[]): any;
  registerNode(node: INode): void;
}

export const Outline: IModelType<Snapshot<IOutline>, IOutline> = t
  .model("Outline", {
    id: t.optional(t.identifier(t.string), () => uuid()),
    title: t.optional(t.string, "Untitled"),
    allNodes: t.optional(t.map(Node), {
      [defaultRootNodeId()]: {
        outline: defaultOutlineId(),
        id: defaultRootNodeId(),
        content: "Edit Me"
      }
    }),
    children: t.optional(t.array(t.reference(Node)), [defaultRootNodeId()])
  })
  .actions(self => ({
    registerNode(node: INode) {
      self.allNodes.set(node.id, node);
    },
    spliceChildren(start: number, delCount: number, ...nodes: INode[]) {
      return self.children.splice(start, delCount, ...nodes);
    }
  }));

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
    collapsedNodes: t.optional(t.map(t.boolean), {})
  })
  .views(self => ({
    get flatList(): INodeLevel[] {
      return [...iterateVisible(self.collapsedNodes)(self.outline.children)];
    }
  }))
  .actions(self => ({
    toggleCollapse(id: string) {
      self.collapsedNodes.set(id, !self.collapsedNodes.get(id));
    }
  }));
