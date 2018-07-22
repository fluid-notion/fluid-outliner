import React from "react"
import { Icon, Tooltip } from "@material-ui/core"
import { INode } from "../models/Node"

interface INodeZoomControlsProps {
    node: INode
    isRoot: boolean
    zoomIn: () => void
    zoomOut: () => void
    classes: any
}

export const NodeZoomControls = (props: INodeZoomControlsProps) =>
    props.isRoot ? (
        <Tooltip title="Unzoom">
            <Icon className={props.classes.zoomControl} onClick={props.zoomOut}>
                reply_all
            </Icon>
        </Tooltip>
    ) : (
        <Tooltip title="Zoom in to this node">
            <Icon className={props.classes.zoomControl} onClick={props.zoomIn}>
                center_focus_strong
            </Icon>
        </Tooltip>
    )
