import { CssBaseline, MuiThemeProvider } from "@material-ui/core"
import { Provider, observer } from "mobx-react"
import React from "react"

import { theme } from "../../../core/components/styles/theme"
import { RouteState } from "../../../core/models/RouteState"
import { ModalContainer } from "./ModalContainer"
import { RoutePersistenceCoordinator } from "../utils/RoutePersistenceCoordinator"
import * as RepositoryClient from "../../../core/utils/repository-client"
import { observable } from "mobx"
import { IMaybe } from "../../../core/utils/UtilTypes"

// @ts-ignore
import RepositoryWorker from "worker-loader!../utils/repository"

@observer
export class AppContainer extends React.Component {
    private routeState: RouteState
    private routePersistenceCoordinator: IMaybe<RoutePersistenceCoordinator>

    @observable private repository: IMaybe<import("../../../core/utils/repository").Repository>

    constructor(props: {}) {
        super(props)
        this.routeState = RouteState.instance()
    }

    public async componentDidMount() {
        this.routeState.observe()
        this.repository = await RepositoryClient.instance(new RepositoryWorker())
        this.routePersistenceCoordinator = new RoutePersistenceCoordinator(this.routeState, this.repository!)
        this.routePersistenceCoordinator.init()
    }

    public render() {
        return (
            <>
                <CssBaseline />
                {this.repository && (
                    <Provider
                        routeState={this.routeState}
                        routePersistenceCoordinator={this.routePersistenceCoordinator}
                        repository={this.repository}
                    >
                        <MuiThemeProvider theme={theme}>
                            <ModalContainer>{this.props.children}</ModalContainer>
                        </MuiThemeProvider>
                    </Provider>
                )}
            </>
        )
    }
}
