import { Loadable } from "./Loadable"

export const modals = {
    welcome: Loadable(() => import("./WelcomeDialog")),
    upload: Loadable(() => import("./UploadDialog")),
    privacy: Loadable(() => import("./PrivacyDialog"))    
}

export type ModalKey = (keyof typeof modals)
