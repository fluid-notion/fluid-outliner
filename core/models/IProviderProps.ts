import { IStore } from "./Store"
import { IModalFacade } from "../components/ModalContainer"

export interface IProviderProps {
    store: IStore
    modal: IModalFacade
}

export interface IStoreConsumerProps {
    store: IStore
}
