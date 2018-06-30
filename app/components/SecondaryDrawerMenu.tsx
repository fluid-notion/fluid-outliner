import React from "react"
import { Typography, Button, StyledComponentProps } from "@material-ui/core";
import { DrawerSection } from "./DrawerSection";
import Octicon from "react-octicon";
import { icon } from "./styles/drawer";
import { autobind } from "core-decorators";
import { withStyles } from "../utils/type-overrides";
import { inject, observer } from "mobx-react";
import { IProviderProps } from "../models/IProviderProps";

const styles = {
    icon
}

type ISecondaryDrawerMenuProps = StyledComponentProps<keyof typeof styles> & Partial<IProviderProps>

@inject(({store, modal}: IProviderProps) => ({
    store,
    modal,
}))
@withStyles(styles)
@observer
export class SecondaryDrawerMenu extends React.Component<ISecondaryDrawerMenuProps> {
    public render() {
        const classes = this.props.classes!
        const store = this.props.store!
        return (
            <>
                <Typography variant="headline">Current Notebook</Typography>
                <DrawerSection>
                    <Button color="primary" onClick={store.saveFile}>
                        <Typography variant="body1">
                            <Octicon
                                name="desktop-download"
                                className={classes.icon}
                            />
                            Save To File
                        </Typography>
                    </Button>
                    <Button
                        color="primary"
                        onClick={this.handleClearSession}
                    >
                        <Typography variant="body1">
                            <Octicon name="trashcan" className={classes.icon} />
                            Clear Outline
                        </Typography>
                    </Button>
                    <Button
                        color="primary"
                        onClick={this.handleOpen}
                    >
                        <Typography variant="body1">
                            <Octicon
                                name="repo-push"
                                className={classes.icon}
                            />
                            Open / Create Outline
                        </Typography>
                    </Button>
                </DrawerSection>
            </>
        )
    }

    @autobind
    private handleClearSession() {
        this.props.modal!.activate("OutlineDeletionDialog");
    }

    @autobind
    private handleOpen() {
        this.props.modal!.activate("FileSelectionDialog")
    }
}
