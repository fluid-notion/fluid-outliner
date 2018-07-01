import React from "react"
import { observable } from "mobx"
import { observer } from "mobx-react"
import { Typography, Button, Icon } from "@material-ui/core"
import { Link } from "./Link"
import { autobind } from "core-decorators"
import { clearLocal } from "../utils/persistence"

@observer
export class BodyErrorWrapper extends React.Component {
    @observable private error?: Error

    public componentDidCatch(error: Error) {
        this.error = error
    }

    public render() {
        if (this.error) {
            return (
                <div style={{ textAlign: "center", margin: "100px 0" }}>
                    <Typography
                        variant="display1"
                        style={{
                            color: "maroon",
                        }}
                    >
                        Something went wrong!
                    </Typography>
                    <Typography variant="title" style={{ margin: "40px 0" }}>
                        Fluid Outliner encountered an error which it could not
                        recover from.
                        <br />
                        Please report this in our{" "}
                        <Link href="https://github.com/fluid-notion/fluid-outliner/issues">
                            issue tracker
                        </Link>.
                    </Typography>
                    <Button onClick={this.reset} variant="contained">
                        <Icon style={{ marginRight: "5px" }}>cached</Icon> Reset
                        State
                    </Button>
                </div>
            )
        }
        return this.props.children
    }

    @autobind
    private reset() {
        clearLocal()
        location.reload()
    }
}
