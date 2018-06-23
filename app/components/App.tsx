import { CssBaseline, MuiThemeProvider } from "@material-ui/core";

import { Provider } from "mobx-react";
import React from "react";
import { DragDropContextProvider } from "react-dnd";
import HTML5Backend from "react-dnd-html5-backend";

import { Store } from "../models/Store";
import { Body } from "./Body";
import { theme } from "./styles/theme";
import { ModalContainer } from "./ModalContainer";

const store = Store.create();

export class App extends React.Component {
  public shouldComponentUpdate() {
    return false;
  }

  public render() {
    return (
      <>
        <CssBaseline />
        <DragDropContextProvider backend={HTML5Backend}>
          <Provider store={store}>
            <MuiThemeProvider theme={theme}>
              <ModalContainer>
                <Body />
              </ModalContainer>
            </MuiThemeProvider>
          </Provider>
        </DragDropContextProvider>
      </>
    );
  }
}
