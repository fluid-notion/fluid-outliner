import * as React from "react"
import flow from "lodash/flow"
import { IStoreConsumerProps } from "../models/IProviderProps"
import { OutlineEditor } from "./OutlineEditor"
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

type IBodyInnerProps = IModalConsumerProps & { store: IStore }

const DrawerBody = asyncComponent({
    resolve: async () => (await import("./DrawerBody")).DrawerBody,
})

export class BodyInner extends React.Component<IBodyInnerProps> {
    @observable private isPreloading = true

    @observable private drawerOpen = false

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
            <>
                <Navbar toggleDrawer={this.toggleDrawer} />
                {this.drawerOpen && <DrawerBody />}
                {this.isPreloading ? (
                    <Loader />
                ) : (
                    this.outline && (
                        <>
                            <BodyErrorWrapper>
                                <OutlineEditor />
                            </BodyErrorWrapper>
                            <AppFooter />
                        </>
                    )
                )}
            </>
        )
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
