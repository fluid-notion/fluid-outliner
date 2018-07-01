import React from "react"
import { INode } from "../models/Node"
import { IMaybe } from "../utils/UtilTypes"
import { observer } from "mobx-react"
import { autobind } from "core-decorators"
import { IOutlineVisitState } from "../models/OutlineVisitState"
import Octicon from "react-octicon"
import { DrawerSection } from "./DrawerSection"
import { DrawerActionItem } from "./DrawerActionItem"
import { palette } from "./styles/theme"

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
        const items = this.items
        return (
            <DrawerSection title="Zoomed Out" show={items.length > 0}>
                {items.map(item => (
                    <DrawerActionItem
                        onClick={() => this.zoomUpTo(item)}
                        icon={
                            <Octicon
                                name="triangle-up"
                                style={{ color: palette.primary.light }}
                            />
                        }
                        label={item.node.content}
                    />
                ))}
            </DrawerSection>
        )
    }
    @autobind
    private zoomUpTo(item: IStackRepr) {
        for (let i = 0; i < item.numPastCheckpoints; i++) {
            this.props.visitState.zoomOut()
        }
        this.props.visitState.zoomIn(item.node)
    }
    private get items() {
        const { zoomStack } = this.props.visitState
        const arr: IStackRepr[] = []
        if (zoomStack.length === 0) return arr
        let stackPos = zoomStack.length - 2
        let curNode: IMaybe<INode> = zoomStack[zoomStack.length - 1].parent
        while (curNode) {
            const isCheckpoint =
                stackPos >= 0 && zoomStack[stackPos].id === curNode.id
            arr.unshift({
                node: curNode,
                isCheckpoint,
                numPastCheckpoints: zoomStack.length - 1 - stackPos,
            })
            curNode = curNode.parent
            if (isCheckpoint) {
                stackPos--
            }
        }
        return arr
    }
}
