import React from "react"
import { Navbar } from "./NavBar";
import { observer, inject } from "mobx-react";
import { IRepositoryClient } from "../utils/repository-client";
import { OutlineWindowPresenter } from "./OutlineWindowPresenter";

interface IAppProps {
    repository?: IRepositoryClient
}

@inject('repository')
@observer
export class App extends React.Component<IAppProps> {
    
    private searchRef = React.createRef<any>()

    get repository() {
        return this.props.repository!
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
                    toggleDrawer={() => {}}
                    searchRef={this.searchRef}
                    drawerOpen={() => {}}
                />
                <OutlineWindowPresenter />
            </div>
        )
    }

}