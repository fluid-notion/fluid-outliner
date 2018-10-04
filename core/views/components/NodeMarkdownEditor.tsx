import React from "react"
import { UnControlled as CodeMirror, IInstance } from "react-codemirror2"
import marked from "marked"
import uniqueId from "lodash/uniqueId"
import "codemirror/mode/markdown/markdown"
import "codemirror/lib/codemirror.css"
import "codemirror/theme/eclipse.css"

import { NodeEditorProps } from "./NodeEditor"
import { autobind } from "core-decorators"
import { NodeChange } from "../../models/document-data-types";

marked.setOptions({
    gfm: true,
    tables: true,
    breaks: false,
    sanitize: true,
})

export class NodeMarkdownEditor extends React.Component<NodeEditorProps> {

    editor!: IInstance
    changes: NodeChange[] = []

    render() {
        return (
            <CodeMirror
                value={this.props.defaultContent || ""}
                options={{
                    mode: "markdown",
                    theme: "eclipse",
                    lineNumbers: false,
                }}
                onBlur={this.handleBlur}
                ref={this.registerEditor}
            />
        )
    }

    @autobind
    private registerEditor(component: any) {
        this.editor = component ? component.editor : null
        if (this.editor) {
            this.editor.on("changes", this.handleChanges)
        }
    }

    @autobind
    // @ts-ignore
    handleChanges(instance: CodeMirror.Editor, changes: CodeMirror.EditorChangeLinkedList[]) {
        changes.forEach((change) => {
            const changeId = uniqueId("cm-")
            const startIndex = this.editor.indexFromPos(change.from)
            if (change.removed) {
                change.removed.forEach(removedStr => {
                    if (removedStr.length > 0) {
                        this.changes.push({
                            startIndex,
                            type: "delete",
                            count: removedStr.length,
                            message: `CodeMirror.Change(${changeId}): ${change.origin}`
                        })
                    }
                })
            }
            if (change.text) {
                change.text.forEach(insertedText => {
                    this.changes.push({
                        startIndex,
                        type: "insert",
                        count: insertedText.length,
                        str: insertedText,
                        message: `CodeMirror.Change(${changeId}): ${change.origin}`
                    })
                })
            }
        })
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
