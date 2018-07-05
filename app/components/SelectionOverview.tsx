import React from "react"
import { inject, observer } from "mobx-react"
import { IStoreConsumerProps } from "../models/IProviderProps"
import { IOutlineVisitState } from "../models/OutlineVisitState"

interface ISelectionOverviewProps {
    visitState?: IOutlineVisitState
}

@inject(({ store }: IStoreConsumerProps) => ({
    visitState: store.visitState,
}))
@observer
export class SelectionOverview extends React.Component<
    ISelectionOverviewProps
> {
    public render() {
        return (
            <div
                style={{
                    flexBasis: "300px",
                    flexGrow: 0,
                    flexShrink: 0,
                    padding: "20px",
                    position: "relative"
                }}
            />
        )
    }
}
