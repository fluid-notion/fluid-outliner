import React from "react"
import { INodeEditorProps } from "./NodeEditor"
import { Paper } from "@material-ui/core"

export const NodePlaceholder = ({ node, level }: INodeEditorProps) => (
    <div
        style={{
            paddingLeft: 40 + level * 40 + "px",
        }}
    >
        <Paper>
            <div
                style={{ padding: "12px 15px" }}
                className="ql-container ql-editor"
                dangerouslySetInnerHTML={{ __html: node.content }}
            />
        </Paper>
    </div>
)
