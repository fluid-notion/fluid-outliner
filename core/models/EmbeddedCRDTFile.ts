import assert from "assert";
import _debug from "debug"
// @ts-ignore
import AutoMerge from "automerge"
import JSZip from "jszip"
import { EmbeddedFile } from "./EmbeddedFile";
import { Maybe } from "../helpers/types";
import { observable } from "../../node_modules/mobx";

const debug = _debug("fluid-outliner:EmbeddedDataFile")

export class EmbeddedCRDTFile<D extends {}> {
    private _file: Maybe<EmbeddedFile<"text">>
    private _crdtFile: Maybe<EmbeddedFile<"text">>

    // TODO: Deep Read only
    @observable.ref public crdt?: Readonly<D>

    constructor(
        protected archive: JSZip,
        protected filePath: string
    ) {
        assert(filePath.match(/\.json$/))
    }

    get file(): EmbeddedFile<"text"> {
        this._file = this._file || new EmbeddedFile(this.archive, this.filePath, "text")
        return this._file
    }

    get crdtFile(): EmbeddedFile<"text"> {
        if (!this._crdtFile) {
            const crdtFilePath = this.filePath.replace(/.json$/, ".crdt.json")
            this._crdtFile = new EmbeddedFile(this.archive, crdtFilePath, "text")
        }
        return this._crdtFile
    }

    async safeLoad() {
        if (this.crdtFile.isPersisted()) {
            await this.load()
        } else {
            this.crdt = AutoMerge.change(AutoMerge.init(), (doc: any) => {
                doc.content = new AutoMerge.Text()
            });
        }
    }

    async load() {
        this.crdt = AutoMerge.load(await this.crdtFile.read())
    }

    public serialize() {
        return AutoMerge.save(this.crdt)
    }

    async init(crdt: D) {
        this.crdt = crdt
    }

    async save() {
        await this.file.write(JSON.stringify(this.crdt, null, 2))
        await this.crdtFile.write(this.serialize())
    }

    public async makeChange(mutate: (doc: D) => void, msg = "Update outline") {
        const oldDoc = this.crdt
        const newDoc = AutoMerge.change(oldDoc, msg, mutate)
        const changes = AutoMerge.getChanges(oldDoc, newDoc)
        debug("Updated outline", newDoc)
        debug("Changes:", changes)
        this.crdt = newDoc
        await this.save()
    }

}
