import { withStyles, WithStyles } from "@material-ui/core/styles";
import React from "react";
import { IStoreConsumerProps } from "../models/IProviderProps";
import { storeObserver } from "../models/Store";
import { NodeEditor } from "./NodeEditor";
import { OutlineTitleEditor } from "./OutlineTitleEditor";

const InjectStyles = withStyles({
  root: {
    minHeight: "100%",
    margin: "90px 0",
    padding: "0"
  }
});

class OutlineEditorInner extends React.Component<
  IStoreConsumerProps & WithStyles<any>
> {
  get outline() {
    return this.props.store!.outline!;
  }

  get visitState() {
    return this.props.store!.visitState!;
  }

  public render(): React.ReactNode {
    const { store, classes } = this.props;
    return (
      <div className={classes!.root} key={this.outline.id}>
        <OutlineTitleEditor outline={this.outline} />
        {store!.visitState!.flatList.map(({ node, level, isCollapsed }) => {
          return (
            <NodeEditor
              key={node.id}
              isCollapsed={isCollapsed}
              level={level}
              node={node}
              toggleCollapse={this.visitState.toggleCollapse}
            />
          );
        })}
      </div>
    );
  }
}

export const OutlineEditor = InjectStyles(storeObserver(OutlineEditorInner));
