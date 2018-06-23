import React from "react";
import showdown from "showdown";
import { INote } from "../models/Note";
import { autobind } from "core-decorators";
import { observer } from "mobx-react";

import { computed } from "mobx";
import Paper from "@material-ui/core/Paper/Paper";
import { injectStore } from "../models/Store";
import { IStoreConsumerProps } from "../models/IProviderProps";
import { Editable } from "../utils/Editable";
import { CloseButton } from "./CloseButton";

interface IMarkdownEditorProps {
  note: INote;
}

type IMarkdownEditorInnerProps = IMarkdownEditorProps & IStoreConsumerProps;

export class MarkdownEditorInner extends React.Component<
  IMarkdownEditorInnerProps
> {
  public converter: showdown.Converter;

  private textArea: HTMLTextAreaElement | null = null;

  private mde: SimpleMDE | null = null;

  private editable: Editable;

  constructor(props: any) {
    super(props);
    this.converter = new showdown.Converter();
    this.editable = new Editable(this);
  }

  @computed
  get visitState() {
    return this.props.store.visitState!;
  }

  @computed
  get item() {
    return this.props.note;
  }

  @computed
  get htmlContent() {
    return this.converter.makeHtml(this.item.content);
  }

  public render() {
    if (!this.editable.isEditing) {
      return (
        <Paper
          onDoubleClick={this.editable.enableEditing}
          style={{
            overflow: "hidden",
            padding: "10px",
            minHeight: "45px",
            cursor: "pointer",
          }}
        >
          <div dangerouslySetInnerHTML={{ __html: this.htmlContent }} />
        </Paper>
      );
    }
    return (
      <div style={{ background: "white", position: "relative" }}>
        <CloseButton onClick={() => this.editable.disableEditing()} />
        <textarea ref={this.registerTextArea} />
      </div>
    );
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
      initialValue: this.item.content,
    });
    this.mde.codemirror.on("change", () => {
      this.item.setContent(this.mde!.value());
    });
  }
}

export const MarkdownEditor: React.ComponentType<
  IMarkdownEditorProps
> = injectStore(observer(MarkdownEditorInner));
