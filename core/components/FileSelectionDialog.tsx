import InsertDriveFileIcon from "@material-ui/icons/InsertDriveFile"
import ArrowUpwardIcon from "@material-ui/icons/ArrowUpward"
import AddCircleOutlineIcon from "@material-ui/icons/AddCircle"
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
import { IconPair } from "./IconPair"
import { IProviderProps } from "../models/IProviderProps"
import { observer } from "mobx-react"
import { AppFooter } from "./AppFooter"
import { CloseButton } from "./CloseButton"
import { injectStore } from "../models/Store"

const FileUploader = asyncComponent({
    resolve: () => import("./FileUploader").then(({ FileUploader: F }) => F),
})

@injectStore
@observer
export class FileSelectionDialog extends React.Component<
    Partial<IProviderProps>
> {
    @observable private isUploadActive = false

    public render() {
        return (
            <Dialog open={true} onClose={this.handleClose}>
                {this.isClosable && (
                    <CloseButton onClick={this.props.modal!.dismiss} />
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
                            <FileUploader dismiss={this.props.modal!.dismiss} />
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
                                        primary={InsertDriveFileIcon}
                                        secondary={ArrowUpwardIcon}
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
                                        primary={InsertDriveFileIcon}
                                        secondary={AddCircleOutlineIcon}
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
        return !!this.props.store!.outline
    }

    @autobind
    private handleClose() {
        if (!this.isClosable) return false
        this.props.modal!.dismiss()
        return true
    }

    @autobind
    private handleCreateNew() {
        this.props.store!.createNew()
        this.props.modal!.dismiss()
    }

    @autobind
    private activateUpload() {
        this.isUploadActive = true
    }
}
