import keycode from "keycode"
import React from "react"
import { IMaybe } from "./UtilTypes"
import { isFunction } from "lodash"

export type Handler = (event: React.KeyboardEvent) => void
export type Guard = (event: React.KeyboardEvent) => boolean

export const handleKeys = (handlers: {
    [index: string]:
        | {
              if?: IMaybe<Guard>
              unless?: IMaybe<Guard>
              handle?: IMaybe<Handler>
          }
        | IMaybe<Handler>
}) => (event: React.KeyboardEvent) => {
    const code = keycode(event.nativeEvent)
    const handler: any = handlers[code]
    if (handler) {
        if (handler.if) {
            if (!handler.if(event)) return
        }
        if (handler.unless) {
            if (handler.unless(event)) return
        }
        const handle = isFunction(handler) ? handler : handler.handle
        if (!handle && !handler) {
            return
        }
        event.stopPropagation()
        event.preventDefault()
        if (handle) {
            handle(event)
        }
    }
}
