import { Button, Paper, WithStyles, withStyles } from "@material-ui/core";
import { default as AddIcon } from "@material-ui/icons/Add";
import { autobind } from "core-decorators";
import keycode from "keycode";
import { observable } from "mobx";
import { observer } from "mobx-react";
import React from "react";
import { asyncComponent } from "react-async-component";
// @ts-ignore
import Octicon from "react-octicon";
import ReactQuill from "react-quill";

import { INode } from "../models/Outline";
import { IQuillEditorProps } from "./QuillEditor";

const QuillEditor = asyncComponent<IQuillEditorProps>({
  resolve: async () => (await import("./QuillEditor")).QuillEditor
});

interface INodeEditorProps {
  node: INode;
  level: number;
  toggleCollapse: (id: string) => void;
  isCollapsed: boolean;
}

const styles = {
  container: {
    paddingRight: "40px",
    outline: 0,
    "&:hover $editBubble, &:focus $editBubble, &:hover $foldControl, &:focus $foldControl": {
      display: "block"
    },
    "&:focus $paper": {
      border: "1px solid #9473cd"
    }
  },
  paper: {
    position: "relative" as "relative",
    borderRadius: 0,
    cursor: "pointer",
    minHeight: "45px",
    "& .ql-tooltip": {
      zIndex: 1000
    }
  },
  editor: {
    zIndex: 1
  },
  collapseControl: {
    position: "absolute" as "absolute",
    left: "-35px",
    top: "7px",
    fontSize: "2rem",
    color: "silver"
  },
  foldControl: {
    display: "none"
  },
  unfoldControl: {
    display: "block"
  },
  editBubble: {
    minWidth: "0px",
    position: "absolute" as "absolute",
    left: "5px",
    bottom: "-20px",
    width: "30px",
    height: "30px",
    lineHeight: "20px",
    minHeight: "0",
    padding: "0",
    zIndex: 100,
    display: "none"
  }
};

@observer
class NodeEditorInner extends React.Component<
  INodeEditorProps & WithStyles<keyof typeof styles>
> {
  private editor: ReactQuill | null = null;

  @observable private isEditing = false;

  public render() {
    const { classes } = this.props;
    return (
      <div
        style={{
          paddingLeft: 40 + this.props.level * 20 + "px"
        }}
        className={classes.container}
        onKeyDown={this.handleKeyDown}
        tabIndex={0}
        onDoubleClick={this.enableEditing}
      >
        <Paper className={classes.paper}>
          {this.props.node.children.length > 0 && (
            <Octicon
              name={this.props.isCollapsed ? "unfold" : "fold"}
              className={`${classes.collapseControl} ${
                this.props.isCollapsed
                  ? classes.unfoldControl
                  : classes.foldControl
              }`}
              onClick={this.toggleCollapse}
            />
          )}
          {this.renderContent()}
          <Button
            variant="fab"
            color="primary"
            size="small"
            className={classes.editBubble}
            onClick={this.props.node.addSibling}
          >
            <AddIcon />
          </Button>
        </Paper>
      </div>
    );
  }

  @autobind
  private toggleCollapse() {
    this.props.toggleCollapse(this.props.node.id);
  }

  @autobind
  private enableEditing() {
    this.isEditing = true;
  }
  private renderContent() {
    const { node, classes } = this.props;
    if (this.isEditing) {
      return (
        <QuillEditor
          theme="bubble"
          forwardedRef={this.registerEditor}
          value={node.content}
          onChange={this.handleChange}
          className={classes.editor}
        />
      );
    }
    return (
      <div
        style={{ padding: "12px 15px" }}
        dangerouslySetInnerHTML={{ __html: node.content }}
      />
    );
  }

  @autobind
  private handleKeyDown(event: React.KeyboardEvent) {
    let handled = false;
    const { node } = this.props;
    switch (keycode(event.nativeEvent)) {
      case "enter":
        node.addSibling();
        handled = true;
        break;
      case "tab":
        if (event.shiftKey) {
          node.indentBackward();
        } else {
          node.indentForward();
        }
        handled = true;
        break;
      case "esc":
        this.isEditing = false;
        handled = true;
        break;
    }
    if (handled) {
      event.stopPropagation();
      event.preventDefault();
    }
  }

  @autobind
  private registerEditor(editor: ReactQuill) {
    this.editor = editor;
    if (editor) {
      this.editor.focus();
    }
  }

  @autobind
  private handleChange(content: string) {
    this.props.node.setContent(content);
  }
}

export const NodeEditor = withStyles(styles)(NodeEditorInner);
