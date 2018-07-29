import { CssBaseline, MuiThemeProvider } from "@material-ui/core"

import { Provider } from "mobx-react"
import React from "react"

import { Body } from "./Body"
import { theme } from "./styles/theme"
import { ModalContainer } from "./ModalContainer"
import { store } from "../store"

export class App extends React.Component {
    public shouldComponentUpdate() {
        return false
    }

    public render() {
        return (
            <>
                <CssBaseline />
                <Provider store={store}>
                    <MuiThemeProvider theme={theme}>
                        <ModalContainer>
                            <Body />
                        </ModalContainer>
                    </MuiThemeProvider>
                </Provider>
            </>
        )
    }
}
