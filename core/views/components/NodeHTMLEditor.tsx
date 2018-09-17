import React from "react"
import ReactQuill from "react-quill"

import "react-quill/dist/quill.snow.css"
import { NodeEditorProps } from "./NodeEditor"
import { autobind } from "../../../node_modules/core-decorators"

export class NodeHTMLEditor extends React.Component<NodeEditorProps> {
    quillRef = React.createRef<ReactQuill>()

    render() {
        return (
            <ReactQuill
                defaultValue={this.props.node.content || ""}
                onBlur={this.handleBlur}
                theme="snow"
                ref={this.quillRef}
                modules={{
                    toolbar: {
                        container: ".quill-custom-toolbar",
                    },
                }}
            />
        )
    }

    @autobind
    handleBlur() {
        const content: string = (this.quillRef.current as any).getEditorContents()
        this.props.node.setContent(content, content)
    }
}

export default NodeHTMLEditor
