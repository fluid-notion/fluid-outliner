import JSZip, { OutputType } from "jszip"

export class EmbeddedFile<T extends OutputType> {
    constructor(private readonly archive: JSZip, private readonly filePath: string, private readonly outputType: T) {}

    isPersisted() {
        return !!this.archive.file(this.filePath)
    }

    read() {
        return this.archive.file(this.filePath).async(this.outputType)
    }

    write(content: any) {
        return this.archive.file(this.filePath, content)
    }
}
