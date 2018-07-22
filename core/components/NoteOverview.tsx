import React from "react"
import { INote } from "../models/Note"
import Truncate from "react-truncate"
import strip from "striptags"

interface INoteOverviewProps {
    note: INote
}

export class NoteOverview extends React.Component<INoteOverviewProps> {
    public render() {
        return (
            <Truncate lines={3}>
                {strip(this.props.note.content || "")}
            </Truncate>
        )
    }
}
