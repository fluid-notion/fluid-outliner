import React from "react"
import { autobind, decorate } from "core-decorators"
import { observable } from "mobx"
import memoize from "lodash/memoize"
import { observer, Provider } from "mobx-react"
import { IModalKey, IModalFacade, ModalRegistry } from "../utils/ModalRegistry"

@observer
export class ModalContainer extends React.Component {
    @observable private activeModal: IModalKey | null = null
    private activeModalStack: IModalKey[] = []

    public render() {
        return (
            <Provider modal={this.getModalFacade()}>
                <>
                    {this.renderActiveModal()}
                    {this.props.children}
                </>
            </Provider>
        )
    }
    @decorate(memoize)
    private getModalFacade(): IModalFacade {
        return {
            activeModal: this.activeModal,
            activate: this.activateModal,
            dismiss: this.dismissModal,
        }
    }
    @autobind
    private activateModal(activeModal: IModalKey, retainPrev = false) {
        if (retainPrev && this.activeModal) {
            this.activeModalStack.push(this.activeModal)
        } else {
            this.activeModalStack = []
        }
        this.activeModal = activeModal
    }
    private renderActiveModal() {
        if (!this.activeModal) {
            return null
        }
        const Modal = ModalRegistry[this.activeModal]
        return <Modal modal={this.getModalFacade()} />
    }
    @autobind
    private dismissModal() {
        const prevModal = this.activeModalStack.pop()
        this.activeModal = prevModal || null
    }
}

export * from "../utils/ModalRegistry"
