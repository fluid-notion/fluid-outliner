import React from "react";
import { autobind } from "core-decorators";
import { INote } from "../models/Note";
import { observer } from "mobx-react";
import {asyncComponent }from "react-async-component";

import { observable, computed } from "mobx";
import Paper from "@material-ui/core/Paper/Paper";

const ReactQuill = asyncComponent({
    resolve: async () => {
        // @ts-ignore
        await import("react-quill/dist/quill.snow.css");
        return (await import("react-quill")).default;
    }
})

@observer
export class RichTextEditor extends React.Component<{ note: INote }> {

    private editorRef = React.createRef<import("react-quill")>();

  @observable
  private isEditing = false;

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
    return <ReactQuill innerRef={this.editorRef} onChange={this.handleChange} />;
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
