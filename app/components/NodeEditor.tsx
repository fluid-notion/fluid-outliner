import { Button, Paper } from "@material-ui/core";
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

@observer
export class NodeEditor extends React.Component<INodeEditorProps> {
  private editor: ReactQuill | null = null;

  @observable private isEditing = false;
  @observable private isActive = false;

  public render() {
    return (
      <div
        style={{
          paddingLeft: 40 + this.props.level * 20 + "px",
          paddingRight: "40px"
        }}
        onMouseEnter={this.handleMouseEnter}
        onMouseLeave={this.handleMouseLeave}
        onKeyDown={this.handleKeyDown}
        tabIndex={0}
        onDoubleClick={this.enableEditing}
      >
        <Paper
          style={{
            position: "relative",
            borderRadius: 0,
            cursor: "pointer",
            minHeight: "45px"
          }}
        >
          {this.isActive &&
            this.props.node.children.length > 0 && (
              <Octicon
                name={this.props.isCollapsed ? "unfold" : "fold"}
                style={{
                  position: "absolute",
                  left: "-35px",
                  top: "7px",
                  fontSize: "2rem",
                  color: "silver"
                }}
                onClick={this.toggleCollapse}
              />
            )}
          {this.renderContent()}
          {this.isActive && (
            <Button
              variant="fab"
              color="primary"
              size="small"
              style={{
                minWidth: "0px",
                position: "absolute",
                left: "5px",
                bottom: "-20px",
                width: "30px",
                height: "30px",
                lineHeight: "20px",
                minHeight: "0",
                padding: "0",
                zIndex: 100
              }}
              onClick={this.props.node.addSibling}
            >
              <AddIcon />
            </Button>
          )}
        </Paper>
      </div>
    );
  }

  @autobind
  private toggleCollapse() {
    this.props.toggleCollapse(this.props.node.id);
  }

  @autobind
  private handleMouseEnter() {
    this.isActive = true;
  }

  @autobind
  private handleMouseLeave() {
    if (this.editor) {
      const editor = this.editor.getEditor();
      if (editor && editor.hasFocus()) {
        return;
      }
    }
    this.isActive = false;
  }

  @autobind
  private handleBlur() {
    this.isActive = false;
  }

  @autobind
  private enableEditing() {
    this.isEditing = true;
  }
  private renderContent() {
    const { node } = this.props;
    if (this.isEditing) {
      return (
        <QuillEditor
          theme="bubble"
          forwardedRef={this.registerEditor}
          value={node.content}
          onChange={this.handleChange}
          onBlur={this.handleBlur}
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
