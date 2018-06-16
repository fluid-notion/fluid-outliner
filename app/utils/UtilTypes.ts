export interface INewable<T> {
  new (...args: any[]): T;
}

export type IFactory<T> = (...args: any[]) => ((...args: any[]) => T) | T;

export type IPartial<T> = { [P in keyof T]?: T[P] };

export type IMaybe<T> = T | null;

export type IWitness<U extends T, T> = U;
