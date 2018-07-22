import { asyncComponent } from "react-async-component"
import { inject } from "mobx-react"

export const ModalRegistry = {
    FileSelectionDialog: asyncComponent({
        resolve: async () =>
            (await import("../components/FileSelectionDialog"))
                .FileSelectionDialog,
    }),
    PrivacyDialog: asyncComponent({
        resolve: async () =>
            (await import("../components/PrivacyDialog")).PrivacyDialog,
    }),
    OutlineDeletionDialog: asyncComponent({
        resolve: async () =>
            (await import("../components/OutlineDeletionDialog"))
                .OutlineDeletionDialog,
    }),
}

export type IModalKey = keyof typeof ModalRegistry

export interface IModalFacade {
    activeModal: IModalKey | null
    activate: (m: IModalKey, retainPrev?: boolean) => void
    dismiss: () => void
}

export interface IModalConsumerProps {
    modal: IModalFacade
}

export const injectModal = inject(({ modal }: IModalConsumerProps) => ({
    modal,
}))
