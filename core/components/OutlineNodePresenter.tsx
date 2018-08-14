import React from "react"
import Octicon from "react-octicon"
import {inject} from "mobx-react"
import { INodeInfo } from "../utils/OutlineWindow"
import { IRepositoryClient } from "../utils/repository-client";
import { autobind } from "core-decorators";

@inject('repository')
export class OutlineNodePresenter extends React.Component<{ nodeInfo: INodeInfo, repository?: IRepositoryClient }> {
    public render() {
        return (
            <div
                style={{
                    margin: "10px",
                    marginLeft: `${this.props.nodeInfo.level * 20}px`,
                    borderLeft: "1px solid silver",
                    paddingLeft: "5px"
                }}
                tabIndex={0}
            >
                {this.props.nodeInfo.node.content}
                <div>
                    <a onClick={this.handleAddNode}>
                        <Octicon name="plus" />
                    </a>
                    <a>
                        <Octicon name="triangle-right" />
                    </a>
                </div>
            </div>
        )
    }
    
    @autobind
    private async handleAddNode() {
        debugger
        (await this.props.repository!.getOutlineManager())!.addNode(this.props.nodeInfo.node.id)
    }
}
