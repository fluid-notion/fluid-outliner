import InsertDriveFileIcon from "@material-ui/icons/InsertDriveFile"
import ArrowUpwardIcon from "@material-ui/icons/ArrowUpward"
import AddCircleOutlineIcon from "@material-ui/icons/AddCircle"
import { Typography, Button } from "@material-ui/core"
import React from "react"
import { inject } from "mobx-react"
import { autobind } from "core-decorators"

import { IconPair } from "./IconPair"
import { ModalDialog } from "./ModalDialog"
import { AppFooter } from "./AppFooter"
import { RouteViewModel } from "../models/RouteViewModel"
import { RepositoryViewModel } from "../models/RepositoryViewModel"

interface IWelcomeDialogProps {
    repository?: RepositoryViewModel
    route?: RouteViewModel
}

@inject("repository")
@inject("route")
export class WelcomeDialog extends React.Component<IWelcomeDialogProps> {
    public render() {
        return (
            <ModalDialog title="Welcome To Fluid Outliner">
                <div
                    style={{
                        margin: "50px auto",
                        maxWidth: "80%",
                        display: "flex",
                        flexDirection: "row",
                        justifyContent: "space-between",
                    }}
                >
                    <Button
                        style={{
                            marginRight: "1rem",
                            padding: "10px",
                        }}
                        onClick={this.visitUploader}
                        variant="contained"
                    >
                        <IconPair primary={InsertDriveFileIcon} secondary={ArrowUpwardIcon} />
                        <Typography variant="button" style={{ paddingRight: "10px" }}>
                            Select a File
                        </Typography>
                    </Button>
                    <Button style={{ padding: "10px" }} variant="contained" onClick={this.createNew}>
                        <IconPair primary={InsertDriveFileIcon} secondary={AddCircleOutlineIcon} />
                        <Typography variant="button" style={{ paddingRight: "10px" }}>
                            Create New
                        </Typography>
                    </Button>
                </div>
                <AppFooter style={{ margin: "-20px", maxWidth: "none" }} />
            </ModalDialog>
        )
    }

    @autobind
    private visitUploader() {
        this.props.route!.dialog = "upload"
    }

    @autobind
    private async createNew() {
        const outlineId = await this.props.repository!.repositoryProxy.create()
        this.props.route!.syncFromQuery({
            outlineId,
        })
    }
}

export default WelcomeDialog
