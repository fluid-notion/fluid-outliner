import {
  Dialog,
  DialogContent,
  DialogActions,
  Button,
  Icon,
  DialogContentText,
} from "@material-ui/core";
import React from "react";
import { inject } from "mobx-react";
import { IModalConsumerProps } from "./ModalContainer";
import { clearLocal } from "../utils/persistence";

export const OutlineDeletionDialog: React.StatelessComponent<{}> = inject(
  ({ modal }: IModalConsumerProps) => ({ modal })
)(({ modal }: IModalConsumerProps) => (
  <Dialog open={true} onClose={modal.dismiss}>
    <DialogContent>
      <Icon
        children="warning"
        style={{ float: "left", color: "red", fontSize: "3rem" }}
      />
      <DialogContentText style={{ marginLeft: "70px" }}>
        Are you sure you want to clear this outline ?
        <br />
        This action can not be undone !
      </DialogContentText>
    </DialogContent>
    <DialogActions>
      <Button
        onClick={async () => {
          await clearLocal();
          location.reload();
        }}
        color="primary"
      >
        OK
      </Button>
      <Button onClick={modal.dismiss} color="secondary" autoFocus>
        Cancel
      </Button>
    </DialogActions>
  </Dialog>
)) as any;
