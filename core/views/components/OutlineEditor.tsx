import React from "react"
import { observer } from "mobx-react"
import Scrollbars, { positionValues } from "react-custom-scrollbars"

import { OutlineViewModel } from "../models/OutlineViewModel"
import { withStyles } from "../helpers/type-overrides"
import { StyledComponentProps } from "@material-ui/core"
import { autobind } from "../../../node_modules/core-decorators"
import { TitleEditor } from "./TitleEditor"
import { NodeToolbar } from "./NodeToolbar"
import { NodeEditor } from "./NodeEditor"

const styles = {
    header: {
        display: "flex",
        flexDirection: "row" as "row",
    },
    titleContainer: {
        textAlign: "left" as "left",
        flexGrow: 2,
    },
    outerContainer: {
        background: "#F2F2F2",
        position: "absolute" as "absolute",
        top: "40px",
        left: "0px",
        right: "0px",
        bottom: "0px",
    },
    innerContainer: {
        margin: "auto",
        maxWidth: "1280px",
        padding: "40px 0",
    },
}

interface OutlineEditorProps extends StyledComponentProps<keyof typeof styles> {
    outline: OutlineViewModel
}

@withStyles<keyof typeof styles, OutlineEditorProps>(styles)
@observer
export class OutlineEditor extends React.Component<OutlineEditorProps> {
    private scrollerRef = React.createRef<Scrollbars>()
    private containerRef = React.createRef<HTMLDivElement>()
    private outerContainerRef = React.createRef<HTMLDivElement>()

    public render() {
        const classes = this.props.classes!
        const { outline } = this.props
        const activeId = outline.activeNode && outline.activeNode.id
        return (
            <div>
                <header className={classes.header}>
                    <div className={classes.titleContainer}>
                        <TitleEditor outline={this.props.outline} />
                    </div>
                    {outline.activeNode && (
                        <NodeToolbar node={outline.activeNode} isEditing={outline.nodeUnderEdit === activeId} />
                    )}
                </header>
                <div ref={this.outerContainerRef} className={classes.outerContainer}>
                    <Scrollbars ref={this.scrollerRef} onScrollFrame={this.syncScrollState}>
                        <div className={classes.innerContainer} ref={this.containerRef}>
                            {outline.visibleNodes.map(node => <NodeEditor key={node.id} node={node} />)}
                        </div>
                    </Scrollbars>
                </div>
            </div>
        )
    }

    componentDidMount() {
        const rect = this.outerContainerRef.current!.getBoundingClientRect()
        this.props.outline.outlineVisitStateProxy.setContainerBounds({
            height: rect.height,
            width: rect.width,
        })
    }

    @autobind
    private syncScrollState({ scrollTop }: positionValues) {
        this.props.outline.outlineVisitStateProxy.setScrollTop(scrollTop)
    }
}
