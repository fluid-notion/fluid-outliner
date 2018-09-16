import React, { CSSProperties } from "react"

// @ts-ignore
import Octicon from "react-octicon"
import { withStyles } from "../helpers/type-overrides"
import { StyledComponentProps } from "@material-ui/core"
import { NodeViewModel } from "../models/NodeViewModel"
import { QuillToolbar } from "./QuillToolbar";

const styles = {
    container: {
    },

    iconRow: {
        display: "flex" as "flex",
        flexDirection: "row" as "row",
    },

    iconLink: {
        position: "relative" as "relative",
        display: "block",
        cursor: "pointer",
        borderRadius: "4px",
        border: "1px solid transparent",
        "&:hover": {
            fontWeight: "bold" as "bold",
        },
    },

    primaryIcon: {
        fontSize: "20px",
        lineHeight: "30px",
        paddingLeft: "5px",
    },

    group: {
        display: "flex",
        borderLeft: "1px solid rgba(0, 0, 0, 0.4)",
        borderRight: "1px solid rgba(0, 0, 0, 0.4)",
        "& + $group": {
            borderLeft: 0,
        },
    },

    groupLeaderIcon: {
        cursor: "not-allowed",
        opacity: 0.3,
    },

    groupInner: {
        display: "flex",
    },

    select: {
        background: "transparent",
        border: "1px solid silver",
        margin: "5px"
    }
}

interface NodeToolbarProps extends StyledComponentProps<keyof typeof styles> {
    node: NodeViewModel
    style?: CSSProperties | undefined
    isEditing: boolean
}

@withStyles<keyof typeof styles, NodeToolbarProps>(styles)
export class NodeToolbar extends React.Component<NodeToolbarProps> {
    public render() {
        const classes = this.props.classes!
        const { node } = this.props
        return (
            <div className={classes.container} style={this.props.style} >
                <div className={classes.iconRow}>
                    <a className={classes.iconLink} title="Edit Node" onClick={node.activateEditing}>
                        <Octicon name="pencil" className={`${classes.primaryIcon}`} />
                    </a>
                    <div className={classes.group}>
                        <Octicon name="plus" className={`${classes.primaryIcon} ${classes.groupLeaderIcon}`} />
                        <div className={classes.groupInner}>
                            <a
                                onClick={this.props.node.addSiblingNode}
                                className={classes.iconLink}
                                title="Add sibling node below"
                            >
                                <Octicon name="triangle-down" className={`${classes.primaryIcon}`} />
                            </a>
                            <a
                                onClick={this.props.node.addChildNode}
                                className={classes.iconLink}
                                title="Add child node"
                            >
                                <Octicon name="triangle-right" className={`${classes.primaryIcon}`} />
                            </a>
                        </div>
                    </div>
                    {(node.canShiftBackward || node.canShiftForward) && (
                        <div className={classes.group}>
                            <div className={classes.groupInner}>
                                {node.canShiftBackward && (
                                    <a
                                        onClick={node.shiftBackward}
                                        className={classes.iconLink}
                                        title="Shift node backward"
                                    >
                                        <Octicon name="arrow-left" className={classes.primaryIcon} />
                                    </a>
                                )}
                                {node.canShiftForward && (
                                    <a
                                        onClick={node.shiftForward}
                                        className={classes.iconLink}
                                        title="Shift node forward"
                                    >
                                        <Octicon name="arrow-right" className={classes.primaryIcon} />
                                    </a>
                                )}
                            </div>
                        </div>
                    )}
                    <a onClick={node.remove} className={classes.iconLink} title="Delete Node">
                        <Octicon name="trashcan" className={classes.primaryIcon} style={{ color: "red" }} />
                    </a>
                    <div className={classes.group}>
                        <Octicon name="file" className={`${classes.primaryIcon} ${classes.groupLeaderIcon}`} />
                        <div className={classes.groupInner}>
                            <select className={classes.select} onChange={(e) => {
                                debugger
                                node.setFormat(e.target.value);
                            }}>
                                <option value="text">Plain Text</option>
                                <option value="html">Rich Text (HTML)</option>
                                <option value="markdown">Markdown</option>
                                <option value="image">Image</option>
                            </select>
                        </div>
                    </div>
                    {this.props.isEditing && node.node.format === "html" && <QuillToolbar />}
                </div>
            </div>
        )
    }
}
