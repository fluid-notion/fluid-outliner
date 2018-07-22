import { types as t } from "mobx-state-tree"
import { v4 as uuid } from "uuid"

const Format = t.enumeration(["markdown", "html", "text"])

export const Note = t
    .model({
        id: t.optional(t.maybe(t.identifier(t.string)), uuid),
        format: Format,
        content: t.optional(t.string, ""),
        placement: t.enumeration(["side", "main"]),
    })
    .actions(self => ({
        setContent(content: string) {
            self.content = content
        },
    }))

export type INote = typeof Note.Type
export type INoteFormat = typeof Format.Type
