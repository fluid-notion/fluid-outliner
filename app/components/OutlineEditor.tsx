import { StyledComponentProps } from "@material-ui/core/styles"
import { autobind, decorate } from "core-decorators"
import React from "react"
import memoize from "lodash/memoize"
import { IStoreConsumerProps, IProviderProps } from "../models/IProviderProps"
import { NodeEditor } from "./NodeEditor"
import { OutlineTitleEditor } from "./OutlineTitleEditor"
// @ts-ignore
import { Container, Draggable } from "react-smooth-dnd"
import { OutlineActionToolbar } from "./OutlineActionToolbar"
import { withStyles } from "../utils/type-overrides";
import { observer, inject } from "mobx-react";

const styles = {
    root: {
        minHeight: "100%",
        position: "relative" as "relative",
        flexGrow: 1,
        flexShrink: 1,
        flexBasis: "1280px",
        padding: "40px 0"
    },
    nodeUnderDrag: {
        opacity: 0.5
    }
};

type IOutlineEditorProps = Partial<IStoreConsumerProps> & StyledComponentProps<keyof typeof styles>

@inject(({store}: IProviderProps) => ({store}))
@withStyles(styles)
@observer
export class OutlineEditor extends React.Component<IOutlineEditorProps> {
    private nodes: any[] = []

    get outline() {
        return this.props.store!.outline!
    }

    get visitState() {
        return this.props.store!.visitState!
    }

    get flatNodeList() {
        return this.props.store!.visitState!.flatList
    }

    public componentDidMount() {
        this.ensureNodeLength()
    }

    public componentDidUpdate() {
        this.ensureNodeLength()
    }

    public focusFirst() {
        const node = this.getUnwrappedNodeAtIdx(0);
        if (!node) return;
        node.focus();
    }

    public render(): React.ReactNode {
        const { classes } = this.props
        return (
            <div className={classes!.root} key={this.outline.id}>
                <OutlineActionToolbar
                    style={{
                        float: "right",
                        marginRight: "40px",
                        position: "relative",
                        top: "15px",
                    }}
                    outline={this.outline}
                />
                <OutlineTitleEditor outline={this.outline} />
                <Container
                    onDrop={this.handleDrop}
                    lockAxis="y"
                    onDragStart={this.handleDragStart}
                    onDragEnd={this.handleDragEnd}
                    dragClass={classes!.nodeUnderDrag}
                >
                    {this.flatNodeList.map(
                        ({ node, level, isCollapsed }, index) => {
                            return (
                                <Draggable key={node.id}>
                                    <NodeEditor
                                        index={index}
                                        key={node.id}
                                        isCollapsed={isCollapsed}
                                        level={level}
                                        node={node}
                                        toggleCollapse={
                                            this.visitState.toggleCollapse
                                        }
                                        innerRef={this.registerNode(index)}
                                        focusUp={this.focusUp}
                                        focusDown={this.focusDown}
                                    />
                                </Draggable>
                            )
                        }
                    )}
                </Container>
            </div>
        )
    }

    private getUnwrappedNodeAtIdx(idx: number) {
        let node = this.nodes[idx]
        if (node) node = node.wrappedInstance
        return node || null
    }

    @autobind
    private handleDragStart() {
        document.body.style.overflow = "hidden"
    }

    @autobind
    private handleDragEnd() {
        document.body.style.overflow = "auto"
    }

    @autobind
    private handleDrop(p: { addedIndex: number; removedIndex: number }) {
        const source = this.flatNodeList[p.removedIndex].node
        const targetIndex =
            p.removedIndex < p.addedIndex ? p.addedIndex + 1 : p.addedIndex
        if (this.flatNodeList[targetIndex]) {
            const target = this.flatNodeList[targetIndex].node
            source.relocateBefore(target)
        } else if (this.flatNodeList[targetIndex - 1]) {
            const target = this.flatNodeList[targetIndex - 1].node
            source.relocateAfter(target)
        }
    }

    @autobind
    private focusUp(curIdx: number, enableEditing = false) {
        const node = this.getUnwrappedNodeAtIdx(curIdx - 1)
        if (node) {
            node.focus()
            if (enableEditing) {
                node.editable.enableEditing()
            }
        }
    }

    @autobind
    private focusDown(curIdx: number, enableEditing = false) {
        const node = this.getUnwrappedNodeAtIdx(curIdx + 1)
        if (node) {
            node.focus()
            if (enableEditing) {
                node.editable.enableEditing()
            }
        }
    }

    private ensureNodeLength() {
        this.nodes.length = this.flatNodeList.length
    }

    @decorate(memoize)
    private registerNode(idx: number) {
        return (el: any | null) => {
            this.nodes[idx] = el
        }
    }
}

