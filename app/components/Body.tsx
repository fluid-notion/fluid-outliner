import * as React from "react";
import flow from "lodash/flow";
import { IStoreConsumerProps } from "../models/IProviderProps";
import { OutlineEditor } from "./OutlineEditor";
import { IModalConsumerProps } from "./ModalContainer";
import { IOutline } from "../models/Outline";
import { inject, observer } from "mobx-react";
import { Divider } from "@material-ui/core";
import { AppFooter } from "./AppFooter";

type IBodyProps = IModalConsumerProps & { outline: IOutline | null };

export class BodyInner extends React.Component<IBodyProps> {
  public componentDidMount() {
    if (!this.props.outline) {
      this.props.modal.activate("FileSelectionDialog");
    }
  }
  public render() {
    const { outline } = this.props;
    return (
      <>
        {outline && <OutlineEditor />}
        <Divider/>
        <AppFooter/>
      </>
    );
  }
}

export const Body: React.ComponentType<{}> = flow(
  observer,
  inject(({ modal, store }: IModalConsumerProps & IStoreConsumerProps) => ({
    modal,
    outline: store!.outline,
  }))  
)(BodyInner);