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
import { SwitchSlider } from "./SwitchSlider";
import { storeObserver } from "../models/Store";
import { IStoreConsumerProps } from "../models/IProviderProps";
import { Editable } from "../utils/Editable";
import { handleKeys } from "../utils/keyboard-handlers";

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
  focusUp: (idx: number, enableEditing?: boolean) => void;
  focusDown: (idx: number, enableEditing?: boolean) => void;
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
    left: "10px",
    bottom: "10px",
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
  IStoreConsumerProps &
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

  @observable private areNotesVisible = false;

  private blurTimer: any;
  private editable: Editable;

  private handleKeyDown = handleKeys({
    esc: {
      handle: () => {
        if (this.editable.isEditing) {
          this.editable.disableEditing();
          this.container!.focus();
        } else {
          this.container!.blur();
        }
      },
    },
    enter: (event: React.KeyboardEvent) => {
      if (event.shiftKey || this.editable.isEditing) {
        const node = this.item.addSibling();
        this.editable.visitState.activateItem(node);
      } else {
        this.editable.enableEditing();
      }
    },
    delete: {
      unless: () => this.editable.isEditing,
      handle: () => {
        this.item.outline.removeNode(this.item.id);
      },
    },
    tab: (event: React.KeyboardEvent) => {
      if (event.shiftKey) {
        this.item.indentBackward();
      } else {
        this.item.indentForward();
      }
    },
    up: {
      handle: (event: React.KeyboardEvent) => {
        if (event.ctrlKey) {
          if (!this.props.isCollapsed) {
            this.props.toggleCollapse(this.item.id);
          }
        } else if (event.shiftKey) {
          this.item.moveUp();
        } else {
          this.props.focusUp(this.props.index, this.editable.isEditing);
        }
      },
    },
    down: (event: React.KeyboardEvent) => {
      if (event.ctrlKey) {
        if (this.props.isCollapsed) {
          this.props.toggleCollapse(this.item.id);
        }
      } else if (event.shiftKey) {
        this.item.moveDown();
      } else {
        this.props.focusDown(this.props.index, this.editable.isEditing);
      }
    },
  });

  constructor(props: INodeEditorInnerProps) {
    super(props);
    this.editable = new Editable(this);
  }

  @computed
  get visitState() {
    return this.props.store.visitState!;
  }

  @computed
  get item() {
    return this.props.node;
  }

  @computed
  get notes() {
    return this.item.notes;
  }

  public render() {
    const { classes } = this.props;
    const paperStyles: any = {};
    if (this.props.willDrop) {
      paperStyles.borderColor = "red";
    }
    if (this.editable.isEditing) {
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
            borderRadius: spring(this.editable.isEditing ? 4 : 0),
            dist1: spring(this.editable.isEditing ? 4 : 0),
            dist2: spring(this.editable.isEditing ? 50 : 0),
            bkgOpacity: spring(this.editable.isEditing ? 0.1 : 0),
            fgOpacity: spring(this.editable.isEditing ? 1 : 0),
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
                  onClick={
                    this.editable.isEditing ? this.clearBlurTimer : undefined
                  }
                >
                  <div
                    className={classes.paper}
                    style={paperStyles}
                    tabIndex={0}
                    onKeyDown={
                      this.editable.isEditing ? undefined : this.handleKeyDown
                    }
                    ref={this.registerContainer}
                  >
                    <Paper>
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
                  </div>
                  {this.areNotesVisible && this.renderNotes()}
                  {s.fgOpacity === 1 && (
                    <NodeActionToolbar
                      visitState={this.props.store.visitState!}
                      node={this.props.node}
                      showNotes={this.showNotes}
                    />
                  )}
                  {s.fgOpacity > 0 && (
                    <Button
                      variant="fab"
                      color="primary"
                      size="small"
                      style={{
                        opacity: s.fgOpacity,
                      }}
                      className={classes.editBubble}
                      onClick={this.handleEditBubbleClick}
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
  private handleEditBubbleClick() {
    const node = this.props.node.addSibling();
    this.editable.visitState.activateItem(node);
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
    this.blurTimer = setTimeout(() => this.editable.disableEditing(), 1000);
  }

  private renderMarkers(placement: string) {
    return this.item.markers
      .filter(m => m.placement === placement)
      .map(m => (
        <Octicon
          name={m.icon}
          key={m.id!}
          className={this.props.classes.icon}
        />
      ));
  }

  private renderLeftMarkers() {
    return this.renderMarkers("left");
  }

  private renderRightMarkers() {
    const markers = this.renderMarkers("right");
    if (this.notes.length > 0) {
      markers.push(
        <SwitchSlider
          key="note-marker"
          isOn={this.areNotesVisible}
          onToggle={this.toggleNotesVisibility}
          label={this.notes.length}
        />
      );
    }
    return markers;
  }

  @autobind
  private showNotes() {
    this.areNotesVisible = true;
  }

  @autobind
  private toggleNotesVisibility() {
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
    if (this.editable.isEditing) {
      return (
        <input
          ref={this.registerEditor}
          value={node.content}
          onChange={this.handleChange}
          className={classes.input}
          onBlur={this.handleBlur}
          onKeyDown={this.handleKeyDown}
        />
      );
    }
    return (
      <Typography
        variant="body1"
        className={classes.contentLine}
        onDoubleClick={this.editable.enableEditing}
        innerRef={this.registerContainer}
      >
        {node.content}
      </Typography>
    );
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
)(NodeDragSource(NodeDropTarget(storeObserver(NodeEditorInner)))) as any; // TODO FIXME
