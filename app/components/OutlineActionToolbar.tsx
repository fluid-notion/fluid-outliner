import { Icon } from "@material-ui/core"
import React from "react"
import { IOutline } from "../models/Outline"
import { SecondaryActionLink } from "./SecondaryActionLink"
import { inject } from "mobx-react"
import { IModalConsumerProps } from "./ModalContainer"

export const OutlineActionToolbar: React.ComponentType<any> = inject(
    ({ modal }: IModalConsumerProps) => ({ modal })
)((props: { style: any; outline: IOutline } & IModalConsumerProps) => (
    <div style={props.style}>
        <SecondaryActionLink>
            <Icon onClick={props.outline.undo}>undo</Icon>
        </SecondaryActionLink>
        <SecondaryActionLink>
            <Icon onClick={props.outline.redo}>redo</Icon>
        </SecondaryActionLink>
        <SecondaryActionLink
            onClick={() => props.modal.activate("OutlineDeletionDialog")}
        >
            <Icon>delete</Icon>
        </SecondaryActionLink>
    </div>
)) as any
