import React from "react"
import { Navbar } from "./NavBar"
import { observer, inject } from "mobx-react"

import { RepositoryViewModel } from "../models/RepositoryViewModel"
import { OutlineEditor } from "./OutlineEditor"

interface AppProps {
    repository?: RepositoryViewModel
}

@inject("repository")
@observer
export class App extends React.Component<AppProps> {
    private searchRef = React.createRef<any>()

    get repository() {
        return this.props.repository!
    }

    get outline() {
        return this.repository && this.repository.outline
    }

    public render() {
        return (
            <div
                style={{
                    position: "absolute",
                    left: 0,
                    right: 0,
                    top: "65px",
                    bottom: 0,
                    overflow: "auto",
                }}
                tabIndex={0}
            >
                <Navbar
                    toggleDrawer={() => { }}
                    searchRef={this.searchRef}
                    drawerOpen={() => { }}
                    repository={this.repository}
                />
                {this.outline && <OutlineEditor outline={this.outline} />}
            </div>
        )
    }
}
