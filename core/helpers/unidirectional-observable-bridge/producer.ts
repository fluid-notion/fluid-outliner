import * as Comlink from "comlink"
import _debug from "debug"
import { observe, IValueDidChange } from "mobx"

const debug = _debug("fluid-outliner:uob:producer")

export const linkProducer = (target: any, property: any) => (consumerCb: ((change: any) => void)) =>
    Comlink.proxyValue(
        observe(
            target,
            property,
            (change: IValueDidChange<any>) => {
                debug("Observed Change:", target, property, change)
                consumerCb({
                    type: change.type,
                    newValue: change.newValue,
                    oldValue: change.oldValue,
                })
            },
            true
        )
    )
