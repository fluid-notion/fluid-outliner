import InsertDriveFileIcon from "@material-ui/icons/InsertDriveFile"
import ArrowUpwardIcon from "@material-ui/icons/ArrowUpward"
import AddCircleOutlineIcon from "@material-ui/icons/AddCircle"
import { Typography, Button } from "@material-ui/core"
import React from "react"
import { IconPair } from "./IconPair"
import { ModalDialog } from "./ModalDialog"
import { inject } from "mobx-react"
import { RouteState } from "../models/RouteState"
import { AppFooter } from "./AppFooter"
import { Repository } from "../utils/repository";
import { autobind } from "core-decorators";

interface IWelcomeDialogProps {
    repository?: Repository
    routeState?: RouteState
}

@inject("repository")
@inject("routeState")
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
                    <Button
                        style={{ padding: "10px" }}
                        variant="contained"
                        onClick={this.createNew}
                    >
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
        this.props.routeState!.dialog = "upload"
    }

    @autobind
    private async createNew() {
        const outlineId = await this.props.repository!.create()
        this.props.routeState!.syncFromQuery({
            outlineId
        })
    }
}

export default WelcomeDialog
