import * as React from "react"
import { IProviderProps } from "../models/IProviderProps"
import { OutlineEditor } from "./OutlineEditor"
import { observer, Observer } from "mobx-react"
import { observable, computed } from "mobx"
import { AppFooter } from "./AppFooter"
import { Loader } from "./Loader"
import { Navbar } from "./NavBar"
import { autobind } from "core-decorators"
import MediaQuery from "react-responsive"
import isNil from "lodash/isNil"
import { BodyErrorWrapper } from "./BodyErrorWrapper"
import {
    handleKeys,
    KbdEvt,
    withoutModifiers,
    withModifiers,
    wasOnCurrent,
} from "../utils/keyboard-handlers"
import { PrimaryDrawerMenu } from "./PrimaryDrawerMenu"
import { DrawerContainer } from "./containers"
import { SecondaryDrawerMenu } from "./SecondaryDrawerMenu"
import { ResourceRefList } from "./ResourceRefList"
import { KeyBindingsRefList } from "./KeyBindingsRefList"
import { SelectionOverview } from "./SelectionOverview"
import { injectStore } from "../models/Store"
import Scrollbars from "react-custom-scrollbars"
import { Redirect } from "react-router-dom"

type IBodyProps = Partial<IProviderProps>

@injectStore
@observer
export class Body extends React.Component<IBodyProps> {
    @observable private isPreloading = true

    @observable private drawerOpen = false

    private outlineEditorRef = React.createRef<OutlineEditor>()
    private searchRef = React.createRef<any>()
    private scrollerRef = React.createRef<Scrollbars>()
    private overviewRef = React.createRef<SelectionOverview>()

    private handleKeys = handleKeys([
        {
            keys: [{ key: "z", ctrl: true, shift: false }],
            if: this.hasOutline,
            handle: () => {
                this.outline!.undo()
            },
        },
        {
            keys: [{ key: "z", ctrl: true, shift: true }],
            if: this.hasOutline,
            handle: () => this.outline!.redo(),
        },
        {
            keys: [withoutModifiers("j"), withoutModifiers("enter")],
            unless: this.isAnyActive,
            handle: (event: KbdEvt) => {
                if (!wasOnCurrent(event)) return
                const { current } = this.outlineEditorRef
                if (!current) return
                current.focusFirst()
            },
        },
        {
            keys: [withModifiers("s", ["ctrl"])],
            handle: () => {
                this.props.store!.saveFile()
            },
        },
        {
            keys: [withModifiers("f", ["ctrl"])],
            handle: () => {
                let input = this.searchRef.current
                if (!input) return
                input = input.input
                if (!input) return
                input.focus()
            },
        },
    ])

    @computed
    get outline() {
        return this.props.store!.outline
    }

    // public componentDidMount() {
    //     this.props.store!.restoreSaved().then(() => {
    //         this.isPreloading = false
    //         if (!this.outline) {
    //             this.props.modal!.activate("FileSelectionDialog")
    //         }
    //     })
    // }
    //
    // public componentDidUpdate() {
    //     if (!this.outline && !this.props.modal!.activeModal) {
    //         this.props.modal!.activate("FileSelectionDialog")
    //     }
    // }

    public render() {
        if (!this.outline) {
            return <Redirect to="/welcome" />
        }
        return (
            <div
                style={{
                    position: "absolute",
                    left: 0,
                    right: 0,
                    top: 65,
                    bottom: 0,
                    overflow: "auto",
                }}
                tabIndex={0}
                onKeyDown={this.handleKeys}
            >
                <Navbar
                    toggleDrawer={this.toggleDrawer}
                    searchRef={this.searchRef}
                    drawerOpen={this.drawerOpen}
                />
                <Scrollbars ref={this.scrollerRef}>
                    <MediaQuery minWidth={1000}>
                        {(matches: boolean) =>
                            matches ? (
                                <Observer>
                                    {() => (
                                        <div
                                            style={{
                                                display: "flex",
                                                flexDirection: "row",
                                            }}
                                        >
                                            {this.drawerOpen ? (
                                                <DrawerContainer key="secondary-drawer">
                                                    <SecondaryDrawerMenu />
                                                    <KeyBindingsRefList />
                                                    <ResourceRefList />
                                                </DrawerContainer>
                                            ) : (
                                                <DrawerContainer key="primary-drawer">
                                                    <PrimaryDrawerMenu
                                                        scrollToNode={
                                                            this.scrollToNode
                                                        }
                                                    />
                                                </DrawerContainer>
                                            )}
                                            {this.renderBody()}
                                            <SelectionOverview
                                                ref={this.overviewRef}
                                            />
                                        </div>
                                    )}
                                </Observer>
                            ) : (
                                <Observer>
                                    {() =>
                                        this.drawerOpen ? (
                                            <DrawerContainer key="combined-drawer">
                                                <PrimaryDrawerMenu
                                                    scrollToNode={
                                                        this.scrollToNode
                                                    }
                                                />
                                                <SecondaryDrawerMenu />
                                                <KeyBindingsRefList />
                                                <ResourceRefList />
                                            </DrawerContainer>
                                        ) : (
                                            this.renderBody()
                                        )
                                    }
                                </Observer>
                            )
                        }
                    </MediaQuery>
                    {this.outline && <AppFooter />}
                </Scrollbars>
            </div>
        )
    }

    @autobind
    private scrollToNode(id: string) {
        const scroller = this.scrollerRef.current
        if (!scroller) return
        let top = this.getScrollTopOfNodeEditor(id)
        if (isNil(top)) return
        top -= 70
        if (top < 0) top = 0
        scroller.scrollTop(0)
        scroller.scrollTop(top)
    }

    private getScrollTopOfNodeEditor(id: string) {
        const editor = this.outlineEditorRef.current!.getNodeEditorForId(id)
        if (!editor) return null
        return editor.boundingRect!.top
    }

    private renderBody() {
        if (this.isPreloading) {
            return <Loader />
        }
        if (this.outline) {
            return (
                <BodyErrorWrapper>
                    <OutlineEditor
                        overviewRef={this.overviewRef}
                        innerRef={this.outlineEditorRef}
                        scrollerRef={this.scrollerRef}
                    />
                </BodyErrorWrapper>
            )
        }
        return null
    }

    @autobind
    private isAnyActive() {
        return this.props.store!.visitState!.isAnyActive
    }

    @autobind
    private hasOutline() {
        return !!this.outline
    }

    @autobind
    private toggleDrawer() {
        this.drawerOpen = !this.drawerOpen
    }
}
