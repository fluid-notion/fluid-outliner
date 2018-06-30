import { Typography, StyledComponentProps } from "@material-ui/core"
import Input from "@material-ui/core/Input/Input"
import { autobind } from "core-decorators"
import keycode from "keycode"
import { observable } from "mobx"
import { observer } from "mobx-react"
import React from "react"
import Octicon from "react-octicon"
import { IOutline } from "../models/Outline"
import { withStyles } from "../utils/type-overrides";

const styles = {
    input: {
        fontSize: "1.5rem",
    },
    inputWrapper: {
        margin: "10px 40px",
    },
    editControl: {
        display: "none",
        cursor: "pointer",
        color: "gray",
        marginLeft: "10px",
        // Required because: https://github.com/Microsoft/TypeScript/issues/11465#issuecomment-252453037
        position: "relative" as "relative",
        bottom: "3px",
    },
    title: {
        padding: "10px 40px",
        "&:hover $editControl": {
            display: "inline-block",
        },
    },
}

type I = { outline: IOutline } & StyledComponentProps<keyof typeof styles>


@withStyles<keyof typeof styles, I>(styles)
@observer
export class OutlineTitleEditor extends React.Component<I> {
    @observable private isEditing = false
    public render() {
        const { classes } = this.props
        if (this.isEditing) {
            return (
                <Input
                    value={this.props.outline.title}
                    onChange={this.handleTitleChange}
                    className={classes!.inputWrapper}
                    inputProps={{
                        className: this.props.classes!.input,
                        onKeyDown: this.handleTitleKeyDown,
                    }}
                />
            )
        }
        return (
            <Typography
                className={classes!.title}
                variant="headline"
                onDoubleClick={this.toggleEditing}
            >
                {this.props.outline.title}
                <Octicon
                    name="pencil"
                    className={this.props.classes!.editControl}
                    onClick={this.toggleEditing}
                />
            </Typography>
        )
    }
    @autobind
    private toggleEditing() {
        this.isEditing = !this.isEditing
    }

    @autobind
    private handleTitleChange(event: React.ChangeEvent<HTMLInputElement>) {
        this.props.outline.setTitle(event.target.value)
    }
    @autobind
    private handleTitleKeyDown(event: React.KeyboardEvent<HTMLInputElement>) {
        if (keycode(event.nativeEvent) === "enter") {
            this.isEditing = false
        }
    }
}