import React from "react"

import { Paper, StyledComponentProps } from "@material-ui/core"

import { NodeViewModel } from "../models/NodeViewModel"
import { observer } from "../../../node_modules/mobx-react"
import { withStyles } from "../helpers/type-overrides"
import { palette } from "../styles/theme"

const styles = {
    paper: {
        padding: "10px",
        borderRadius: 0,
    },
}

export const NodePaperWrapper = withStyles<keyof typeof styles, NodePresenterProps>(styles)(observer(({ classes, node, children }: NodePresenterProps) => (
    <Paper
        className={classes!.paper}
        style={{
            border: (node.isActive ? `1px solid ${palette.primary.light}` : null) as any,
        }}
    >
        {children}
    </Paper>
)));

NodePaperWrapper.displayName = 'NodePaperWrapper';

export interface NodePresenterProps extends StyledComponentProps<keyof typeof styles> {
    node: NodeViewModel
    children: any
}

@withStyles<keyof typeof styles, NodePresenterProps>(styles)
@observer
export class NodePresenter extends React.Component<NodePresenterProps> {
    render() {
        return (
            <NodePaperWrapper {...this.props} onDoubleClick={this.props.node.activateEditing}>
                {this.props.node.content}
            </NodePaperWrapper>
        )
    }
}
