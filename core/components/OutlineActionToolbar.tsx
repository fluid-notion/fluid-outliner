import { Icon } from "@material-ui/core"
import React from "react"
import { IOutline } from "../models/Outline"
import { SecondaryActionLink } from "./SecondaryActionLink"
import { IModalConsumerProps, injectModal } from "./ModalContainer"

export interface IOutlineActionToolbarProps
    extends Partial<IModalConsumerProps> {
    style: any
    outline: IOutline
}

export const OutlineActionToolbar: React.ComponentType<any> = injectModal(
    (props: IOutlineActionToolbarProps) => (
        <div style={props.style}>
            <SecondaryActionLink>
                <Icon onClick={props.outline.undo}>undo</Icon>
            </SecondaryActionLink>
            <SecondaryActionLink>
                <Icon onClick={props.outline.redo}>redo</Icon>
            </SecondaryActionLink>
            <SecondaryActionLink
                onClick={() => props.modal!.activate("OutlineDeletionDialog")}
            >
                <Icon>delete</Icon>
            </SecondaryActionLink>
        </div>
    )
)
