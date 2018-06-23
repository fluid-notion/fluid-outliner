export interface INewable<T> {
  new (...args: any[]): T;
}

export type IFactory<T> = (...args: any[]) => ((...args: any[]) => T) | T;

export type IPartial<T> = { [P in keyof T]?: T[P] };

export type IMaybe<T> = T | null | undefined;

export type IWitness<U extends T, T> = U;

export type IIdentifiable = IMaybe<{ id: IMaybe<string> }>;

export interface IPropHost<T> {props: T}
