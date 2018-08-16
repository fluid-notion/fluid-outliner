import { StyledComponentProps } from "@material-ui/core"
import { observer } from "mobx-react"
import React from "react"
import { autobind } from "core-decorators"
import { observable } from "mobx"

import { NodeViewModel } from "../models/NodeViewModel"
import { withStyles } from "../helpers/type-overrides"
import { NodeFoldControls } from "./NodeFoldControls"

const styles = {
    container: {
        position: "relative" as "relative",
        outline: 0,
    },
    foldControl: {},
    unfoldControl: {},
    collapseControl: {
        position: "absolute" as "absolute",
        top: "7px",
        fontSize: "2rem",
        color: "silver",
        cursor: "pointer",
        opacity: 0.4,
        "&:hover": {
            opacity: 1
        }
    },
}

interface NodePresenterProps extends StyledComponentProps<keyof typeof styles> {
    node: NodeViewModel
    isActive?: boolean
    isEditing?: boolean
}

@withStyles<keyof typeof styles, NodePresenterProps>(styles)
@observer
export class NodeContainer extends React.Component<NodePresenterProps> {
    // @ts-ignore
    @observable private containerHeight = 0

    private containerRef = React.createRef<HTMLDivElement>()

    render() {
        const classes = this.props.classes!
        const distLeft = this.props.node.level * 20
        return (
            <div
                tabIndex={0}
                onFocus={this.onFocus}
                className={classes.container}
                ref={this.containerRef}
                style={{
                    paddingLeft: distLeft,
                }}
            >
                {this.props.node.hasChildren && (
                    <NodeFoldControls node={this.props.node} classes={this.props.classes} style={{ left: `${distLeft - 35}px` }} />
                )}
                {this.props.children}
            </div>
        )
    }

    componentDidMount() {
        this.syncContainerHeight()
    }

    componentDidUpdate() {
        this.syncContainerHeight()
    }

    private syncContainerHeight() {
        const { height } = this.containerRef.current!.getBoundingClientRect()
        this.containerHeight = height
    }

    @autobind
    private onFocus() {
        this.props.node.outline.setActive(this.props.node.id);
    }
}
