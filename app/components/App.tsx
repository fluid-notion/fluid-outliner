import {
  AppBar,
  CssBaseline,
  IconButton,
  MuiThemeProvider,
  Toolbar,
  Typography
} from "@material-ui/core";
import { Menu as MenuIcon } from "@material-ui/icons";
import { Provider } from "mobx-react";
import React from "react";
import { Store } from "../models/Store";
import { Body } from "./Body";
import { theme } from "./styles/theme";

const store = Store.create();

export const App = () => (
  <>
    <CssBaseline />
    <Provider store={store}>
      <MuiThemeProvider theme={theme}>
        <AppBar position="static">
          <Toolbar>
            <IconButton color="inherit" aria-label="Menu">
              <MenuIcon
                style={{
                  marginLeft: -12,
                  marginRight: 20
                }}
              />
            </IconButton>
            <Typography variant="title" color="inherit" style={{ flex: 1 }}>
              Fluid Notion
            </Typography>
          </Toolbar>
        </AppBar>
        <Body />
      </MuiThemeProvider>
    </Provider>
  </>
);
