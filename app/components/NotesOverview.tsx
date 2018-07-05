import React from "react"
import { INote } from "../models/Note"
import { DrawerSection } from "./DrawerSection";
import { NoteOverview } from "./NoteOverview";
import strip from "striptags"

interface INotesOverviewProps {
    notes: INote[]
    style?: object
}

export class NotesOverview extends React.Component<INotesOverviewProps> {
    public render() {
        const notes = this.props.notes.filter(n => strip(n.content || "").trim().length > 0);
        if (notes.length === 0) return null;
        return (
            <DrawerSection
                title="Notes"
                show={this.props.notes.length > 0}
                style={this.props.style}
            >
                <ul style={{ marginLeft: "-20px" }}>
                    {notes.map(n => (
                        <li>
                            <NoteOverview note={n} />
                        </li>
                    ))}
                </ul>
            </DrawerSection>
        )
    }
}
