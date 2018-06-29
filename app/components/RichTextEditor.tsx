import React from "react"
import { autobind } from "core-decorators"
import { INote } from "../models/Note"
import { observer } from "mobx-react"
import { asyncComponent } from "react-async-component"

import { computed } from "mobx"
import Paper from "@material-ui/core/Paper/Paper"
import { injectStore } from "../models/Store"
import { IStoreConsumerProps } from "../models/IProviderProps"
import { Editable } from "../utils/Editable"
import { CloseButton } from "./CloseButton"

const ReactQuill = asyncComponent({
    resolve: async () => {
        // @ts-ignore
        await import("react-quill/dist/quill.snow.css")
        return (await import("react-quill")).default
    },
}) as any

export interface IRichTextEditorProps {
    note: INote
}

export type IRichTextEditorInnerProps = IRichTextEditorProps &
    IStoreConsumerProps

export class RichTextEditorInner extends React.Component<
    IRichTextEditorInnerProps
> {
    private editorRef = React.createRef<import("react-quill")>()
    private editable: Editable

    constructor(props: IRichTextEditorInnerProps) {
        super(props)
        this.editable = new Editable(this)
    }

    @computed
    get item() {
        return this.props.note
    }

    @computed
    get htmlContent() {
        return this.item.content
    }

    public render() {
        if (!this.editable.isEditing) {
            return (
                <Paper
                    onDoubleClick={this.editable.enableEditing}
                    style={{
                        overflow: "hidden",
                        padding: "10px",
                        cursor: "pointer",
                    }}
                >
                    <div
                        dangerouslySetInnerHTML={{ __html: this.htmlContent }}
                        style={{ minHeight: "45px" }}
                    />
                </Paper>
            )
        }
        return (
            <div style={{ background: "white", position: "relative" }}>
                <CloseButton
                    name="check"
                    onClick={() => this.editable.disableEditing()}
                />
                <ReactQuill ref={this.editorRef} onChange={this.handleChange} />
            </div>
        )
    }

    @autobind
    private handleChange(content: string) {
        this.props.note.setContent(content)
    }
}

export const RichTextEditor: React.ComponentType<
    IRichTextEditorProps
> = injectStore(observer(RichTextEditorInner)) as any
