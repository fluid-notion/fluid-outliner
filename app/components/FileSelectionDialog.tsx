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
import { IStore, storeObserver } from "../models/Store";
import { IconPair } from "./IconPair";

const FileUploader = asyncComponent({
  resolve: () => import("./FileUploader").then(({FileUploader: F}) => F)
});

@storeObserver
export class FileSelectionDialog extends React.Component<{ store?: IStore }> {
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
                <ButtonBase onClick={this.props.store!.createNew}>
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
  private activateUpload() {
    this.isUploadActive = true;
  }
}
