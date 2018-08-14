import { Dialog, DialogContent, DialogTitle, Divider } from "@material-ui/core"
import React from "react"
import { CloseButton } from "./CloseButton"
import { autobind } from "core-decorators"
import { RouteState } from "../models/RouteState"
import { inject, observer } from "mobx-react"

export interface IModalDialogProps {
    routeState?: RouteState
    isClosable?: boolean
    onClose?: () => void
    title?: any
    children: any
}

export interface IModalDialogChildrenProps {
    onClose: () => void
}

@inject("routeState")
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
        this.props.routeState!.dialog = null
    }
}
