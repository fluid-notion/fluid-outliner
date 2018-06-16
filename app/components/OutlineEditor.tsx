import { withStyles, WithStyles } from "@material-ui/core/styles";
import { autobind } from "core-decorators";
import { observable } from "mobx";
import React from "react";
import { IStoreConsumerProps } from "../models/IProviderProps";
import { storeObserver } from "../models/Store";
import { IPotentialDropTarget, NodeEditor } from "./NodeEditor";
import { OutlineTitleEditor } from "./OutlineTitleEditor";

const InjectStyles = withStyles({
  root: {
    minHeight: "100%",
    maxWidth: "1200px",
    margin: "90px auto",
    padding: "0"
  }
});

class OutlineEditorInner extends React.Component<
  IStoreConsumerProps & WithStyles<any>
> {
  @observable private potentialDropTarget: IPotentialDropTarget | null = null;

  get outline() {
    return this.props.store!.outline!;
  }

  get visitState() {
    return this.props.store!.visitState!;
  }

  @autobind
  public setPotentialDropTarget(pdt: IPotentialDropTarget) {
    this.potentialDropTarget = pdt;
  }

  public render(): React.ReactNode {
    const { store, classes } = this.props;
    return (
      <div className={classes!.root} key={this.outline.id}>
        <OutlineTitleEditor outline={this.outline} />
        {store!.visitState!.flatList.map(
          ({ node, level, isCollapsed }, index) => {
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
              />
            );
          }
        )}
      </div>
    );
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
