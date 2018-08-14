import { IStore } from "./Store"

export interface IProviderProps {
    store: IStore
    modal: any
}

export interface IStoreConsumerProps {
    store: IStore
}
