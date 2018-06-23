import React from "react";
import { asyncComponent } from "react-async-component";
import { autobind, decorate } from "core-decorators";
import { observable } from "mobx";
import memoize from "lodash/memoize";
import { observer, Provider } from "mobx-react";

const ModalRegistry = {
  FileSelectionDialog: asyncComponent({
    resolve: async () =>
      (await import("./FileSelectionDialog")).FileSelectionDialog,
  }),
  PrivacyDialog: asyncComponent({
    resolve: async () => (await import("./PrivacyDialog")).PrivacyDialog,
  }),
};

type IModalKey = keyof typeof ModalRegistry;

export interface IModalFacade {
  activeModal: IModalKey | null;
  activate: (m: IModalKey, retainPrev?: boolean) => void;
  dismiss: () => void;
}

export interface IModalConsumerProps {
  modal: IModalFacade;
}

@observer
export class ModalContainer extends React.Component {
  @observable private activeModal: IModalKey | null = null;
  private activeModalStack: IModalKey[] = [];

  public render() {
    return (
      <Provider modal={this.getModalFacade()}>
        <>
          {this.renderActiveModal()}
          {this.props.children}
        </>
      </Provider>
    );
  }
  @decorate(memoize)
  private getModalFacade(): IModalFacade {
    return {
      activeModal: this.activeModal,
      activate: this.activateModal,
      dismiss: this.dismissModal,
    };
  }
  @autobind
  private activateModal(activeModal: IModalKey, retainPrev = false) {
    if (retainPrev && this.activeModal) {
      this.activeModalStack.push(this.activeModal);
    } else {
      this.activeModalStack = [];
    }
    this.activeModal = activeModal;
  }
  private renderActiveModal() {
    if (!this.activeModal) {
      return null;
    }
    const Modal = ModalRegistry[this.activeModal];
    return <Modal />;
  }
  @autobind
  private dismissModal() {
    const prevModal = this.activeModalStack.pop();
    this.activeModal = prevModal || null;
  }
}
