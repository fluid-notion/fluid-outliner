import {
  IModelType,
  Snapshot,
  types as t
} from "mobx-state-tree";
import { v4 as uuid } from "uuid";
import { IOutline, Outline } from "./Outline";

export interface INode {
    id: string;
    content: string;
    parent: INode | null;
    antecedent: INode | IOutline;
    children: INode[];
    outline: IOutline;
    siblingIdx: number;
    setContent(content: string): void;
    setParent(node: INode | null): void;
    spliceChildren(start: number, delCount: number, ...nodes: INode[]): any;
    addSibling(): void;
    indentForward(): void;
    indentBackward(): void;
    hasDescendent(id: string): boolean;
    relocateBefore(id: string): void;
    relocateAfter(id: string): void;
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
      },
      setParent(node: INode | null) {
        self.parent = node;
      }
    }))
    .actions(self => ({
      hasDescendent(id: string) {
        for (const node of self.children) {
          if (node.id === id) return true;
          if (node.hasDescendent(id)) return true;
        }
        return false;
      },
      addSibling() {
        const node = Node.create({
          parent: self.parent,
          outline: self.outline
        });
        self.outline.registerNode(node);
        self.antecedent.spliceChildren(self.siblingIdx + 1, 0, node);
      },
      indentForward() {
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
        let gAnt: INode | IOutline | null = gParent;
        if (!gParent) gAnt = curParent.antecedent;
        const newIdx = curParent.siblingIdx + 1;
        const newChildren = curParent.children.slice(self.siblingIdx + 1);
        curParent.spliceChildren(self.siblingIdx, newChildren.length + 1);
        self.children.push(...newChildren);
        gAnt!.spliceChildren(newIdx, 0, self as any);
        self.parent = gParent;
      },
      relocateBefore(id: string) {
        const node = self.outline.getNode(id);
        node.antecedent.spliceChildren(node.siblingIdx, 1);
        self.antecedent.spliceChildren(self.siblingIdx, 0, node);
        node.setParent(self.parent);
      },
      relocateAfter(id: string) {
        const node = self.outline.getNode(id);
        node.antecedent.spliceChildren(node.siblingIdx, 1);
        if (self.children.length === 0) {
          self.antecedent.spliceChildren(self.siblingIdx + 1, 0, node);
          node.setParent(self.parent);
        } else {
          self.spliceChildren(0, 0, node);
          node.setParent(self as any);
        }
      }
    }));
  