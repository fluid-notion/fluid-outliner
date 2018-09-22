import React from "react"
import { StyledComponentProps } from "@material-ui/core"

import { observer } from "../../../node_modules/mobx-react"
import { withStyles } from "../helpers/type-overrides"
import { autobind } from "../../../node_modules/core-decorators"
import { NodeEditorProps } from "./NodeEditor";

const styles = {
    textField: {
        outline: 0,
        border: 0,
    },
}

export interface NodeTextEditorProps extends StyledComponentProps<keyof typeof styles>, NodeEditorProps {
}

@withStyles<keyof typeof styles, NodeTextEditorProps>(styles)
@observer
export class NodeTextEditor extends React.Component<NodeTextEditorProps> {
    textFieldRef = React.createRef<HTMLTextAreaElement>()

    componentDidMount() {
        this.textFieldRef.current!.focus()
    }

    render() {
        const { classes } = this.props
        return (
            <textarea
                defaultValue={this.props.defaultContent || ""}
                className={classes!.textField}
                ref={this.textFieldRef}
                style={{ width: "100%" }}
                onBlur={this.handleBlur}
            />
        )
    }

    @autobind
    private handleBlur(e: React.FocusEvent<HTMLTextAreaElement>) {
        this.props.node.setContent(e.target.value, e.target.value)
        this.props.node.deactivateEditing()
    }
}

export default NodeTextEditor
