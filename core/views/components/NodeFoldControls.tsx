import React, { CSSProperties } from "react"
import Octicon from "react-octicon"
import { Tooltip } from "@material-ui/core"
import { NodeViewModel } from "../models/NodeViewModel"

interface INodeFoldControlsProps {
    node: NodeViewModel
    classes: any
    style?: CSSProperties
}

export const NodeFoldControls = (props: INodeFoldControlsProps) => (
    <Tooltip title={props.node.isCollapsed ? "Expand this node" : "Collapse this node"}>
        <Octicon
            name={props.node.isCollapsed ? "unfold" : "fold"}
            className={`${props.classes!.collapseControl} ${
                props.node.isCollapsed ? props.classes!.unfoldControl : props.classes!.foldControl
            }`}
            onClick={props.node.toggleCollapse}
            style={props.style}
        />
    </Tooltip>
)
