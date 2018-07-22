import * as React from "react"
import { render } from "react-dom"
import { AppContainer } from "react-hot-loader"
import { App } from "../../../core/components/App"

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
        renderApp();
    })
}
