// @ts-ignore
import logo from "../../assets/colored-logo.png"
import React from "react"
import { ModalDialog, IModalDialogChildrenProps } from "./ModalDialog"
import { FileUploader } from "./FileUploader"
import { AppFooter } from "./AppFooter"

export const UploadDialog = () => (
    <ModalDialog title="Select a file">
        {({ onClose }: IModalDialogChildrenProps) => (
            <>
                <FileUploader dismiss={onClose} />
                <AppFooter style={{ margin: "0", maxWidth: "100%" }} />
            </>
        )}
    </ModalDialog>
)

export default UploadDialog
