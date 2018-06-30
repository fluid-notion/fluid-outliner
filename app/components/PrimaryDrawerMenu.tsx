import React from "react"
import { inject, observer } from "mobx-react"
import { IStoreConsumerProps } from "../models/IProviderProps"
// import { ZoomStack } from "./ZoomStack"
import { IOutlineVisitState } from "../models/OutlineVisitState"
// import { BookmarkList } from "./BookmarkList";

interface IPrimaryDrawerMenuProps {
    visitState?: IOutlineVisitState
}

@inject(({ store }: IStoreConsumerProps) => ({
    visitState: store.visitState,
}))
@observer
export class PrimaryDrawerMenu extends React.Component<
    IPrimaryDrawerMenuProps
> {
    public render() {
        // const { visitState } = this.props
        return <div/>;
        // return (
        //     <div
        //         style={{
        //             maxWidth: "300px",
        //             padding: "20px",
        //         }}
        //     >
        //         {visitState && (
        //             <>
        //                 {visitState.zoomStack.length > 0 && (
        //                     <ZoomStack visitState={visitState} />
        //                 )}
        //                 {visitState.fullBookmarkList.length > 0 && (
        //                     <BookmarkList visitState={visitState} />
        //                 )}
        //             </>
        //         )}
        //     </div>
        // )
    }
}
