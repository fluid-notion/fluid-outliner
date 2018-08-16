import React from "react"
import { autobind } from "core-decorators"
import { TextField, Typography } from "@material-ui/core";
import { observer } from "mobx-react";
import { observable, action } from "mobx";
import Octicon from "react-octicon"

import { StyleProps, styled } from "../helpers/type-overrides";
import { OutlineViewModel } from "../models/OutlineViewModel";

const styles = {
    presenterContainer: {
        margin: "0 10px",
        display: "flex",
        lineHeight: "40px"
    },
    presenter: {
        lineHeight: "40px"
    },
    editControl: {
        marginRight: "5px",
        color: "gray",
        cursor: "pointer",
        "&:hover": {
            color: "black"
        }
    },
    btnControl: {
        cursor: "pointer"
    }
}

interface TitleEditorProps {
    outline: OutlineViewModel
}

@styled<TitleEditorProps, typeof styles>(styles)
@observer
export class TitleEditor extends React.Component<StyleProps<TitleEditorProps, typeof styles>> {
    @observable
    public isEditing = false

    @observable
    private value = this.props.outline.title || ""

    public render() {
        const classes = this.props.classes!
        if (!this.isEditing) {
            return (
                <div className={classes.presenterContainer}>
                    <a onClick={this.enableEditing} className={classes.editControl}><Octicon name="pencil" /></a>
                    <Typography variant="title" className={classes.presenter}>{this.props.outline.title}</Typography>
                </div>
            );
        }
        return (
            <div className={classes.presenterContainer}>
                <TextField defaultValue={this.value} onChange={this.onChange} />
                <a onClick={this.confirmEdit} className={classes.btnControl}><Octicon name="check" /></a>
                <a onClick={this.rejectEdit} className={classes.btnControl}><Octicon name="x" /></a>
            </div>
        );
    }

    @action.bound
    private onChange(event: React.ChangeEvent<HTMLInputElement>) {
        this.value = event.target.value
    }

    @autobind
    private enableEditing() {
        this.isEditing = true
    }

    @autobind
    private confirmEdit() {
        this.props.outline.outlineShellProxy.setTitle(this.value)
        this.isEditing = false
    }

    @autobind
    private rejectEdit() {
        this.value = this.props.outline.title || ""
        this.isEditing = false
    }
}
