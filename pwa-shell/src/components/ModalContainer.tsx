import React from "react"
import { inject, observer } from "mobx-react"
import { modals } from "../../../core/views/components/modals"
import { RouteViewModel } from "../../../core/views/models/RouteViewModel"

@inject("route")
@observer
export class ModalContainer extends React.Component<{ route?: RouteViewModel }> {
    get route() {
        return this.props.route!
    }
    public render() {
        const { dialog } = this.route
        const Dialog = dialog && modals[dialog]
        return (
            <>
                {this.props.children}
                {Dialog && <Dialog />}
            </>
        )
    }
}
