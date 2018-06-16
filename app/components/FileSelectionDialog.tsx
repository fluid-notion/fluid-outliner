import {
  ButtonBase,
  Dialog,
  DialogContent,
  DialogTitle,
  Divider,
  Paper,
  Typography
} from "@material-ui/core";
import * as React from "react";
import { IStoreConsumerProps } from "../models/IProviderProps";
import { storeObserver } from "../models/Store";
import { IconPair } from "./IconPair";


export const FileSelectionDialog = storeObserver(({ store }: IStoreConsumerProps) => (
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
        <ButtonBase style={{ marginRight: "1rem" }}>
          <Paper>
            <IconPair primary="insert_drive_file" secondary="arrow_upward" />
            <Typography variant="headline">Select a File</Typography>
          </Paper>
        </ButtonBase>
        <ButtonBase onClick={store!.createNew}>
          <Paper>
            <IconPair
              primary="insert_drive_file"
              secondary="add_circle_outline"
            />
            <Typography variant="headline">Create New</Typography>
          </Paper>
        </ButtonBase>
      </div>
      <Divider />
      <Typography variant="caption">
        Fluid Outliner cares about your privacy <a>Learn More</a>
      </Typography>
    </DialogContent>
  </Dialog>
));
