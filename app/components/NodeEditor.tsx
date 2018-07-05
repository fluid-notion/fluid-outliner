import {
    Button,
    Paper,
    StyledComponentProps,
    Typography,
} from "@material-ui/core"
import { default as AddIcon } from "@material-ui/icons/Add"
import { autobind } from "core-decorators"
import { observable, computed } from "mobx"
import { observer, Observer } from "mobx-react"
import React from "react"
import { asyncComponent } from "react-async-component"
import Octicon from "react-octicon"
import { Motion, spring } from "react-motion"
// @ts-ignore
import Hammer from "react-hammerjs"
// @ts-ignore
import Highlighter from "react-highlight-words"

import { INode } from "../models/Node"
import { palette } from "./styles/theme"
import { NodeActionToolbar } from "./NodeActionToolbar"
import { INote } from "../models/Note"
import { SwitchSlider } from "./SwitchSlider"
import { IStoreConsumerProps } from "../models/IProviderProps"
import { Editable } from "../utils/Editable"
import {
    handleKeys,
    withoutModifiers,
    KbdEvt,
} from "../utils/keyboard-handlers"
import { withStyles } from "../utils/type-overrides"
import { injectStore } from "../models/Store"
import { NodeZoomControls } from "./NodeZoomControls"
import { NodeFoldControls } from "./NodeFoldControls"
import { SelectionOverview } from "./SelectionOverview"
import { Portal } from "react-overlays"
import { NotesOverview } from "./NotesOverview"

const RichTextEditor = asyncComponent({
    resolve: async () => (await import("./RichTextEditor")).RichTextEditor,
})

const MarkdownEditor = asyncComponent({
    resolve: async () => (await import("./MarkdownEditor")).MarkdownEditor,
})

export interface INodeEditorProps
    extends StyledComponentProps<keyof typeof styles>,
        Partial<IStoreConsumerProps> {
    node: INode
    level: number
    toggleCollapse: (id: string) => void
    isCollapsed: boolean
    index: number
    focusUp: (idx: number, enableEditing?: boolean) => void
    focusDown: (idx: number, enableEditing?: boolean) => void
    overviewRef: React.RefObject<SelectionOverview>
}

const styles = {
    container: {
        paddingRight: "40px",
    },
    notesContainer: {
        borderLeft: "10px solid #e8d6b4",
    },
    paper: {
        outline: 0,
        position: "relative" as "relative",
        borderRadius: 0,
        cursor: "pointer",
        minHeight: "45px",
        borderLeft: "2px solid transparent",
        "& .ql-tooltip": {
            zIndex: 1000,
        },
        "&:hover $foldControl": {
            display: "block",
        },
        "&:focus": {
            borderLeft: `2px solid ${palette.primary.main}`,
        },
    },
    collapseControl: {
        position: "absolute" as "absolute",
        left: "-35px",
        top: "7px",
        fontSize: "2rem",
        color: "silver",
    },
    zoomControl: {
        position: "absolute" as "absolute",
        right: "-40px",
        top: "7px",
        fontSize: "2rem",
        color: "silver",
    },
    foldControl: {
        // display: "none",
    },
    unfoldControl: {
        display: "block",
    },
    editBubble: {
        minWidth: "0px",
        position: "absolute" as "absolute",
        left: "10px",
        bottom: "10px",
        width: "30px",
        height: "30px",
        lineHeight: "20px",
        minHeight: "0",
        padding: "0",
        zIndex: 100,
        paddingTop: "2px",
    },
    grabber: {
        position: "relative" as "relative",
        top: "7px",
        color: "silver",
        fontSize: "2rem",
    },
    input: {
        border: 0,
        outline: 0,
        lineHeight: "45px",
        padding: "0 10px",
        flexGrow: 1,
    },
    inputContainer: {
        flexGrow: 1,
    },
    innerContainer: {
        display: "flex",
        flexDirection: "row" as "row",
        width: "100%",
        minHeight: "45px",
    },
    contentLine: {
        outline: 0,
        padding: "0 10px",
        textOverflow: "ellipsis",
        overflow: "hidden",
        lineHeight: "45px",
        whiteSpace: "nowrap" as "nowrap",
        flexGrow: 1,
    },
    icon: {
        lineHeight: "45px",
        fontSize: "1.5rem",
        padding: "0 10px",
        "&.octicon-star": {
            color: "red",
        },
        "&.octicon-bookmark": {
            color: "red",
            position: "relative" as "relative",
            top: "-10px",
        },
    },
}

