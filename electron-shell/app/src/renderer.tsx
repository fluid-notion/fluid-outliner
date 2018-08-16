import * as React from "react"
// import * as fs from "fs"
import { render } from "react-dom"
// import { ipcRenderer } from "electron"
import { AppContainer } from "react-hot-loader"

import { App } from "../../../core/views/components/App"

const renderApp = () => {
    render(
        <AppContainer>
            <App />
        </AppContainer>,
        document.getElementById("root")
    )
}

renderApp()

if ((module as any).hot) {
    ;(module as any).hot.accept("../../../core/components/App", () => {
        renderApp()
    })
}

// ipcRenderer.on("fno:visit-file", (_event: any, filePath: string) => {
//     store.loadFileContent(
//         fs.readFileSync(filePath, {
//             encoding: "utf-8",
//         })
//     )
// })
