import * as Comlink from "comlink"
import JSZip from "jszip"
import pull from "lodash/pull"

// @ts-ignore
import manifest from "../../package.json"
import { Lambda, autorun, observable, computed } from "mobx"
import { Newable, Maybe } from "../helpers/types"
import { OutlineShell } from "./OutlineShell"
import { OutlineVisitState } from "./OutlineVisitState"
import { EmbeddedCRDTFile } from "./EmbeddedCRDTFile"
import { getRendererForFormat } from "../helpers/renderers";
import { EmbeddedContentFile } from "./EmbeddedContentFile";
import { Outline } from "./document-data-types";

export interface RepositoryPlugin {
    register(repository: Repository): void
}

export interface RepositoryPluginCtor extends Newable<RepositoryPlugin> {
    ID: string
}

interface RepositorySubscribers {
    onLoad: Lambda[]
    onUpdate: Lambda[]
    onUnload: Lambda[]
}

export class Repository {
    public static plugins: RepositoryPluginCtor[] = []

    @observable.ref public outlineShell: Maybe<OutlineShell>

    public archive: Maybe<JSZip>

    public plugins: { [key: string]: RepositoryPlugin } = {}

    private unbindOutlineObserver: Maybe<Lambda>
    private subscribers: RepositorySubscribers

    @computed
    public get outlineVisitState() {
        if (!this.outlineShell) return null
        return new OutlineVisitState(this.outlineShell)
    }

    constructor() {
        this.subscribers = {
            onLoad: [],
            onUpdate: [],
            onUnload: [],
        }
        Repository.plugins.forEach((pluginCtor: RepositoryPluginCtor) => {
            const plugin = new pluginCtor()
            this.plugins[pluginCtor.ID] = plugin
            plugin.register(this)
        })
    }

    public onLoad(lambda: Lambda) {
        this.subscribers.onLoad.push(lambda)
        if (this.outline) {
            this.invokeSubscribers("onLoad")
        }
        return Comlink.proxyValue(() => pull(this.subscribers.onLoad, lambda))
    }

    public onUpdate(lambda: Lambda) {
        this.subscribers.onUpdate.push(lambda)
        return Comlink.proxyValue(() => pull(this.subscribers.onUpdate, lambda))
    }

    public onUnload(lambda: Lambda) {
        this.subscribers.onUnload.push(lambda)
        return Comlink.proxyValue(() => pull(this.subscribers.onUnload, lambda))
    }

    @computed
    public get outline(): Maybe<Outline> {
        if (this.outlineShell) {
            return this.outlineShell.outline
        }
        return null
    }

    public async getId() {
        if (this.outline) return this.outline.id
        return undefined
    }

    public async getOutlineShellProxy() {
        if (this.outlineShell) return Comlink.proxyValue(this.outlineShell)
        return null
    }

    public async getOutlineVisitState() {
        if (this.outlineVisitState) return Comlink.proxyValue(this.outlineVisitState)
        return null
    }

    public async loadBlob(blob: Blob) {
        this.archive = new JSZip()
        await this.archive.loadAsync(blob)
        await this.loadOutline()
    }

    public async getBlob() {
        return this.archive!.generateAsync({
            type: "blob",
        })
    }

    public async create() {
        this.archive = new JSZip()
        await this.updateOutlinerInfo()
        await this.initOutline()
        return this.outlineShell!.outline!.id
    }

    public async clear() {
        if (!this.archive) return
        if (this.unbindOutlineObserver) this.unbindOutlineObserver()
        this.invokeSubscribers("onUnload")
        this.archive = null
        this.outlineShell = null
    }

    public getEmbeddedCRDTFile<D>(filePath: string) {
        return new EmbeddedCRDTFile<D>(this.archive!, filePath)
    }

    public getOutlineEDF() {
        return this.getEmbeddedCRDTFile<Outline>("outline.json")
    }

    public getEmbeddedContentFile(id: string, format: string) {
        return new EmbeddedContentFile(`files/${id}.json`, getRendererForFormat(format))
    }

    private invokeSubscribers(name: keyof RepositorySubscribers) {
        this.subscribers[name].forEach((l: Lambda) => l())
    }

    private async loadOutline() {
        const outlineEDF = this.getOutlineEDF()
        await outlineEDF.load()
        this.outlineShell = new OutlineShell(outlineEDF, this)
        this.outlineDidLoad()
    }

    private async initOutline() {
        const outlineEDF = this.getOutlineEDF()
        this.outlineShell = OutlineShell.create(outlineEDF, this)
        this.outlineDidLoad()
    }

    private async outlineDidLoad() {
        this.invokeSubscribers("onLoad")
        this.bindOutlineObserver()
    }

    private async updateOutlinerInfo() {
        this.archive!.file(
            "outliner.info.json",
            JSON.stringify(
                {
                    application: {
                        name: manifest.name,
                        version: manifest.version,
                    },
                    origin: location.href,
                },
                null,
                2
            )
        )
    }

    private bindOutlineObserver() {
        this.unbindOutlineObserver = autorun(() => {
            if (!this.outline) return
            this.invokeSubscribers("onUpdate")
        })
    }
}
