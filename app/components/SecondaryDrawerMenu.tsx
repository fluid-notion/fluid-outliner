import React from "react"
import { StyledComponentProps } from "@material-ui/core"
import { DrawerSection } from "./DrawerSection"
import Octicon from "react-octicon"
import { icon } from "./styles/drawer"
import { autobind } from "core-decorators"
import { withStyles } from "../utils/type-overrides"
import { inject, observer } from "mobx-react"
import { IProviderProps } from "../models/IProviderProps"
import { DrawerActionItem } from "./DrawerActionItem"

const styles = {
    icon,
}

type ISecondaryDrawerMenuProps = StyledComponentProps<keyof typeof styles> &
    Partial<IProviderProps>

@inject(({ store, modal }: IProviderProps) => ({
    store,
    modal,
}))
@withStyles(styles)
@observer
export class SecondaryDrawerMenu extends React.Component<
    ISecondaryDrawerMenuProps
> {
    public render() {
        const classes = this.props.classes!
        const store = this.props.store!
        return (
            <DrawerSection title="Current Notebook">
                <DrawerActionItem
                    label="Save to File"
                    onClick={store.saveFile}
                    icon={
                        <Octicon
                            name="desktop-download"
                            className={classes.icon}
                        />
                    }
                />
                <DrawerActionItem
                    onClick={this.handleClearSession}
                    label="Clear Outline"
                    icon={<Octicon name="trashcan" className={classes.icon} />}
                />
                <DrawerActionItem
                    onClick={this.handleOpen}
                    label="Open / Create Outline"
                    icon={<Octicon name="repo-push" className={classes.icon} />}
                />
            </DrawerSection>
        )
    }

    @autobind
    private handleClearSession() {
        this.props.modal!.activate("OutlineDeletionDialog")
    }

    @autobind
    private handleOpen() {
        this.props.modal!.activate("FileSelectionDialog")
    }
}
