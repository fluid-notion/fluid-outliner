import * as React from "react"
import flow from "lodash/flow"
import { IStoreConsumerProps } from "../models/IProviderProps"
import { OutlineEditor, OutlineEditorInner } from "./OutlineEditor"
import { IModalConsumerProps } from "./ModalContainer"
import { inject, observer } from "mobx-react"
import { observable, computed } from "mobx"
import { AppFooter } from "./AppFooter"
import { IStore } from "../models/Store"
import { Loader } from "./Loader"
import { Navbar } from "./NavBar"
import { autobind } from "core-decorators"
import { asyncComponent } from "react-async-component"
import { BodyErrorWrapper } from "./BodyErrorWrapper"
import { handleKeys, KbdEvt, withoutModifiers, withModifiers, wasOnCurrent } from "../utils/keyboard-handlers"

type IBodyInnerProps = IModalConsumerProps & { store: IStore }

const DrawerBody = asyncComponent({
    resolve: async () => (await import("./DrawerBody")).DrawerBody,
})

export class BodyInner extends React.Component<IBodyInnerProps> {
    @observable private isPreloading = true

    @observable private drawerOpen = false

    private outlineEditorRef = React.createRef<{wrappedInstance: OutlineEditorInner}>();
    private searchRef = React.createRef<any>();

    private handleKeys = handleKeys([
        {
            keys: [{key: "z", ctrl: true, shift: false}],
            if: this.hasOutline,
            handle: () => {
                this.outline!.undo();
            }
        },
        {
            keys: [{key: "z", ctrl: true, shift: true}],
            if: this.hasOutline,
            handle: () => this.outline!.redo()
        },
        {
            keys: [withoutModifiers("j"), withoutModifiers("enter")],
            unless: this.isAnyActive,
            handle: (event: KbdEvt) => {
                if (!wasOnCurrent(event)) return;
                const {current} = this.outlineEditorRef;
                if (!current) return;
                current.wrappedInstance.focusFirst();
            }
        },
        {
            keys: [withModifiers("s", ["ctrl"])],
            handle: () => {
                this.props.store!.saveFile();
            }
        },
        {
            keys: [withModifiers("f", ["ctrl"])],
            handle: () => {
                let input = this.searchRef.current;
                if (!input) return;
                input = input.input;
                if (!input) return;
                input.focus();
            }
        }
    ])

    @computed
    get outline() {
        return this.props.store!.outline
    }

    public componentDidMount() {
        this.props.store.restoreSaved().then(() => {
            this.isPreloading = false
            if (!this.outline) {
                this.props.modal.activate("FileSelectionDialog")
            }
        })
    }

    public componentDidUpdate() {
        if (!this.outline && !this.props.modal.activeModal) {
            this.props.modal.activate("FileSelectionDialog")
        }
    }

    public render() {
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
                <Navbar toggleDrawer={this.toggleDrawer} searchRef={this.searchRef} />
                {this.drawerOpen && <DrawerBody />}
                {this.isPreloading ? (
                    <Loader />
                ) : (
                    this.outline && (
                        <>
                            <BodyErrorWrapper>
                                <OutlineEditor innerRef={this.outlineEditorRef} />
                            </BodyErrorWrapper>
                            <AppFooter />
                        </>
                    )
                )}
            </div>
        )
    }
    
    @autobind
    private isAnyActive() {
        return this.props.store!.visitState!.isAnyActive;
    }

    @autobind
    private hasOutline() {
        return !!this.outline;
    }

    @autobind
    private toggleDrawer() {
        this.drawerOpen = !this.drawerOpen
    }
}

export const Body: React.ComponentType<{}> = flow(
    observer,
    inject(({ modal, store }: IModalConsumerProps & IStoreConsumerProps) => ({
        modal,
        store,
    }))
)(BodyInner)
