import React from "react";
import showdown from "showdown";
import { INote } from "../models/Note";
import { autobind } from "core-decorators";
import { observer } from "mobx-react";


import { observable, computed } from "mobx";
import Paper from "@material-ui/core/Paper/Paper";

@observer
export class MarkdownEditor extends React.Component<{ note: INote }> {
  public converter: showdown.Converter;

  private textArea: HTMLTextAreaElement | null = null;

  private mde: SimpleMDE | null = null;

  @observable private isEditing = false;

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

  public render() {
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
      <div style={{background: "white"}}>
        <textarea ref={this.registerTextArea} />
      </div>
    );
  }

  @autobind
  private handleDoubleClick() {
    this.isEditing = true;
  }

  @autobind
  private registerTextArea(el: HTMLTextAreaElement | null) {
    this.textArea = el;
    if (el) {
        this.setupEditor();
    }
  }

    @autobind
    private async setupEditor() {
        // @ts-ignore
        await import("simplemde/dist/simplemde.min.css");
        const SimpleMDE = (await import("simplemde")).default;
      this.mde = new SimpleMDE({
        element: this.textArea!,
        initialValue: this.note.content,
      });
      this.mde.codemirror.on("change", () => {
        this.note.setContent(this.mde!.value());
      });
    }
}
