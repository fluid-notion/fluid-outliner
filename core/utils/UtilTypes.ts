export interface INewable<T> {
    new (...args: any[]): T
}

export type IFactory<T> = (...args: any[]) => ((...args: any[]) => T) | T

export type IPartial<T> = { [P in keyof T]?: T[P] }

export type IMaybe<T> = T | null | undefined

export type IMaybeArray<T> = T | T[]

export type IMaybeLazy<T> = T | (() => T)

export type IWitness<U extends T, T> = U

export type IIdentifiable = IMaybe<{ id: IMaybe<string> }>

export type IFn0<Out = void> = () => Out

export type IFn1<In, Out = void> = (i: In) => Out

export type IFn2<In1, In2, Out = void> = (i1: In1, i2: In2) => Out

export type IFn3<In1, In2, In3, Out = void> = (i1: In1, i2: In2, i3: In3) => Out

export interface IPropHost<T> {
    props: T
}
