import {
  Button,
  Paper,
  WithStyles,
  withStyles,
  StyledComponentProps,
  Typography,
} from "@material-ui/core";
import { default as AddIcon } from "@material-ui/icons/Add";
import { autobind } from "core-decorators";
import keycode from "keycode";
import { observable, computed } from "mobx";
import { observer, Observer } from "mobx-react";
import React from "react";
import { asyncComponent } from "react-async-component";
import Octicon from "react-octicon";
import { Motion, spring } from "react-motion";

import {
  IDragSourceProps,
  IDropTargetProps,
  NodeDragSource,
  NodeDropTarget,
} from "../utils/NodeDnD";
import { INode } from "../models/Node";
import { palette } from "./styles/theme";
import { NodeActionToolbar } from "./NodeActionToolbar";
import { INote } from "../models/Note";

const RichTextEditor = asyncComponent({
  resolve: async () => (await import("./RichTextEditor")).RichTextEditor,
});
const MarkdownEditor = asyncComponent({
  resolve: async () => (await import("./MarkdownEditor")).MarkdownEditor,
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
  },
  notesContainer: {
    borderLeft: "2px solid silver",
  },
  paper: {
    outline: 0,
    position: "relative" as "relative",
    borderRadius: 0,
    cursor: "pointer",
    minHeight: "45px",
    borderLeft: "2px solid transparent",
    "& .ql-tooltip": {
      zIndex: 1000,
    },
    "&:hover $foldControl, &:hover $grabber": {
      display: "block",
    },
    "&:focus": {
      borderLeft: `2px solid ${palette.primary.main}`,
    },
  },
  collapseControl: {
    position: "absolute" as "absolute",
    left: "-35px",
    top: "7px",
    fontSize: "2rem",
    color: "silver",
  },
  foldControl: {
    // display: "none",
  },
  unfoldControl: {
    display: "block",
  },
  editBubble: {
    minWidth: "0px",
    position: "absolute" as "absolute",
    left: "5px",
    bottom: "0px",
    width: "30px",
    height: "30px",
    lineHeight: "20px",
    minHeight: "0",
    padding: "0",
    zIndex: 100,
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
  input: {
    border: 0,
    outline: 0,
    lineHeight: "45px",
    padding: "0 10px",
    flexGrow: 1,
  },
  inputContainer: {
    flexGrow: 1,
  },
  innerContainer: {
    display: "flex",
    flexDirection: "row" as "row",
    width: "100%",
    minHeight: "45px",
  },
  contentLine: {
    outline: 0,
    padding: "0 10px",
    textOverflow: "ellipsis",
    overflow: "hidden",
    lineHeight: "45px",
    whiteSpace: "nowrap" as "nowrap",
    flexGrow: 1,
  },
  icon: {
    lineHeight: "45px",
    fontSize: "1.5rem",
    padding: "0 10px",
    "&.octicon-star": {
      color: "red",
    },
    "&.octicon-bookmark": {
      color: "red",
      position: "relative" as "relative",
      top: "-10px",
    },
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
  private editor: HTMLInputElement | null = null;

  @observable private isEditing = false;
  @observable private areNotesVisible = false;

  private blurTimer: any;

  @computed
  get node() {
    return this.props.node;
  }

  @computed
  get notes() {
    return this.node.notes;
  }

  public render() {
    const { classes } = this.props;
    const paperStyles: any = {};
    if (this.props.willDrop) {
      paperStyles.borderColor = "red";
    }
    if (this.isEditing) {
      paperStyles.borderColor = "#9473cd";
    } else {
      paperStyles.cursor = "pointer";
    }
    return this.props.connectDropTarget(
      <div
        style={{
          paddingLeft: 40 + this.props.level * 40 + "px",
        }}
        className={classes.container}
      >
        {this.props.willDrop === "above" && <DropPlaceholder dir="down" />}
        <Motion
          style={{
            borderRadius: spring(this.isEditing ? 4 : 0),
            dist1: spring(this.isEditing ? 4 : 0),
            dist2: spring(this.isEditing ? 50 : 0),
            bkgOpacity: spring(this.isEditing ? 0.1 : 0),
            fgOpacity: spring(this.isEditing ? 1 : 0),
          }}
        >
          {s => (
            <Observer>
              {() => (
                <div
                  style={{
                    position: "relative",
                    borderRadius: `${s.borderRadius}px`,
                    margin: `${s.dist1}px 0`,
                    padding: `${s.dist1}px ${s.dist1}px ${s.dist2}px ${
                      s.dist1
                    }px`,
                    backgroundColor: `rgba(0,0,0,${s.bkgOpacity})`,
                  }}
                  onClick={this.isEditing ? this.clearBlurTimer : undefined}
                >
                  <Paper
                    className={classes.paper}
                    style={paperStyles}
                    tabIndex={0}
                    onKeyDown={this.handleKeyDown}
                    innerRef={this.registerContainer}
                  >
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
                    <div className={classes.innerContainer}>
                      {this.renderLeftMarkers()}
                      {this.renderContent()}
                      {this.renderRightMarkers()}
                    </div>
                  </Paper>
                  {this.areNotesVisible && this.renderNotes()}
                  {s.fgOpacity === 1 && (
                    <NodeActionToolbar
                      node={this.props.node}
                      showNotes={this.showNotes}
                    />
                  )}
                  {s.fgOpacity > 0 && (
                    <Button
                      variant="fab"
                      color="primary"
                      size="small"
                      style={{ opacity: s.fgOpacity }}
                      className={classes.editBubble}
                      onClick={this.props.node.addSibling}
                    >
                      <AddIcon />
                    </Button>
                  )}
                </div>
              )}
            </Observer>
          )}
        </Motion>
        {this.props.willDrop === "below" && <DropPlaceholder dir="up" />}
      </div>
    );
  }

  public focus() {
    this.clearBlurTimer();
    if (this.editor) this.editor.focus();
    else if (this.container) this.container.focus();
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
  private clearBlurTimer() {
    clearTimeout(this.blurTimer);
  }

  @autobind
  private handleBlur() {
    this.clearBlurTimer();
    this.blurTimer = setTimeout(this.disableEditing, 1000);
  }

  @autobind
  private disableEditing() {
    this.isEditing = false;
  }

  @autobind
  private enableEditing() {
    this.isEditing = true;
  }

  private renderMarkers(placement: string) {
    return this.node.markers
      .filter(m => m.placement === placement)
      .map(m => <Octicon name={m.icon} className={this.props.classes.icon} />);
  }

  private renderLeftMarkers() {
    return this.renderMarkers("left");
  }

  private renderRightMarkers() {
    const markers = this.renderMarkers("right");
    if (this.notes.length > 0) {
      return (
        <Octicon
          name="file"
          className={this.props.classes.icon}
          onClick={this.toggleNotesVisibility}
        />
      );
    }
    return markers;
  }

  @autobind
  showNotes() {
    this.areNotesVisible = true;
  }

  @autobind
  toggleNotesVisibility() {
    this.areNotesVisible = !this.areNotesVisible;
  }

  private renderNotes() {
    return (
      <div className={this.props.classes.notesContainer}>
        {this.props.node.notes.map(this.renderNote)}
      </div>
    );
  }

  @autobind
  private renderNote(note: INote) {
    if (note.format === "markdown") {
      return <MarkdownEditor key={note.id!} note={note} />;
    }
    if (note.format === "html") {
      return <RichTextEditor key={note.id!} note={note} />;
    }
    return null;
  }

  private renderContent() {
    const { node, classes } = this.props;
    if (this.isEditing) {
      return (
        <input
          ref={this.registerEditor}
          value={node.content}
          onChange={this.handleChange}
          className={classes.input}
          onBlur={this.handleBlur}
        />
      );
    }
    return (
      <Typography
        variant="body1"
        className={classes.contentLine}
        onDoubleClick={this.enableEditing}
        innerRef={this.registerContainer}
      >
        {node.content}
      </Typography>
    );
  }

  @autobind
  private handleKeyDown(event: React.KeyboardEvent) {
    let handled = false;
    const { node } = this.props;
    if (this.isEditing) {
      if (keycode(event.nativeEvent) === "esc") {
        this.isEditing = false;
        this.focus();
      }
      return;
    }
    switch (keycode(event.nativeEvent)) {
      case "esc":
        this.container!.blur();
        handled = true;
        break;
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
  private registerEditor(editor: HTMLInputElement | null) {
    this.editor = editor;
    if (this.editor) {
      this.focus();
    }
  }

  @autobind
  private handleChange(event: React.ChangeEvent<HTMLInputElement>) {
    this.props.node.setContent(event.currentTarget.value);
  }
}

export const NodeEditor: React.ComponentType<INodeEditorProps> = withStyles(
  styles
)(NodeDragSource(NodeDropTarget(NodeEditorInner))) as any; // TODO FIXME
