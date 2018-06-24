import { IModelType, Snapshot, types as t } from "mobx-state-tree";
import { v4 as uuid } from "uuid";
import fuzzysearch from "fuzzysearch";
import isEmpty from "lodash/isEmpty";

import { IOutline, Outline } from "./Outline";
import { Note, INote, INoteFormat } from "./Note";
import { Marker, IMarker } from "./Marker";

export interface INode {
  id: string;
  content: string;
  searchableContent: string;
  parent: INode | null;
  antecedent: INode | IOutline;
  children: INode[];
  markers: IMarker[];
  notes: INote[];
  outline: IOutline;
  siblingIdx: number;
  setContent(content: string): void;
  setParent(node: INode | null): void;
  spliceChildren(start: number, delCount: number, ...nodes: INode[]): any;
  addSibling(): INode;
  indentForward(): void;
  indentBackward(): void;
  hasDescendent(id: string): boolean;
  relocateBefore(node: INode): void;
  relocateAfter(node: INode): void;
  moveUp(): void;
  moveDown(): void;
  matchesQuery(q: string): boolean;
  toggleBookmark(): void;
  toggleStar(): void;
  addMemo(format: INoteFormat): INote;
  addComment(): INote;
}

export const Node: IModelType<Snapshot<INode>, INode> = t
  .model("Node", {
    id: t.optional(t.identifier(t.string), () => uuid()),
    content: t.optional(t.string, ""),
    outline: t.reference(t.late(() => Outline)),
    parent: t.late(() => t.maybe(t.reference(Node))),
    children: t.late(() => t.optional(t.array(t.reference(Node)), [])),
    notes: t.optional(t.array(Note), () => []),
    markers: t.optional(t.array(Marker), () => []),
  })
  .views(self => ({
    get antecedent() {
      return self.parent || self.outline;
    },
    get searchableContent() {
      return self.content.toLowerCase();
    },
    getMarkerIdx(icon: string) {
      return self.markers.findIndex(marker => marker.icon === icon);
    },
  }))
  .views(self => ({
    matchesQuery(query: string) {
      if (isEmpty(query)) return true;
      return fuzzysearch(query, self.searchableContent);
    },
    get siblingIdx() {
      return self.antecedent.children.indexOf(self as any);
    },
    get isBookmarked() {
      return self.getMarkerIdx("bookmark") >= 0;
    },
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
    },
    toggleBookmark() {
      const idx = self.getMarkerIdx("bookmark");
      if (idx >= 0) {
        self.markers.splice(idx, 1);
      } else {
        self.markers.push({
          id: uuid(),
          icon: "bookmark",
          placement: "left",
        });
      }
    },
    toggleStar() {
      const idx = self.getMarkerIdx("star");
      if (idx >= 0) {
        self.markers.splice(idx, 1);
      } else {
        self.markers.push({
          id: uuid(),
          icon: "star",
          placement: "right",
        });
      }
    },
    addMemo(format: INoteFormat) {
      const memo = Note.create({
        id: uuid(),
        format,
        content: "",
        placement: "main",
      });
      self.notes.push(memo);
      return memo;
    },
    addComment() {
      const comment = Note.create({
        id: uuid(),
        format: "text",
        content: "",
        placement: "side",
      });
      self.notes.push(comment);
      return comment;
    },
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
        outline: self.outline,
      });
      self.outline.registerNode(node);
      self.antecedent.spliceChildren(self.siblingIdx + 1, 0, node);
      return node;
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
    relocateBefore(node: INode) {
      self.antecedent.spliceChildren(self.siblingIdx, 1);
      node.antecedent.spliceChildren(node.siblingIdx, 0, self as any);
      self.setParent(node.parent);
    },
    relocateAfter(node: INode) {
      self.antecedent.spliceChildren(self.siblingIdx, 1);
      if (node.children.length === 0) {
        node.antecedent.spliceChildren(node.siblingIdx + 1, 0, self as any);
        self.setParent(node.parent);
      } else {
        node.spliceChildren(0, 0, self as any);
        self.setParent(node);
      }
    },
    moveUp() {
      if (self.siblingIdx === 0) return;
      const idx = self.siblingIdx;
      self.antecedent.spliceChildren(idx, 1);
      self.antecedent.spliceChildren(idx - 1, 0, self as any);
    },
    moveDown() {
      if (self.siblingIdx === self.antecedent.children.length - 1) return;
      const idx = self.siblingIdx;
      self.antecedent.spliceChildren(idx, 1);
      self.antecedent.spliceChildren(idx + 1, 0, self as any);
    },
  }));
