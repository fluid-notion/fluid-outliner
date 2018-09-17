import assert from "assert";
// @ts-ignore
import AutoMerge from "automerge"
import JSZip from "jszip";
import _debug from "debug"
import { EmbeddedFile } from "./EmbeddedFile";

const debug = _debug("fluid-outliner:EmbeddedDataFile")

export class EmbeddedDataFile<D extends {}> {

    private file: EmbeddedFile<"text">;
    private crdtFile: EmbeddedFile<"text">;
    private crdt?: any;
    private readonly crdtFilePath: string;

    constructor(
        private archive: JSZip,
        private filePath: string
    ) {
        assert(filePath.match(/\.json$/));
        this.crdtFilePath = this.filePath.replace(/\.json$/, '.crdt.json');
        this.file = new EmbeddedFile(this.archive, this.filePath, "text");
        this.crdtFile = new EmbeddedFile(this.archive, this.crdtFilePath, "text");
    }

    async getCRDT() {
        return JSON.parse(await this.crdtFile.read())
    }

    async load() {
        this.crdt = AutoMerge.load(await this.crdtFile.read());
    }

    public serialize() {
        return AutoMerge.save(this.crdt)
    }

    async init(crdt: D) {
        this.crdt = crdt
    }

    async save() {
        await this.file.write(JSON.stringify(this.crdt, null, 2));
        await this.crdtFile.write(this.serialize());
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
