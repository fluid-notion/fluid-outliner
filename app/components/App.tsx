import { CssBaseline, MuiThemeProvider } from "@material-ui/core";

import { observable } from "mobx";
import { observer, Provider } from "mobx-react";
import React from "react";
import { DragDropContextProvider } from "react-dnd";
import HTML5Backend from "react-dnd-html5-backend";
import { asyncComponent } from "react-async-component";

import { Store } from "../models/Store";
import { Body } from "./Body";
import { Loader } from "./Loader";
import { Navbar } from "./NavBar";
import { theme } from "./styles/theme";
import { autobind } from "core-decorators";
import { ModalContainer } from "./ModalContainer";

const store = Store.create();

const DrawerBody = asyncComponent({
  resolve: async () => (await import("./DrawerBody")).DrawerBody,
});

@observer
export class App extends React.Component {
  @observable private isPreloading = true;

  @observable private drawerOpen = false;

  public componentDidMount() {
    store.restoreSaved().then(() => {
      this.isPreloading = false;
    });
  }
  public render() {
    return (
      <>
        <CssBaseline />
        <DragDropContextProvider backend={HTML5Backend}>
          <Provider store={store}>
            <MuiThemeProvider theme={theme}>
              <ModalContainer>
                <Navbar toggleDrawer={this.toggleDrawer} />
                {this.drawerOpen && <DrawerBody />}
                {this.isPreloading ? <Loader /> : <Body />}
              </ModalContainer>
            </MuiThemeProvider>
          </Provider>
        </DragDropContextProvider>
      </>
    );
  }

  @autobind
  private toggleDrawer() {
    this.drawerOpen = !this.drawerOpen;
  }
}
