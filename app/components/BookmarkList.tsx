import React from "react"
import Octicon from "react-octicon"
import { IOutlineVisitState } from "../models/OutlineVisitState"
import { Typography } from "@material-ui/core"

interface IBookmarkListProps {
    visitState: IOutlineVisitState
}

export class BookmarkList extends React.Component<IBookmarkListProps> {
    public render() {
        return (
            <>
                <Typography variant="headline">Bookmarks</Typography>
                <ul>
                    {this.props.visitState.fullBookmarkList.map(level => (
                        <li>
                            <Octicon name="bookmark" />
                            {level.node.content}
                        </li>
                    ))}
                </ul>
            </>
        )
    }
}
