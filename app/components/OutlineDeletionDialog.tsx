import {
    Dialog,
    DialogContent,
    DialogActions,
    Button,
    Icon,
    DialogContentText,
} from "@material-ui/core"
import React from "react"
import { clearLocal } from "../utils/persistence"
import { IModalConsumerProps } from "../utils/ModalRegistry";

export const OutlineDeletionDialog = (({ modal }: IModalConsumerProps) => (
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
                    await clearLocal()
                    location.reload()
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
))
