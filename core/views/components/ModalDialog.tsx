import { Dialog, DialogContent, DialogTitle, Divider } from "@material-ui/core"
import React from "react"
import { autobind } from "core-decorators"
import { inject, observer } from "mobx-react"

import { CloseButton } from "./CloseButton"
import { RouteViewModel } from "../models/RouteViewModel"

export interface IModalDialogProps {
    route?: RouteViewModel
    isClosable?: boolean
    onClose?: () => void
    title?: any
    children: any
}

export interface IModalDialogChildrenProps {
    onClose: () => void
}

@inject("route")
@observer
export class ModalDialog extends React.Component<IModalDialogProps> {
    public static defaultProps = {
        isClosable: true,
    }

    public render() {
        const { isClosable, title, children } = this.props
        return (
            <Dialog open={true} onClose={this.handleClose}>
                {isClosable && <CloseButton onClick={this.handleClose} />}
                {title && (
                    <>
                        <DialogTitle
                            style={{
                                background: "#e0e0e0",
                            }}
                        >
                            {title}
                        </DialogTitle>
                        <Divider />
                    </>
                )}
                <DialogContent>
                    {typeof children === "function" ? children({ onClose: this.handleClose }) : children}
                </DialogContent>
            </Dialog>
        )
    }

    @autobind
    private handleClose() {
        this.props.route!.dialog = null
    }
}
