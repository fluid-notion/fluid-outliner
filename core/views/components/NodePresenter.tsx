import React from "react"

import { observer } from "../../../node_modules/mobx-react"
import { NodeEditorProps } from "./NodeEditor";

@observer
export class NodePresenter extends React.Component<NodeEditorProps> {
    render() {
        const { defaultOutput, defaultContent } = this.props
        if (defaultOutput) {
            return <div dangerouslySetInnerHTML={{ __html: defaultOutput }} />
        }
        return defaultContent || null
    }
}
