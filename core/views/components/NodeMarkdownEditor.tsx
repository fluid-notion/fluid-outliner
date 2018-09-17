import React from "react"
import { UnControlled as CodeMirror, IInstance } from "react-codemirror2"
import marked from "marked"

import "codemirror/mode/markdown/markdown"
import "codemirror/lib/codemirror.css"
import "codemirror/theme/eclipse.css"
import { NodeEditorProps } from "./NodeEditor"
import { autobind } from "core-decorators"

marked.setOptions({
    gfm: true,
    tables: true,
    breaks: false,
    sanitize: true,
})

export class NodeMarkdownEditor extends React.Component<NodeEditorProps> {
    render() {
        return (
            <CodeMirror
                value={this.props.node.content || ""}
                options={{
                    mode: "markdown",
                    theme: "eclipse",
                    lineNumbers: false,
                }}
                onBlur={this.handleBlur}
            />
        )
    }

    @autobind
    handleBlur(editor: IInstance) {
        const content = editor.getValue()
        const output = marked(content)
        this.props.node.setContent(content, output)
        this.props.node.deactivateEditing()
    }
}

export default NodeMarkdownEditor
