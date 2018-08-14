import UndoIcon from "@material-ui/icons/Undo"
import RedoIcon from "@material-ui/icons/Redo"
import DeleteIcon from "@material-ui/icons/Delete"
import React from "react"
import { IOutline } from "../models/Outline"
import { SecondaryActionLink } from "./SecondaryActionLink"

export interface IOutlineActionToolbarProps {
    style: any
    outline: IOutline
}

export const OutlineActionToolbar: React.ComponentType<any> = (props: IOutlineActionToolbarProps) => (
    <div style={props.style}>
        <SecondaryActionLink>
            <UndoIcon onClick={props.outline.undo} />
        </SecondaryActionLink>
        <SecondaryActionLink>
            <RedoIcon onClick={props.outline.redo} />
        </SecondaryActionLink>
        <SecondaryActionLink onClick={() => {}}>
            <DeleteIcon />
        </SecondaryActionLink>
    </div>
)
