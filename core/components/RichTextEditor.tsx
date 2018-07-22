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
})

export interface IRichTextEditorProps extends Partial<IStoreConsumerProps> {
    note: INote
}

@injectStore
@observer
export class RichTextEditor extends React.Component<IRichTextEditorProps> {
    private editable: Editable

    constructor(props: IRichTextEditorProps) {
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
            <div
                style={{ background: "white", position: "relative" }}
                className="non-draggable"
            >
                <CloseButton
                    name="check"
                    onClick={() => this.editable.disableEditing()}
                />
                <ReactQuill
                    onChange={this.handleChange}
                    value={this.htmlContent}
                />
            </div>
        )
    }

    @autobind
    private handleChange(content: string) {
        this.props.note.setContent(content)
    }
}
