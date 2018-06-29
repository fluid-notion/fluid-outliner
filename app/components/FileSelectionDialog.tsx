import {
    Dialog,
    DialogContent,
    DialogTitle,
    Divider,
    Typography,
    Button,
} from "@material-ui/core"
import { autobind } from "core-decorators"
import { observable } from "mobx"
import React from "react"
import { asyncComponent } from "react-async-component"
import flow from "lodash/flow"
import { IconPair } from "./IconPair"
import { IStoreConsumerProps } from "../models/IProviderProps"
import { IModalConsumerProps } from "./ModalContainer"
import { inject, observer } from "mobx-react"
import { AppFooter } from "./AppFooter"
import { CloseButton } from "./CloseButton"

const FileUploader = asyncComponent({
    resolve: () => import("./FileUploader").then(({ FileUploader: F }) => F),
})

type IFileSelectionDialogInner = IStoreConsumerProps & IModalConsumerProps

export class FileSelectionDialogInner extends React.Component<
    IFileSelectionDialogInner
> {
    @observable private isUploadActive = false

    public render() {
        return (
            <Dialog open={true} onClose={this.handleClose}>
                {this.isClosable && (
                    <CloseButton onClick={this.props.modal.dismiss} />
                )}
                <DialogTitle
                    style={{
                        background: "#e0e0e0",
                    }}
                >
                    Open Outline
                </DialogTitle>
                <Divider />
                <DialogContent>
                    <div
                        style={{
                            margin: "50px auto",
                            maxWidth: "80%",
                            display: "flex",
                            flexDirection: "row",
                            justifyContent: "space-between",
                        }}
                    >
                        {this.isUploadActive ? (
                            <FileUploader dismiss={this.props.modal.dismiss} />
                        ) : (
                            <>
                                <Button
                                    style={{
                                        marginRight: "1rem",
                                        padding: "10px",
                                    }}
                                    onClick={this.activateUpload}
                                    variant="contained"
                                >
                                    <IconPair
                                        primary="insert_drive_file"
                                        secondary="arrow_upward"
                                    />
                                    <Typography
                                        variant="button"
                                        style={{ paddingRight: "10px" }}
                                    >
                                        Select a File
                                    </Typography>
                                </Button>
                                <Button
                                    style={{ padding: "10px" }}
                                    variant="contained"
                                    onClick={this.handleCreateNew}
                                >
                                    <IconPair
                                        primary="insert_drive_file"
                                        secondary="add_circle_outline"
                                    />
                                    <Typography
                                        variant="button"
                                        style={{ paddingRight: "10px" }}
                                    >
                                        Create New
                                    </Typography>
                                </Button>
                            </>
                        )}
                    </div>
                    <AppFooter />
                </DialogContent>
            </Dialog>
        )
    }

    private get isClosable() {
        return !!this.props.store.outline
    }

    @autobind
    private handleClose() {
        if (!this.isClosable) return false
        this.props.modal.dismiss()
        return true
    }

    @autobind
    private handleCreateNew() {
        this.props.store.createNew()
        this.props.modal.dismiss()
    }

    @autobind
    private activateUpload() {
        this.isUploadActive = true
    }
}

export const FileSelectionDialog: React.ComponentType<{}> = flow(
    observer,
    inject(({ store, modal }) => ({ store, modal }))
)(FileSelectionDialogInner)