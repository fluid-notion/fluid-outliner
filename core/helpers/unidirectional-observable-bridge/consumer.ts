import * as Comlink from "comlink"
import _debug from "debug"
import { set } from "mobx"

const debug = _debug("fluid-outliner:uob:consumer")

export const linkConsumer = (source: any, sourceProp: any, target: any, targetProp: any) => {
    targetProp = targetProp || sourceProp
    return source[sourceProp](
        Comlink.proxyValue((change: any) => {
            debug(`[${sourceProp} -> ${targetProp}] Received change:`, source, change)
            set(target, targetProp, change.newValue)
        })
    )
}
