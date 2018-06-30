import React from "react";
import { INode } from "../models/Node";
import { IMaybe } from "../utils/UtilTypes";
import { Button, Typography } from "@material-ui/core";
import { observer } from "mobx-react";
import { autobind } from "core-decorators";
import { IOutlineVisitState } from "../models/OutlineVisitState";
import Octicon from "react-octicon";

interface IZoomStackProps {
    visitState: IOutlineVisitState
}

interface IStackRepr {
    node: INode
    isCheckpoint: boolean
    numPastCheckpoints: number
}

@observer
export class ZoomStack extends React.Component<IZoomStackProps> {
    public render() {
        return (
            <>
                <Typography variant="headline">Zoomed Out Nodes</Typography>
                {this.items.map((item) => (
                    <Button onClick={() => this.zoomUpTo(item)} variant="text">
                        <Octicon name="triangle-up"/> {item.node.content}
                    </Button>
                ))}
            </>
        )
    }
    @autobind
    private zoomUpTo(item: IStackRepr) {
        for (let i = 0; i < item.numPastCheckpoints; i++) {
            this.props.visitState.zoomOut();
        }
        this.props.visitState.zoomIn(item.node);
    }
    private get items() {
        const {zoomStack} = this.props.visitState;
        let stackPos = zoomStack.length - 1;
        let curNode: IMaybe<INode> = zoomStack[stackPos];
        const arr: IStackRepr[] = [];
        while (curNode) {
            const isCheckpoint = zoomStack[stackPos].id === curNode.id
            arr.unshift({
                node: curNode,
                isCheckpoint,
                numPastCheckpoints: (zoomStack.length - 1 - stackPos)
            })
            curNode = curNode.parent;
            if (isCheckpoint) {
                stackPos--;
            }
        }
        return arr;
    }
}