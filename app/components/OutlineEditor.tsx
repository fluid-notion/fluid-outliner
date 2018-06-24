import { withStyles, WithStyles } from "@material-ui/core/styles";
import { autobind, decorate } from "core-decorators";
import React from "react";
import memoize from "lodash/memoize";
import { IStoreConsumerProps } from "../models/IProviderProps";
import { storeObserver } from "../models/Store";
import { NodeEditor } from "./NodeEditor";
import { OutlineTitleEditor } from "./OutlineTitleEditor";
// @ts-ignore
import { Container, Draggable } from "react-smooth-dnd";

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

  public render(): React.ReactNode {
    const { classes } = this.props;
    return (
      <div className={classes!.root} key={this.outline.id}>
        <OutlineTitleEditor outline={this.outline} />
        <Container
          onDrop={this.handleDrop}
          dragHandleSelector=".js-node-editor-grabber"
          lockAxis="y"
          onDragStart={this.handleDragStart}
          onDragEnd={this.handleDragEnd}
        >
          {this.flatNodeList.map(({ node, level, isCollapsed }, index) => {
            return (
              <Draggable key={node.id}>
                <NodeEditor
                  index={index}
                  key={node.id}
                  isCollapsed={isCollapsed}
                  level={level}
                  node={node}
                  toggleCollapse={this.visitState.toggleCollapse}
                  innerRef={this.registerNode(index)}
                  focusUp={this.focusUp}
                  focusDown={this.focusDown}
                />
              </Draggable>
            );
          })}
        </Container>
      </div>
    );
  }

  private getUnwrappedNodeAtIdx(idx: number) {
    let node = this.nodes[idx];
    if (node) node = node.getDecoratedComponentInstance();
    if (node) node = node.getDecoratedComponentInstance();
    if (node) node = node.wrappedInstance;
    return node || null;
  }

  @autobind
  private handleDragStart() {
    document.body.style.overflow = "hidden";
  }

  @autobind
  private handleDragEnd() {
    document.body.style.overflow = "auto";
  }

  @autobind
  private handleDrop(p: { addedIndex: number; removedIndex: number }) {
    const source = this.flatNodeList[p.removedIndex].node;
    const targetIndex = p.removedIndex < p.addedIndex ? p.removedIndex + 1 : p.removedIndex;
    if (this.flatNodeList[targetIndex]) {
      const target = this.flatNodeList[targetIndex].node;
      source.relocateBefore(target);
    } else if (this.flatNodeList[targetIndex - 1]) {
      const target = this.flatNodeList[targetIndex].node;
      source.relocateAfter(target);
    }
  }

  @autobind
  private focusUp(curIdx: number, enableEditing = false) {
    const node = this.getUnwrappedNodeAtIdx(curIdx - 1);
    if (node) {
      node.focus();
      if (enableEditing) {
        node.editable.enableEditing();
      }
    }
  }

  @autobind
  private focusDown(curIdx: number, enableEditing = false) {
    const node = this.getUnwrappedNodeAtIdx(curIdx + 1);
    if (node) {
      node.focus();
      if (enableEditing) {
        node.editable.enableEditing();
      }
    }
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
}

export const OutlineEditor = InjectStyles(storeObserver(OutlineEditorInner));
