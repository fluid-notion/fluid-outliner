import {
  ButtonBase,
  Dialog,
  DialogContent,
  DialogTitle,
  Divider,
  Paper,
  Typography
} from "@material-ui/core";
import { autobind } from "core-decorators";
import { observable } from "mobx";
import React from "react";
import {asyncComponent} from "react-async-component";
import flow from "lodash/flow";
import { IconPair } from "./IconPair";
import { IStoreConsumerProps } from "../models/IProviderProps";
import { IModalConsumerProps } from "./ModalContainer";
import { inject, observer } from "mobx-react";

const FileUploader = asyncComponent({
  resolve: () => import("./FileUploader").then(({FileUploader: F}) => F)
});

type IFileSelectionDialogInner = IStoreConsumerProps & IModalConsumerProps;

export class FileSelectionDialogInner extends React.Component<IFileSelectionDialogInner> {
  @observable private isUploadActive = false;
  public render() {
    return (
      <Dialog open={true}>
        <DialogTitle>Open Outline</DialogTitle>
        <Divider />
        <DialogContent>
          <div
            style={{
              margin: "50px auto",
              maxWidth: "80%",
              display: "flex",
              flexDirection: "row"
            }}
          >
            {this.isUploadActive ? (
              <FileUploader />
            ) : (
              <>
                <ButtonBase
                  style={{ marginRight: "1rem" }}
                  onClick={this.activateUpload}
                >
                  <Paper>
                    <IconPair
                      primary="insert_drive_file"
                      secondary="arrow_upward"
                    />
                    <Typography variant="headline">Select a File</Typography>
                  </Paper>
                </ButtonBase>
                <ButtonBase onClick={this.handleCreateNew}>
                  <Paper>
                    <IconPair
                      primary="insert_drive_file"
                      secondary="add_circle_outline"
                    />
                    <Typography variant="headline">Create New</Typography>
                  </Paper>
                </ButtonBase>
              </>
            )}
          </div>
          <Divider />
          <Typography variant="caption">
            Fluid Outliner cares about your privacy <a>Learn More</a>
          </Typography>
        </DialogContent>
      </Dialog>
    );
  }

  @autobind
  private handleCreateNew() {
    this.props.store.createNew();
    this.props.modal.dismiss();
  }

  @autobind
  private activateUpload() {
    this.isUploadActive = true;
  }
}

export const FileSelectionDialog: React.ComponentType<{}> = flow(
  observer,
  inject(({store, modal}) => ({store, modal}))
)(FileSelectionDialogInner);
