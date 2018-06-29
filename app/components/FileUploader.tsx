import { ButtonBase } from "@material-ui/core"
import { autobind } from "core-decorators"
import { observable } from "mobx"
import React from "react"
import { injectStore, IStore } from "../models/Store"

@injectStore
export class FileUploader extends React.Component<{
    store?: IStore
    dismiss: () => void
}> {
    @observable private isDragActive = false
    public render() {
        return (
            <ButtonBase
                style={{
                    textAlign: "center",
                    padding: "30px",
                    flexGrow: 1,
                    fontSize: "1.5rem",
                    color: "silver",
                    whiteSpace: "nowrap",
                    border: this.isDragActive
                        ? "2px dotted blue"
                        : "2px dotted silver",
                }}
            >
                <div
                    onDragEnter={this.handleDragEnter}
                    onDragLeave={this.handleDragLeave}
                    onDragOver={this.handleDragOver}
                    onDrop={this.handleDrop}
                >
                    Drop File Here
                </div>
            </ButtonBase>
        )
    }
    @autobind
    private handleDragEnter() {
        this.isDragActive = true
    }
    @autobind
    private handleDragLeave() {
        this.isDragActive = false
    }
    @autobind
    private handleDragOver(event: React.DragEvent<HTMLDivElement>) {
        event.stopPropagation()
        event.preventDefault()
        event.dataTransfer.dropEffect = "copy"
    }
    @autobind
    private handleDrop(event: React.DragEvent<HTMLDivElement>) {
        event.stopPropagation()
        event.preventDefault()
        const { files } = event.dataTransfer
        if (files.length === 0) {
            return
        }
        if (files.length > 1) {
            alert("Uploading multiple files is not supported")
        }
        const file = files[0]
        const reader = new FileReader()
        reader.onload = (progEvent: FileReaderProgressEvent) => {
            const result = progEvent.target!.result
            if (this.props.store!.loadFileContent(result)) {
                this.props.dismiss()
            }
        }
        reader.readAsText(file)
    }
}
