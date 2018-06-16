import {
  Button,
  Paper,
  WithStyles,
  withStyles,
  StyledComponentProps,
} from "@material-ui/core";
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

import { IQuillEditorProps } from "./QuillEditor";

import "react-quill/dist/quill.bubble.css";
import {
  IDragSourceProps,
  IDropTargetProps,
  NodeDragSource,
  NodeDropTarget,
} from "../utils/NodeDnD";
import { INode } from "../models/Node";

const QuillEditor = asyncComponent<IQuillEditorProps>({
  resolve: async () => (await import("./QuillEditor")).QuillEditor,
});

export interface IPotentialDropTarget {
  id: string;
  location: "above" | "below";
}

export interface INodeEditorPrimaryProps {
  node: INode;
  level: number;
  toggleCollapse: (id: string) => void;
  isCollapsed: boolean;
  index: number;
  setPotentialDropTarget: (pdt: IPotentialDropTarget) => void;
  willDrop: "above" | "below" | null;
  completeDrop: (id: string | null) => void;
  focusUp: (idx: number) => void;
  focusDown: (idx: number) => void;
}

const styles = {
  container: {
    paddingRight: "40px",
    outline: 0,
    "&:hover $editBubble, &:hover $foldControl, &:hover $grabber": {
      display: "block",
    },
    "&:focus $paper": {
      borderColor: "#d7b2f5",
    },
  },
  paper: {
    position: "relative" as "relative",
    borderRadius: 0,
    cursor: "pointer",
    minHeight: "45px",
    border: "1px solid transparent",
    "& .ql-tooltip": {
      zIndex: 1000,
    },
  },
  editor: {
    zIndex: 1,
  },
  collapseControl: {
    position: "absolute" as "absolute",
    left: "-35px",
    top: "7px",
    fontSize: "2rem",
    color: "silver",
  },
  foldControl: {
    display: "none",
  },
  unfoldControl: {
    display: "block",
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
    display: "none",
    paddingTop: "2px",
  },
  grabber: {
    position: "absolute" as "absolute",
    right: "-45px",
    top: "7px",
    color: "silver",
    fontSize: "2rem",
    display: "none",
  },
};

export type INodeEditorProps = INodeEditorPrimaryProps &
  StyledComponentProps<keyof typeof styles>;

export type INodeEditorInnerProps = INodeEditorProps &
  WithStyles<keyof typeof styles> &
  IDragSourceProps &
  IDropTargetProps;

const DropPlaceholder = ({ dir }: { dir: "up" | "down" }) => (
  <div style={{ height: "30px" }}>
    <div
      style={{
        border: "1px solid silver",
        borderRadius: "4px",
        background: "#ddd",
        float: "right",
        color: "black",
        marginTop: "5px",
        paddingLeft: "5px",
      }}
    >
      <Octicon name={`triangle-${dir}`} />
    </div>
  </div>
);

@observer
export class NodeEditorInner extends React.Component<INodeEditorInnerProps> {
  private container: HTMLDivElement | null = null;
  private editor: ReactQuill | null = null;

  @observable private isEditing = false;

  public render() {
    const { classes } = this.props;
    const paperStyles: any = {};
    if (this.props.willDrop) {
      paperStyles.borderColor = "red";
    } else if (this.isEditing) {
      paperStyles.borderColor = "#9473cd";
    }
    return this.props.connectDropTarget(
      <div
        style={{
          paddingLeft: 40 + this.props.level * 40 + "px",
        }}
        className={classes.container}
        onKeyDown={this.handleKeyDown}
        tabIndex={0}
        onDoubleClick={this.enableEditing}
        ref={this.registerContainer}
      >
        {this.props.willDrop === "above" && <DropPlaceholder dir="down" />}
        <Paper className={classes.paper} style={paperStyles}>
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
          {this.props.connectDragSource(
            <span>
              <Octicon name="grabber" className={classes.grabber} />
            </span>
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
        {this.props.willDrop === "below" && <DropPlaceholder dir="up" />}
      </div>
    );
  }

  public focus() {
    if (this.container) this.container.focus();
  }

  @autobind
  private registerContainer(el: HTMLDivElement | null) {
    this.container = el;
  }

  @autobind
  private toggleCollapse() {
    this.props.toggleCollapse(this.props.node.id);
  }

  @autobind
  private disableEditing() {
    this.isEditing = false;
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
          onBlur={this.disableEditing}
        />
      );
    }
    return (
      <div
        style={{ padding: "12px 15px" }}
        className="ql-container ql-editor"
        dangerouslySetInnerHTML={{ __html: node.content }}
      />
    );
  }

  @autobind
  private handleKeyDown(event: React.KeyboardEvent) {
    let handled = false;
    const { node } = this.props;
    if (this.isEditing) {
      if (keycode(event.nativeEvent) === "esc") {
        this.isEditing = false;
        this.container!.focus();
      }
      return;
    }
    switch (keycode(event.nativeEvent)) {
      case "enter":
        if (event.shiftKey) {
          node.addSibling();
        } else {
          this.isEditing = true;
        }
        handled = true;
        break;
      case "delete":
        node.outline.removeNode(node.id);
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
      case "up":
        if (event.ctrlKey) {
          if (!this.props.isCollapsed) {
            this.props.toggleCollapse(node.id);
          }
        } else if (event.shiftKey) {
          node.moveUp();
        } else {
          this.props.focusUp(this.props.index);
        }
        handled = true;
        break;
      case "down":
        if (event.ctrlKey) {
          if (this.props.isCollapsed) {
            this.props.toggleCollapse(node.id);
          }
        } else if (event.shiftKey) {
          node.moveDown();
        } else {
          this.props.focusDown(this.props.index);
        }
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

export const NodeEditor: React.ComponentType<INodeEditorProps> = withStyles(
  styles
)(NodeDragSource(NodeDropTarget(NodeEditorInner))) as any; // TODO FIXME
