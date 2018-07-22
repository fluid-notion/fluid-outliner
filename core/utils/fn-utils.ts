import get from "lodash/get"
import extend from "lodash/extend"
import { IFn1, IFn0 } from "./UtilTypes"

export const delegateTo = (path: string) =>
    function(this: any, ...args: any[]) {
        get(this, path)(...args)
    }

export const composeAnd = <I, R1 = boolean, R2 = boolean>(
    fn1: IFn1<I, R1> | IFn0<R1>,
    fn2: IFn1<I, R2> | IFn0<R2>
) => (i: I) => {
    return (fn1 as IFn1<I, R1>)(i) && (fn2 as IFn1<I, R2>)(i)
}

export const composeOr = <I, R1 = boolean, R2 = boolean>(
    fn1: IFn1<I, R1>,
    fn2: IFn1<I, R2>
) => (i: I) => {
    return fn1(i) || fn2(i)
}

export const composeThen = <I, R1 = boolean, R2 = boolean>(
    fn1: IFn1<I, R1>,
    fn2: IFn1<R1, R2>
) => (i: I) => fn2(fn1(i))

export const compose = <I, O1>(fn: (i: I, ...args: any[]) => O1) =>
    extend(fn, {
        and: (nextFn: (i1: I) => O1) => compose(composeAnd(fn, nextFn)),
        or: (nextFn: (i2: I) => O1) => compose(composeOr(fn, nextFn)),
        then: <O2>(nextFn: (i3: O1) => O2) => compose(composeThen(fn, nextFn)),
    })
