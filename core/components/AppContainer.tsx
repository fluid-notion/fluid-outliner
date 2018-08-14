import { CssBaseline, MuiThemeProvider } from "@material-ui/core"
import { BrowserRouter as Router } from "react-router-dom"
import { Provider } from "mobx-react"
import React from "react"

import { theme } from "./styles/theme"
import { store } from "../store"

export class AppContainer extends React.Component {
    public shouldComponentUpdate() {
        return false
    }

    public render() {
        return (
            <>
                <CssBaseline />
                <Provider store={store}>
                    <MuiThemeProvider theme={theme}>
                        <Router>{this.props.children}</Router>
                    </MuiThemeProvider>
                </Provider>
            </>
        )
    }
}
