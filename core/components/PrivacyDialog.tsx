import { Divider, Typography } from "@material-ui/core"
import React from "react"
import { ModalDialog } from "./ModalDialog"

export const PrivacyDialog = () => (
    <ModalDialog title="Fluid Outliner cares about your Privacy">
        <Typography variant="body1">
            Your outlines reside in your computer. All operations that you perform are managed within your browser and
            none of your information is saved in our servers or shared with any third party services.
        </Typography>
        <Divider style={{ marginBottom: "20px" }} />
        <Typography variant="body1">
            Show your support by starring the project on Github, and telling your friends and loved ones about Fluid
            Outliner.
        </Typography>
    </ModalDialog>
)

export default PrivacyDialog