@injectStore
@withStyles<keyof typeof styles, INodeEditorProps>(styles)
@observer
export class NodeEditor extends React.Component<INodeEditorProps> {
    public editable: Editable

    private container: HTMLDivElement | null = null
    private editor: HTMLInputElement | null = null
    private containerRef = React.createRef<HTMLDivElement>()

    @observable private areNotesVisible = false
    @observable private hasFocus = false

    private blurTimer: any

    public get node() {
        return this.props.node
    }

    public get isRoot() {
        return this.visitState.currentRoot === this.node
    }

    public get boundingRect() {
        const c = this.containerRef.current
        if (!c) return null
        return {
            left: c.offsetLeft,
            top: c.offsetTop,
        }
    }

    private handleKeyDown = handleKeys([
        {
            keys: ["esc"],
            handle: () => {
                if (this.editable.isEditing) {
                    this.editable.disableEditing()
                    this.container!.focus()
                } else {
                    this.container!.blur()
                }
            },
        },
        {
            keys: ["enter"],
            handle: (event: KbdEvt) => {
                if (event.shiftKey || this.editable.isEditing) {
                    const node = this.item.addSibling()
                    this.editable.visitState.activateItem(node)
                } else {
                    this.editable.enableEditing()
                }
            },
        },
        {
            keys: ["delete", "#"],
            unless: this.isEditing,
            handle: () => {
                this.item.outline.removeNode(this.item.id)
            },
        },
        {
            keys: [
                { key: "tab", shift: false },
                { ...withoutModifiers("l"), unless: this.isEditing },
                { ...withoutModifiers("right"), unless: this.isEditing },
            ],
            handle: () => {
                this.item.indentForward()
            },
        },
        {
            keys: [
                { key: "tab", shift: true },
                { ...withoutModifiers("h"), unless: this.isEditing },
                { ...withoutModifiers("right"), unless: this.isEditing },
            ],
            handle: () => {
                this.item.indentBackward()
            },
        },
        {
            keys: [withoutModifiers("k")],
            unless: this.isEditing,
            handle: this.focusUp,
        },
        {
            keys: ["up"],
            handle: (event: KbdEvt) => {
                if (event.ctrlKey) {
                    if (!this.props.isCollapsed) {
                        this.props.toggleCollapse(this.item.id)
                    }
                } else if (event.shiftKey) {
                    this.item.moveUp()
                } else {
                    this.focusUp()
                }
            },
        },
        {
            keys: [withoutModifiers("j")],
            unless: this.isEditing,
            handle: this.focusDown,
        },
        {
            keys: ["down"],
            handle: (event: KbdEvt) => {
                if (event.ctrlKey) {
                    if (this.props.isCollapsed) {
                        this.props.toggleCollapse(this.item.id)
                    }
                } else if (event.shiftKey) {
                    this.item.moveDown()
                } else {
                    this.focusDown()
                }
            },
        },
        {
            keys: [withoutModifiers("-")],
            handle: this.collapse,
            unless: this.isEditing,
        },
        {
            keys: [
                { ...withoutModifiers("+"), shift: undefined },
                { ...withoutModifiers("="), shift: undefined },
            ],
            handle: this.expand,
            unless: this.isEditing,
        },
        {
            keys: [withoutModifiers("z")],
            handle: this.zoomIn,
            unless: this.isEditing,
        },
        {
            keys: [{ ...withoutModifiers("z"), shift: true }],
            unless: this.isEditing,
            handle: this.zoomOut,
        },
    ])

    constructor(props: INodeEditorProps) {
        super(props)
        this.editable = new Editable(this)
    }

    @computed
    get visitState() {
        return this.props.store!.visitState!
    }

    @computed
    get searchQuery() {
        return this.visitState.searchQuery
    }

    @computed
    get item() {
        return this.node
    }

    @computed
    get notes() {
        return this.item.notes
    }

    get showNotesOverview() {
        return this.hasFocus && this.boundingRect && !this.areNotesVisible
    }

