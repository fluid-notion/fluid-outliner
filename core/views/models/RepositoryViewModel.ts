import * as Comlink from "comlink"
import { decorate, autobind } from "core-decorators"
import memoize from "lodash/memoize"
import { observable } from "mobx"
import { saveAs } from "file-saver"

import { Repository } from "../../models/Repository"
import { Newable, Maybe } from "../../helpers/types"
import { OutlineViewModel } from "./OutlineViewModel"

export class RepositoryViewModel {
    @observable public outline: Maybe<OutlineViewModel>

    @decorate(memoize)
    static async instance(RepositoryWorker: Newable<Worker>) {
        const repositoryProxy: Repository = await new (Comlink.proxy(new RepositoryWorker()) as any)()
        return new this(repositoryProxy)
    }

    private constructor(public repositoryProxy: Repository) {
        repositoryProxy.onLoad(
            Comlink.proxyValue(async () => {
                const outlineShellProxy = await repositoryProxy.getOutlineShellProxy()
                const outlineVisitState = await repositoryProxy.getOutlineVisitState()
                this.outline = new OutlineViewModel(outlineShellProxy!, outlineVisitState!)
            })
        )
        repositoryProxy.onUnload(
            Comlink.proxyValue(async () => {
                this.outline = null
            })
        )
    }

    @autobind
    async saveLocally() {
        const blob = await this.repositoryProxy.getBlob()
        saveAs(blob, "outline.zip")
    }

    async loadFromLocal(file: File) {
        const reader = new FileReader()
        // @ts-ignore
        reader.onload = (progEvent: FileReaderProgressEvent) => {
            const result = progEvent.target!.result
            this.repositoryProxy.loadBlob(result)
        }
        reader.readAsArrayBuffer(file)
    }
}
