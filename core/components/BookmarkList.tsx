import React from "react"
import Octicon from "react-octicon"
import { IOutlineVisitState } from "../models/OutlineVisitState"
import { DrawerSection } from "./DrawerSection"
import { DrawerActionItem } from "./DrawerActionItem"

interface IBookmarkListProps {
    visitState: IOutlineVisitState
    scrollToNode: (id: string) => void
}

export class BookmarkList extends React.Component<IBookmarkListProps> {
    public render() {
        const bookmarks = this.props.visitState.fullBookmarkList
        return (
            <DrawerSection title="Bookmarks" show={bookmarks.length > 0}>
                {bookmarks.map(level => (
                    <DrawerActionItem
                        icon={
                            <Octicon name="bookmark" style={{ color: "red" }} />
                        }
                        label={level.node.content}
                        onClick={() => this.props.scrollToNode(level.node.id)}
                    />
                ))}
            </DrawerSection>
        )
    }
}