    public render() {
        const { classes } = this.props
        const paperStyles: any = {}
        if (this.editable.isEditing) {
            paperStyles.borderColor = "#9473cd"
        } else {
            paperStyles.cursor = "pointer"
        }
        return (
            <div
                style={{
                    paddingLeft: 40 + this.props.level * 40 + "px",
                    paddingTop: "0.5px",
                    paddingBottom: "0.5px",
                }}
                className={classes!.container}
                ref={this.containerRef}
            >
                <Motion
                    style={{
                        borderRadius: spring(this.editable.isEditing ? 4 : 0),
                        dist1: spring(this.editable.isEditing ? 4 : 0),
                        dist2: spring(this.editable.isEditing ? 50 : 0),
                        bkgOpacity: spring(this.editable.isEditing ? 0.1 : 0),
                        fgOpacity: spring(this.editable.isEditing ? 1 : 0),
                    }}
                >
                    {s => (
                        <Observer>
                            {() => (
                                <div
                                    style={{
                                        position: "relative",
                                        borderRadius: `${s.borderRadius}px`,
                                        margin: `${s.dist1}px 0`,
                                        padding: `${s.dist1}px ${s.dist1}px ${
                                            s.dist2
                                        }px ${s.dist1}px`,
                                        backgroundColor: `rgba(0,0,0,${
                                            s.bkgOpacity
                                        })`,
                                    }}
                                    onClick={
                                        this.editable.isEditing
                                            ? this.clearBlurTimer
                                            : undefined
                                    }
                                >
                                    <div
                                        className={`${classes!.paper}`}
                                        style={paperStyles}
                                        tabIndex={0}
                                        onFocus={() => (this.hasFocus = true)}
                                        onBlur={() => (this.hasFocus = false)}
                                        onKeyDown={
                                            this.editable.isEditing
                                                ? undefined
                                                : this.handleKeyDown
                                        }
                                        ref={this.registerContainer}
                                    >
                                        <Paper>
                                            {this.node.hasChildren && (
                                                <NodeFoldControls
                                                    isCollapsed={
                                                        this.props.isCollapsed
                                                    }
                                                    toggleCollapse={
                                                        this.toggleCollapse
                                                    }
                                                    classes={this.props.classes}
                                                />
                                            )}
                                            {(this.hasFocus || this.isRoot) && (
                                                <NodeZoomControls
                                                    node={this.node}
                                                    isRoot={this.isRoot}
                                                    zoomIn={this.zoomIn}
                                                    zoomOut={this.zoomOut}
                                                    classes={
                                                        this.props.classes!
                                                    }
                                                />
                                            )}
                                            <Hammer
                                                onSwipe={this.handleSwipe}
                                                onDoubleTap={
                                                    this.handleDoubleTap
                                                }
                                            >
                                                <div
                                                    className={
                                                        classes!.innerContainer
                                                    }
                                                >
                                                    {this.renderLeftMarkers()}
                                                    {this.renderContent()}
                                                    {this.renderRightMarkers()}
                                                </div>
                                            </Hammer>
                                        </Paper>
                                    </div>
                                    {this.areNotesVisible && this.renderNotes()}
                                    {s.fgOpacity === 1 && (
                                        <NodeActionToolbar
                                            visitState={
                                                this.props.store!.visitState!
                                            }
                                            node={this.node}
                                            showNotes={this.showNotes}
                                        />
                                    )}
                                    {s.fgOpacity > 0 && (
                                        <Button
                                            variant="fab"
                                            color="primary"
                                            size="small"
                                            style={{
                                                opacity: s.fgOpacity,
                                            }}
                                            className={classes!.editBubble}
                                            onClick={this.handleEditBubbleClick}
                                        >
                                            <AddIcon />
                                        </Button>
                                    )}
                                </div>
                            )}
                        </Observer>
                    )}
                </Motion>
                {this.showNotesOverview && (
                    <Portal container={this.props.overviewRef.current}>
                        <NotesOverview
                            notes={this.notes}
                            style={{
                                position: "absolute",
                                top: this.boundingRect!.top + 70,
                                right: "10px",
                                left: "0px",
                            }}
                        />
                    </Portal>
                )}
            </div>
        )
    }

