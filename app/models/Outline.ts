import memoize from "lodash/memoize";
import { IObservableArray } from "mobx";
import {
  IExtendedObservableMap,
  IModelType,
  Snapshot,
  types as t,
} from "mobx-state-tree";
import { v4 as uuid } from "uuid";
import { INode, Node } from "./Node";

export const defaultRootNodeId = memoize(() => uuid());
export const defaultOutlineId = memoize(() => uuid());

export interface IOutline {
  id: string;
  title: string;
  allNodes: IExtendedObservableMap<INode>;
  children: IObservableArray<INode>;
  spliceChildren(start: number, delCount: number, ...nodes: INode[]): any;
  registerNode(node: INode): void;
  setTitle(t: string): void;
  getNode(id: string): INode;
  removeNode(id: string): void;
}

export const Outline: IModelType<Snapshot<IOutline>, IOutline> = t
  .model("Outline", {
    id: t.optional(t.identifier(t.string), () => uuid()),
    title: t.optional(t.string, "Untitled"),
    allNodes: t.optional(t.map(Node), {
      [defaultRootNodeId()]: {
        outline: defaultOutlineId(),
        id: defaultRootNodeId(),
        content: "Edit Me",
      },
    }),
    children: t.optional(t.array(t.reference(Node)), [defaultRootNodeId()]),
  })
  .actions(self => ({
    getNode(id: string) {
      return self.allNodes.get(id)!;
    },
    registerNode(node: INode) {
      self.allNodes.set(node.id, node);
    },
    spliceChildren(start: number, delCount: number, ...nodes: INode[]) {
      return self.children.splice(start, delCount, ...nodes);
    },
    setTitle(title: string) {
      self.title = title;
    },
    removeNode(id: string) {
      const node = self.allNodes.get(id);
      if (!node) return;
      if (node.parent) node.parent.spliceChildren(node.siblingIdx, 1);
      self.allNodes.delete(id);
    },
  }));
