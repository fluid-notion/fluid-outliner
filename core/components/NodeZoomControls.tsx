import React from "react"
import { Tooltip } from "@material-ui/core"
import ReplyAllIcon from "@material-ui/icons/ReplyAll"
import CenterFocusStrongIcon from "@material-ui/icons/CenterFocusStrong"
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
            <ReplyAllIcon
                className={props.classes.zoomControl}
                onClick={props.zoomOut}
            />
        </Tooltip>
    ) : (
        <Tooltip title="Zoom in to this node">
            <CenterFocusStrongIcon
                className={props.classes.zoomControl}
                onClick={props.zoomIn}
            />
        </Tooltip>
    )
