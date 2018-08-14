import React from "react"
import { inject, observer } from "mobx-react";
import { RouteState } from "../../../core/models/RouteState";
import { modals } from "../../../core/components/modals";

@inject('routeState')
@observer
export class ModalContainer extends React.Component<{routeState?: RouteState}> {
    get routeState() {
        return this.props.routeState!;
    }
    public render() {
        const {dialog} = this.routeState
        const Dialog = dialog && modals[dialog]
        return (
            <>
                {this.props.children}
                {Dialog && <Dialog />}
            </>
        )
    }
}
