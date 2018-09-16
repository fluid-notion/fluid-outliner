import _debug from "debug"

import React from "react"
import { render } from "react-dom"
import { App } from "../../core/views/components/App"
import { installOfflinePlugin } from "../../core/helpers/offline-plugin-runtime"
import { configure } from "../../core/configure";

const debug = _debug("fluid-outliner:index")

debug("Installing Service Workers")
installOfflinePlugin()
configure();

const handleDeviceReady = () => {
    debug("Bootstrapping React root")
    render(<App />, document.getElementById("root"))
}

document.addEventListener("deviceready", handleDeviceReady, false)
