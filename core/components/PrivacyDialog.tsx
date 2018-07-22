import {
    Dialog,
    DialogTitle,
    Divider,
    DialogContent,
    Typography,
} from "@material-ui/core"
import React from "react"
import { CloseButton } from "./CloseButton"
import { IModalConsumerProps } from "../utils/ModalRegistry"

export const PrivacyDialog: React.StatelessComponent<
    Partial<IModalConsumerProps>
> = ({ modal }: Partial<IModalConsumerProps>) => (
    <Dialog open={true} onClose={modal!.dismiss}>
        <CloseButton onClick={modal!.dismiss} />
        <DialogTitle>Fluid Outliner cares about your Privacy</DialogTitle>
        <Divider style={{ marginBottom: "20px" }} />
        <DialogContent>
            <Typography variant="body1">
                Your outlines reside in your computer. All operations that you
                perform are managed within your browser and none of your
                information is saved in our servers or shared with any third
                party services.
            </Typography>
        </DialogContent>
        <Divider style={{ marginBottom: "20px" }} />
        <DialogContent>
            <Typography variant="body1">
                Show your support by starring the project on Github, and telling
                your friends and loved ones about Fluid Outliner.
            </Typography>
        </DialogContent>
    </Dialog>
)
