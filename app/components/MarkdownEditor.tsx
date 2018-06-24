import React from "react";
import showdown from "showdown";
import { INote } from "../models/Note";
import { autobind } from "core-decorators";
import { observer } from "mobx-react";

import { computed, autorun, IReactionDisposer } from "mobx";
import Paper from "@material-ui/core/Paper/Paper";
import { injectStore } from "../models/Store";
import { IStoreConsumerProps } from "../models/IProviderProps";
import { Editable } from "../utils/Editable";
import { CloseButton } from "./CloseButton";
import { IMaybe } from "../utils/UtilTypes";

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
  private disposeMDESync: IMaybe<IReactionDisposer>;

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

  get codemirror() {
    return this.mde && this.mde.codemirror;
  }

  get content() {
    return this.codemirror && this.codemirror.getValue();
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
        <CloseButton name="check" onClick={() => this.editable.disableEditing()} />
        <textarea ref={this.registerTextArea} />
      </div>
    );
  }

  @autobind
  private registerTextArea(el: HTMLTextAreaElement | null) {
    this.textArea = el;
    if (el) {
      this.setupEditor();
    } else if (this.disposeMDESync) {
      this.disposeMDESync();
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
    this.codemirror.on("change", () => {
      this.item.setContent(this.content!);
    });
    this.disposeMDESync = autorun(() => {
      if (this.content === this.item.content) return;
      this.codemirror.setValue(this.item.content);
    });
  }
}

export const MarkdownEditor: React.ComponentType<
  IMarkdownEditorProps
> = injectStore(observer(MarkdownEditorInner));
