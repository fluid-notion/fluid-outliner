import * as Comlink from "comlink"
import JSZip from "jszip"
import { v4 as uuid } from "uuid"
import assert from "assert"
import pull from "lodash/pull"

import { IMaybe, INewable } from "./UtilTypes"
// @ts-ignore
import manifest from "../../package.json"
import { OutlineWindow } from "./OutlineWindow"
import { IObservableValue, Lambda, autorun } from "mobx"
import { OutlineManager, IOutline } from "./OutlineManager"
import _debug from "debug"

const debug = _debug("fluid-outliner:repository")

export const emptySnapshot = () => {
    const outlineId = uuid()
    const nodeId = uuid()
    return {
        outline: {
            id: outlineId,
            title: "Untitled",
            allNodes: {
                [nodeId]: {
                    id: nodeId,
                    content: "Enter text here",
                    outline: outlineId,
                    parent: null,
                    children: [],
                },
            },
            children: [nodeId],
        },
    }
}

export const wrapSnapshot = (snapshot = emptySnapshot()) => ({
    application: {
        manifest: {
            name: manifest.name,
            version: manifest.version,
        },
        origin: location.href,
    },
    snapshot,
})

export interface IRepositoryPlugin {
    register(repository: Repository): void
}

export interface IRepositoryPluginCtor extends INewable<IRepositoryPlugin> {
    ID: string
}

export interface IOutlineBox extends IObservableValue<IMaybe<IOutline>> {}

interface IRepositorySubscribers {
    onLoad: Lambda[]; 
    onUpdate: Lambda[]; 
    onUnload: Lambda[]; 
}

export class Repository {
    public static plugins: IRepositoryPluginCtor[] = []

    public outlineManager: IMaybe<OutlineManager>

    public archive: IMaybe<JSZip>

    public plugins: { [key: string]: IRepositoryPlugin } = {}

    private outlineWindow: IMaybe<OutlineWindow>
    private unbindOutlineObserver: IMaybe<Lambda>
    private subscribers: IRepositorySubscribers;

    constructor() {
        this.subscribers = {
            onLoad: [],
            onUpdate: [],
            onUnload: []
        }
        Repository.plugins.forEach((pluginCtor: IRepositoryPluginCtor) => {
            const plugin = new pluginCtor()
            this.plugins[pluginCtor.ID] = plugin
            plugin.register(this)
        })
    }

    public onLoad(lambda: Lambda) {
        this.subscribers.onLoad.push(lambda)
        if (this.outline) {
            this.invokeSubscribers('onLoad')
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

    public get outline(): IMaybe<IOutline> {
        if (this.outlineManager) {
            return this.outlineManager.outline
        }
        return null
    }

    public async getId() {
        if (this.outline) return this.outline.id
        return undefined
    }

    public async getOutlineManager() {
        if (this.outlineManager) return Comlink.proxyValue(this.outlineManager)
        return null
    }

    public async getOutlineWindow() {
        if (this.outlineWindow) return Comlink.proxyValue(this.outlineWindow)
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
        return this.outlineWindow!.id
    }

    public async clear() {
        if (!this.archive) return
        if (this.unbindOutlineObserver) this.unbindOutlineObserver()
        this.invokeSubscribers('onUnload')
        this.archive = null
        this.outlineManager = null
    }
    
    private invokeSubscribers(name: (keyof IRepositorySubscribers)) {
        this.subscribers[name].forEach(l => l())
    }

    private async loadOutline() {
        const raw = await this.archive!.file("outline.automerge.json").async("text")
        this.outlineManager = OutlineManager.load(raw)
        this.outlineDidLoad()
    }

    private async initOutline() {
        this.outlineManager = OutlineManager.create()
        this.saveToArchive()
        this.outlineDidLoad()
    }

    private async outlineDidLoad() {
        this.outlineWindow = new OutlineWindow(this.outlineManager!, this.archive!)
        this.invokeSubscribers('onLoad')
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
            this.saveToArchive()
            this.invokeSubscribers('onUpdate')
        })
    }

    private saveToArchive() {
        debug("Updating archive")
        assert(this.outlineManager)
        this.archive!.file("outline.json", JSON.stringify(this.outline, null, 2))
        this.archive!.file("outline.automerge.json", this.outlineManager!.serialize())
    }
}
