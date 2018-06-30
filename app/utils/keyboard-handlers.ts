import keycode from "keycode"
import React from "react"
import isString from "lodash/isString"
import isBoolean from "lodash/isBoolean";
import { IMaybe, IFn1 } from "./UtilTypes"
import { pushAtKey } from "./collection-helpers";

export type Handler = (event: React.KeyboardEvent) => void
export type Guard = (event: React.KeyboardEvent) => boolean
export type KbdEvt = React.KeyboardEvent

export interface IGuardSpec {
    if?: IMaybe<Guard>
    unless?: IMaybe<Guard>
    terminate?: boolean
}

export interface IKeySpec extends IGuardSpec {
    key: string
    ctrl?: boolean
    shift?: boolean
    alt?: boolean
}

export type IFlexKeySpec = IKeySpec | string

export const normalizeKeySpec = (key: IFlexKeySpec) =>
    isString(key) ? { key } : key

export const validateModifiers = (k: IKeySpec) => (event: KbdEvt) =>
    (isBoolean(k.ctrl) ? event.ctrlKey === k.ctrl : true) &&
    (isBoolean(k.shift) ? event.shiftKey === k.shift : true) &&
    (isBoolean(k.alt) ? event.altKey === k.alt : true)

export const withoutModifiers = (key: string) => ({
    key,
    ctrl: false,
    shift: false,
    alt: false
})

export const withModifiers = (key: string, modifiers: Array<"ctrl" | "shift"| "alt">) => {
    const spec = withoutModifiers(key);
    for (const m of modifiers) {
        spec[m] = true;
    }
    return spec;
}

export interface IFlexHandlerSpec extends IGuardSpec {
    handle?: IMaybe<Handler>
    keys: Array<string | IKeySpec>
}

export type IHandlerSpecMapping = Map<string, Array<IFn1<KbdEvt>>>

export const validateGuards = (h: IGuardSpec) => (e: KbdEvt) =>
    (h.if ? h.if(e) : true) &&
    (h.unless ? !h.unless(e): true)

export const handleKeys = (handlers: IFlexHandlerSpec[]) => {
    const mapping: IHandlerSpecMapping = new Map()
    for (const h of handlers) {
        const validateHG = validateGuards(h)
        for (const k of h.keys) {
            const nk = normalizeKeySpec(k)
            const validateKM = validateModifiers(nk)
            const validateKG = validateGuards(nk)
            pushAtKey(mapping, nk.key, (e: KbdEvt) => {
                if (!validateKM(e)) return;
                if (!validateKG(e)) return;
                if (!validateHG(e)) return;
                if (h.handle) {
                    h.handle(e);
                    if (h.terminate !== false && nk.terminate !== false) {
                        e.stopPropagation();
                        e.preventDefault();    
                    }
                }
            })
        }
    }
    return (event: React.KeyboardEvent) => {
        const code = keycode(event.nativeEvent)
        const hlist = mapping.get(code);
        if (!hlist) return;
        for (const h of hlist) {
            h(event)
        }
    }
}

export const wasOnCurrent = (event: React.SyntheticEvent) => 
    event.target === event.currentTarget