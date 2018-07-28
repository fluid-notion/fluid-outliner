import UndoIcon from "@material-ui/icons/Undo"
import RedoIcon from "@material-ui/icons/Redo"
import DeleteIcon from "@material-ui/icons/Delete"
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
                <UndoIcon onClick={props.outline.undo} />
            </SecondaryActionLink>
            <SecondaryActionLink>
                <RedoIcon onClick={props.outline.redo} />
            </SecondaryActionLink>
            <SecondaryActionLink
                onClick={() => props.modal!.activate("OutlineDeletionDialog")}
            >
                <DeleteIcon />
            </SecondaryActionLink>
        </div>
    )
)
