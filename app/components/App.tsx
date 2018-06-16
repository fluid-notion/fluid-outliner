import { CssBaseline, MuiThemeProvider } from "@material-ui/core";

import { observable } from "mobx";
import { observer, Provider } from "mobx-react";
import React from "react";
import { IStoreConsumerProps } from "../models/IProviderProps";
import { Store } from "../models/Store";
import { Body } from "./Body";
import { Loader } from "./Loader";
import { Navbar } from "./NavBar";
import { theme } from "./styles/theme";

const store = Store.create();

@observer
export class App extends React.Component<IStoreConsumerProps> {
  @observable private isPreloading = true;
  public componentDidMount() {
    store.restoreSaved().then(() => {
      this.isPreloading = false;
    });
  }
  public render() {
    return (
      <>
        <CssBaseline />
        <Provider store={store}>
          <MuiThemeProvider theme={theme}>
            <Navbar />
            {this.isPreloading ? <Loader /> : <Body />}
          </MuiThemeProvider>
        </Provider>
      </>
    );
  }
}
