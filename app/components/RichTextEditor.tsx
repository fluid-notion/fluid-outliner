import React from "react";
import ReactQuill from "react-quill";
import { autobind } from "core-decorators";
import { INote } from "../models/Note";
import { observer } from "mobx-react";

import "react-quill/dist/quill.snow.css";
import { observable, computed } from "mobx";
import Paper from "@material-ui/core/Paper/Paper";

@observer
export class RichTextEditor extends React.Component<{ note: INote }> {
  private editorRef = React.createRef<ReactQuill>();
  @observable private isEditing = false;
  @computed
  get note() {
    return this.props.note;
  }
  @computed
  get htmlContent() {
    return this.note.content;
  }
  public render() {
    if (!this.isEditing) {
      return (
        <Paper
          onDoubleClick={this.handleDoubleClick}
          style={{ overflow: "hidden", padding: "10px" }}
        >
          <div
            dangerouslySetInnerHTML={{ __html: this.htmlContent }}
            style={{ minHeight: "45px" }}
          />
        </Paper>
      );
    }
    return <ReactQuill ref={this.editorRef} onChange={this.handleChange} />;
  }
  @autobind
  private handleDoubleClick() {
    this.isEditing = true;
  }

  @autobind
  private handleChange(content: string) {
    this.props.note.setContent(content);
  }
}
