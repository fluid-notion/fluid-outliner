import _debug from "debug"

import React from "react"
import { render } from "react-dom"
import { App } from "../../core/components/App"
import { installOfflinePlugin } from "../../core/utils/offline-plugin-runtime"

const debug = _debug("fluid-outliner:index")

debug("Installing Service Workers")
installOfflinePlugin()

debug("Bootstrapping React root")
render(<App />, document.getElementById("root"))
