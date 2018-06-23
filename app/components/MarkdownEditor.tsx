import React from "react";
import showdown from "showdown";
import SimpleMDE from "simplemde";
import { INote } from "../models/Note";
import { autobind } from "core-decorators";
import { observer } from "mobx-react";

import "simplemde/dist/simplemde.min.css";
import { observable, computed } from "mobx";
import Paper from "@material-ui/core/Paper/Paper";

@observer
export class MarkdownEditor extends React.Component<{ note: INote }> {
  private textArea: HTMLTextAreaElement | null = null;
  private mde: SimpleMDE | null = null;
  @observable private isEditing = false;
  converter: showdown.Converter;
  constructor(props: any) {
    super(props);
    this.converter = new showdown.Converter();
  }
  @computed
  get note() {
    return this.props.note;
  }
  @computed
  get htmlContent() {
    return this.converter.makeHtml(this.note.content);
  }
  @autobind
  private handleDoubleClick() {
    this.isEditing = true;
  }
  render() {
    if (!this.isEditing) {
      return (
        <Paper
          onDoubleClick={this.handleDoubleClick}
          style={{ overflow: "hidden", padding: "10px", minHeight: "45px" }}
        >
          <div dangerouslySetInnerHTML={{ __html: this.htmlContent }} />
        </Paper>
      );
    }
    return (
      <div>
        <textarea ref={this.registerTextArea} />
      </div>
    );
  }

  @autobind
  private registerTextArea(el: HTMLTextAreaElement | null) {
    this.textArea = el;
    const { note } = this.props;
    if (el) {
      this.mde = new SimpleMDE({
        element: this.textArea!,
        initialValue: note.content,
      });
      this.mde.codemirror.on("change", () => {
        note.setContent(this.mde!.value());
      });
    }
  }
}
