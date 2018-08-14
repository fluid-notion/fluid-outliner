import WarningIcon from "@material-ui/icons/Warning"
import {
    Dialog,
    DialogContent,
    DialogActions,
    Button,
    DialogContentText,
} from "@material-ui/core"
import React from "react"
import { clearLocal } from "../utils/persistence"

export const OutlineDeletionDialog = ({ modal }: any) => (
    <Dialog open={true} onClose={modal.dismiss}>
        <DialogContent>
            <WarningIcon
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
)
