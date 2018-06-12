import * as React from "react";
import {render} from "react-dom";

const rootEl = document.createElement("div");
rootEl.setAttribute("id", "root");
document.body.appendChild(rootEl);

render(<div>Hello</div>, rootEl);