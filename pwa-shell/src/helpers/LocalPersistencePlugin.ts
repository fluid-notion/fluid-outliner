import localForage from "localforage"
import debounce from "lodash/debounce"
import _debug from "debug"
import { Maybe } from "../../../core/helpers/types"
import { Repository } from "../../../core/models/Repository"

const debug = _debug("fluid-outliner:LocalPersistencePlugin")

const LF_KEY = "fluid-outliner.file"
const ID = "LocalPersistencePlugin"

export class LocalPersistencePlugin {
    public static ID = ID
    private repository: Maybe<Repository>
    private debouncedSaveLocally = debounce(this.saveLocally, 1000).bind(this)

    public register(repository: Repository) {
        this.repository = repository
        repository.onLoad(() => {
            debug("Attached plugin", ID)
            this.saveLocally()
        })
        repository.onUpdate(this.debouncedSaveLocally)
    }

    public async restoreFromLocalCache(outlineId: Maybe<string>) {
        if (!outlineId) {
            outlineId = await this.getLastOutlineId()
        }
        if (!outlineId) {
            return false
        }
        const blob = await localForage.getItem<Blob>(this.getOutlineArchiveKey(outlineId))
        if (!blob) {
            return false
        }
        this.repository!.loadBlob(blob)
        return true
    }

    private async getLastOutlineId() {
        return localForage.getItem<string>(this.getLastOutlineKey())
    }

    private async setLastOutlineId(outlineId: string) {
        await localForage.setItem(this.getLastOutlineKey(), outlineId)
    }

    private getOutlineArchiveKey(outlineId: string) {
        return `${LF_KEY}.${outlineId}`
    }

    private getLastOutlineKey() {
        return `${LF_KEY}.lastEntry`
    }

    private async saveLocally() {
        const repo = this.repository!
        const blob = await repo.getBlob()
        const id = await repo.getId()
        if (!id) {
            return
        }
        const key = this.getOutlineArchiveKey(id)
        debug("Saving to localStorage", key)
        await localForage.setItem(key, blob)
        await this.setLastOutlineId(id)
    }
}
