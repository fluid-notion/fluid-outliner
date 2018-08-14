import { flow } from "mobx"
import { inject, observer } from "mobx-react"
import { getSnapshot, onSnapshot, types as t } from "mobx-state-tree"
import {
    debouncedSaveLocal,
    download,
    restoreLocal,
    wrapMetadata,
} from "../utils/persistence"
import { IProviderProps } from "./IProviderProps"
import { defaultOutlineId, Outline } from "./Outline"
import { OutlineVisitState } from "./OutlineVisitState"
import { safeApplySnapshot } from "../utils/mobx-helpers"

export const Store = t
    .model("Store", {
        outline: t.maybe(Outline),
        visitState: t.maybe(OutlineVisitState)
    })
    .actions(self => ({
        createNew() {
            self.outline = Outline.create({ id: defaultOutlineId() })
            self.visitState = OutlineVisitState.create({
                outline: defaultOutlineId(),
            })
        },
        afterCreate() {
            onSnapshot(self, async (snapshot: any) => {
                // tslint:disable-next-line:no-console
                console.dir(snapshot)
                debouncedSaveLocal(await wrapMetadata(snapshot))
            })
        },
        saveFile: flow(function*() {
            download(yield wrapMetadata(getSnapshot(self)))
        }) as () => void,
        loadFileContent(content: string) {
            const { snapshot } = JSON.parse(content)
            return safeApplySnapshot(self, snapshot)
        },
    }))
    .actions(self => ({
        restoreSaved: flow(function*() {
            const fileData = yield restoreLocal()
            if (fileData && fileData.snapshot) {
                return safeApplySnapshot(self, fileData.snapshot)
            }
            return false
        }),
    }))

export type IStore = typeof Store.Type

export const injectStore = inject(({ store }: IProviderProps) => ({
    store,
}))

export const storeObserver = (Component: any) =>
    injectStore(observer(Component))
