import React from "react"
import { inject, observer } from "mobx-react"
import { IStoreConsumerProps } from "../models/IProviderProps"
import { ZoomStack } from "./ZoomStack"
import { IOutlineVisitState } from "../models/OutlineVisitState"
import { BookmarkList } from "./BookmarkList"

interface IPrimaryDrawerMenuProps {
    visitState?: IOutlineVisitState
    scrollToNode: (id: string) => void
}

@inject(({ store }: IStoreConsumerProps) => ({
    visitState: store.visitState,
}))
@observer
export class PrimaryDrawerMenu extends React.Component<
    IPrimaryDrawerMenuProps
> {
    public render() {
        const { visitState } = this.props
        return (
            <>
                {visitState && (
                    <>
                        <ZoomStack visitState={visitState} />
                        <BookmarkList
                            visitState={visitState}
                            scrollToNode={this.props.scrollToNode}
                        />
                    </>
                )}
            </>
        )
    }
}
