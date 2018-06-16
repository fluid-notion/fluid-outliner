import { CssBaseline, MuiThemeProvider } from "@material-ui/core";

import { Provider } from "mobx-react";
import React from "react";
import { Store } from "../models/Store";
import { Body } from "./Body";
import { Navbar } from "./NavBar";
import { theme } from "./styles/theme";

const store = Store.create();

export const App = () => (
  <>
    <CssBaseline />
    <Provider store={store}>
      <MuiThemeProvider theme={theme}>
        <Navbar />
        <Body />
      </MuiThemeProvider>
    </Provider>
  </>
);
