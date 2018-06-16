import _debug from "debug";

// @ts-ignore
import checkOutdated from "outdated-browser-rework";
// tslint:disable-next-line:no-submodule-imports
import "outdated-browser-rework/dist/style.css";

import React from "react";
import { render } from "react-dom";
import { App } from "./components/App";
import { installOfflinePlugin } from "./utils/offline-plugin-runtime";

const debug = _debug("fluid-outliner:index");

debug("Checking Outdated browser");
checkOutdated();

debug("Installing Service Workers");
installOfflinePlugin();

debug("Bootstrapping React root");
render(<App />, document.getElementById("root"));