    public focus() {
        this.clearBlurTimer()
        if (this.editor) this.editor.focus()
        else if (this.container) this.container.focus()
    }

    @autobind
    private zoomOut() {
        this.visitState.zoomOut()
    }

    @autobind
    private zoomIn() {
        this.visitState.zoomIn(this.node)
    }

    @autobind
    private handleSwipe(event: any) {
        if (event.deltaX > 100) {
            this.item.indentForward()
        } else if (event.deltaX < -100) {
            this.item.indentBackward()
        }
    }

    @autobind
    private handleEditBubbleClick() {
        let node
        if (this.visitState.currentRoot === this.node) {
            node = this.node.addChild()
        } else {
            node = this.node.addSibling()
        }
        this.editable.visitState.activateItem(node)
    }

    @autobind
    private registerContainer(el: HTMLDivElement | null) {
        this.container = el
    }

    @autobind
    private expand() {
        if (!this.props.isCollapsed) return
        this.toggleCollapse()
    }

    @autobind
    private collapse() {
        if (this.props.isCollapsed) return
        this.toggleCollapse()
    }

    @autobind
    private toggleCollapse() {
        this.props.toggleCollapse(this.node.id)
    }

    @autobind
    private clearBlurTimer() {
        clearTimeout(this.blurTimer)
    }

    @autobind
    private handleDoubleTap() {
        this.focus()
    }

    @autobind
    private handleBlur() {
        this.clearBlurTimer()
        this.blurTimer = setTimeout(() => this.editable.disableEditing(), 1000)
    }

    private renderMarkers(placement: string) {
        return this.item.markers
            .filter(m => m.placement === placement)
            .map(m => (
                <Octicon
                    name={m.icon}
                    key={m.id!}
                    className={this.props.classes!.icon}
                />
            ))
    }

    private renderLeftMarkers() {
        return this.renderMarkers("left")
    }

    private renderRightMarkers() {
        const markers = this.renderMarkers("right")
        if (this.notes.length > 0) {
            markers.push(
                <SwitchSlider
                    key="note-marker"
                    isOn={this.areNotesVisible}
                    onToggle={this.toggleNotesVisibility}
                    label={this.notes.length}
                />
            )
        }
        return markers
    }

    @autobind
    private showNotes() {
        this.areNotesVisible = true
    }

    @autobind
    private toggleNotesVisibility() {
        this.areNotesVisible = !this.areNotesVisible
    }

    private renderNotes() {
        return (
            <div className={this.props.classes!.notesContainer}>
                {this.node.notes.map(this.renderNote)}
            </div>
        )
    }

    @autobind
    private renderNote(note: INote) {
        if (note.format === "markdown") {
            return <MarkdownEditor key={note.id!} note={note} />
        }
        if (note.format === "html") {
            return <RichTextEditor key={note.id!} note={note} />
        }
        return null
    }

    private renderContent() {
        const { node, classes } = this.props
        if (this.editable.isEditing) {
            return (
                <input
                    ref={this.registerEditor}
                    value={node.content}
                    onChange={this.handleChange}
                    className={`${classes!.input} non-draggable`}
                    onBlur={this.handleBlur}
                    onKeyDown={this.handleKeyDown}
                />
            )
        }
        let content: React.ReactChild = node.content
        if (this.searchQuery.length > 0) {
            content = (
                <Highlighter
                    searchWords={[this.searchQuery]}
                    textToHighlight={content}
                />
            )
        }
        return (
            <Typography
                variant="body1"
                className={classes!.contentLine}
                onDoubleClick={this.editable.enableEditing}
                innerRef={this.registerContainer}
            >
                {content}
            </Typography>
        )
    }

    @autobind
    private registerEditor(editor: HTMLInputElement | null) {
        this.editor = editor
        if (this.editor) {
            this.focus()
        }
    }

    @autobind
    private handleChange(event: React.ChangeEvent<HTMLInputElement>) {
        this.node.setContent(event.currentTarget.value)
    }

    @autobind
    private isEditing() {
        return this.editable.isEditing
    }

    @autobind
    private focusDown() {
        this.props.focusDown(this.props.index, this.editable.isEditing)
    }

    @autobind
    private focusUp() {
        this.props.focusUp(this.props.index, this.editable.isEditing)
    }
}
