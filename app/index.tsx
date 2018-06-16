// @ts-ignore
import checkOutdated from "outdated-browser-rework";
// tslint:disable-next-line:no-submodule-imports
import "outdated-browser-rework/dist/style.css";

import React from "react";
import { render } from "react-dom";
import { App } from "./components/App";

checkOutdated();

render(<App />, document.getElementById("root"));
