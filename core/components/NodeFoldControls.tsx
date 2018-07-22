import React from "react"
import Octicon from "react-octicon"
import { Tooltip } from "@material-ui/core"

interface INodeFoldControlsProps {
    isCollapsed: boolean
    classes: any
    toggleCollapse: () => any
}

export const NodeFoldControls = (props: INodeFoldControlsProps) => (
    <Tooltip
        title={props.isCollapsed ? "Expand this node" : "Collapse this node"}
    >
        <Octicon
            name={props.isCollapsed ? "unfold" : "fold"}
            className={`${props.classes!.collapseControl} ${
                props.isCollapsed
                    ? props.classes!.unfoldControl
                    : props.classes!.foldControl
            }`}
            onClick={props.toggleCollapse}
        />
    </Tooltip>
)
