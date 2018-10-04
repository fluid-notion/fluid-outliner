import JSZip from "jszip"
import DMP from "diff-match-patch"
import { EmbeddedFile } from "./EmbeddedFile"
import { Maybe } from "../helpers/types";
import { EmbeddedCRDTFile } from "./EmbeddedCRDTFile";

export interface EmbeddedContent {
    content: string[]
}

export class EmbeddedContentFile extends EmbeddedCRDTFile<{ content: any }> {
    private _outputFile: Maybe<EmbeddedFile<"text">>

    constructor(
        archive: JSZip,
        filePath: string,
        private render?: (i: string) => Promise<string>
    ) {
        super(archive, filePath);
    }

    get outputFile(): EmbeddedFile<"text"> {
        if (!this._outputFile) {
            const outputFilePath = this.filePath.replace(/\.json$/, ".output.html")
            this._outputFile = new EmbeddedFile(this.archive, outputFilePath, "text")
        }
        return this._outputFile
    }

    async setContent(content: string) {
        this.makeChange(data => {
            if (!data.content) {
                data.content = new AutoMerge.Text()
                data.content.insertAt(0, ...content.split(''))
                return
            }
            const dmp = new DMP()
            const srcTxt = data.content.join('')
            const diff = dmp.diff_main(srcTxt, content)
            dmp.diff_cleanupSemantic(diff)
            const patches = dmp.patch_make(srcTxt, diff)
            patches.forEach(patch => {
                let idx = patch.start1;
                patch.diffs.forEach(([operation, changeText]) => {
                    switch (operation) {
                        case 1: // Insertion
                            data.content.insertAt(idx, ...changeText.split(""));
                        case 0: // No Change
                            idx += changeText.length;
                            break;
                        case -1: // Deletion
                            for (let i = 0; i < changeText.length; i++) {
                                data.content.deleteAt(idx);
                            }
                            break;
                    }
                });
            });
            return data
        });
    }

    async save() {
        super.save();
        if (this.render) {
            const output = await this.render(this.crdt!.content.join(''))
            this.outputFile.write(output)
        }
    }
}
