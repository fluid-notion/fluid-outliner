import { withStyles, WithStyles } from "@material-ui/core/styles";
import { autobind, decorate } from "core-decorators";
import { observable } from "mobx";
import React from "react";
import memoize from "lodash/memoize";
import { IStoreConsumerProps } from "../models/IProviderProps";
import { storeObserver } from "../models/Store";
import { IPotentialDropTarget, NodeEditor } from "./NodeEditor";
import { OutlineTitleEditor } from "./OutlineTitleEditor";

const InjectStyles = withStyles({
  root: {
    minHeight: "100%",
    maxWidth: "1280px",
    margin: "90px auto",
    padding: "0",
    position: "relative",
    "@media(min-width: 1280px)": {
      left: "40px",
    },
  },
});

type IOutlineEditorInnerProps = IStoreConsumerProps & WithStyles<any>;

class OutlineEditorInner extends React.Component<IOutlineEditorInnerProps> {
  @observable private potentialDropTarget: IPotentialDropTarget | null = null;

  private nodes: any[] = [];

  get outline() {
    return this.props.store!.outline!;
  }

  get visitState() {
    return this.props.store!.visitState!;
  }

  get flatNodeList() {
    return this.props.store!.visitState!.flatList;
  }

  public componentDidMount() {
    this.ensureNodeLength();
  }

  public componentDidUpdate() {
    this.ensureNodeLength();
  }

  @autobind
  public setPotentialDropTarget(pdt: IPotentialDropTarget) {
    this.potentialDropTarget = pdt;
  }

  public render(): React.ReactNode {
    const { classes } = this.props;
    return (
      <div className={classes!.root} key={this.outline.id}>
        <OutlineTitleEditor outline={this.outline} />
        {this.flatNodeList.map(({ node, level, isCollapsed }, index) => {
          return (
            <NodeEditor
              index={index}
              key={node.id}
              isCollapsed={isCollapsed}
              level={level}
              node={node}
              toggleCollapse={this.visitState.toggleCollapse}
              setPotentialDropTarget={this.setPotentialDropTarget}
              willDrop={this.dropLocationFor(node.id)}
              completeDrop={this.completeDrop}
              innerRef={this.registerNode(index)}
              focusUp={this.focusUp}
              focusDown={this.focusDown}
            />
          );
        })}
      </div>
    );
  }

  private getUnwrappedNodeAtIdx(idx: number) {
    let node = this.nodes[idx];
    if (node) node = node.getDecoratedComponentInstance();
    if (node) node = node.getDecoratedComponentInstance();
    return node || null;
  }

  @autobind
  private focusUp(curIdx: number) {
    const node = this.getUnwrappedNodeAtIdx(curIdx - 1);
    if (node) node.focus();
  }

  @autobind
  private focusDown(curIdx: number) {
    const node = this.getUnwrappedNodeAtIdx(curIdx + 1);
    if (node) node.focus();
  }

  private ensureNodeLength() {
    this.nodes.length = this.flatNodeList.length;
  }

  @decorate(memoize)
  private registerNode(idx: number) {
    return (el: any | null) => {
      this.nodes[idx] = el;
    };
  }

  @autobind
  private completeDrop(sourceId: string | null) {
    const pdt = this.potentialDropTarget;
    this.potentialDropTarget = null;
    if (!pdt || !sourceId) return;
    const target = this.outline.getNode(pdt.id);
    if (pdt.location === "above") {
      target.relocateBefore(sourceId);
    } else {
      target.relocateAfter(sourceId);
    }
  }

  private dropLocationFor(id: string) {
    if (!this.potentialDropTarget) return null;
    if (this.potentialDropTarget.id !== id) return null;
    return this.potentialDropTarget.location;
  }
}

export const OutlineEditor = InjectStyles(storeObserver(OutlineEditorInner));
