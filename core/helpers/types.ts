export interface Newable<T> {
    new (...args: any[]): T
}

export type Factory<T> = (...args: any[]) => ((...args: any[]) => T) | T

export type Partial<T> = { [P in keyof T]?: T[P] }

export type Maybe<T> = T | null | undefined

export type MaybeArray<T> = T | T[]

export type MaybeLazy<T> = T | (() => T)

export type Witness<U extends T, T> = U

export type Identifiable = Maybe<{ id: Maybe<string> }>

export type Fn0<Out = void> = () => Out

export type Fn1<In, Out = void> = (i: In) => Out

export type Fn2<In1, In2, Out = void> = (i1: In1, i2: In2) => Out

export type Fn3<In1, In2, In3, Out = void> = (i1: In1, i2: In2, i3: In3) => Out

export interface PropHost<T> {
    props: T
}
