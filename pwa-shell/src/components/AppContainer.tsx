import { CssBaseline, MuiThemeProvider } from "@material-ui/core"
import { Provider, observer } from "mobx-react"
import React from "react"
import { observable } from "mobx"

import { theme } from "../../../core/views/styles/theme"
import { RouteViewModel } from "../../../core/views/models/RouteViewModel"
import { ModalContainer } from "./ModalContainer"
import { RepositoryViewModel } from "../../../core/views/models/RepositoryViewModel"
import { Maybe } from "../../../core/helpers/types"
import { RoutePersistenceCoordinator } from "../helpers/RoutePersistenceCoordinator"

// @ts-ignore
import RepositoryWorker from "worker-loader!../models/Repository"

@observer
export class AppContainer extends React.Component {
    private route: RouteViewModel
    private routePersistenceCoordinator: Maybe<RoutePersistenceCoordinator>
    @observable private repository: Maybe<RepositoryViewModel>

    constructor(props: {}) {
        super(props)
        this.route = RouteViewModel.instance()
    }

    public async componentDidMount() {
        this.route.observe()
        this.repository = await RepositoryViewModel.instance(RepositoryWorker)
        this.route = await RouteViewModel.instance()
        this.routePersistenceCoordinator = new RoutePersistenceCoordinator(this.route, this.repository!)
        this.routePersistenceCoordinator.init()
    }

    public render() {
        return (
            <>
                <CssBaseline />
                {this.repository && (
                    <Provider
                        route={this.route}
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
