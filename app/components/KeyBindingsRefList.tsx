import React from "react"
import {
    Typography,
    Table,
    TableBody,
    TableRow,
    TableCell,
    withStyles,
    StyledComponentProps,
} from "@material-ui/core"
import { table } from "./styles/drawer";

const styles = {table};

export const KeyBindingsRefList = withStyles(styles)(({ classes }: StyledComponentProps<keyof typeof styles>) => (
    <Table className={classes!.table}>
        <TableBody>
            <TableRow>
                <TableCell>Save To File</TableCell>
                <TableCell>Ctrl+S</TableCell>
            </TableRow>
            <TableRow>
                <TableCell>Find</TableCell>
                <TableCell>Ctrl+F</TableCell>
            </TableRow>
            <TableRow>
                <TableCell colSpan={2}>
                    <Typography variant="body2">For Selected Node:</Typography>
                </TableCell>
            </TableRow>
            <TableRow>
                <TableCell>Shift Up</TableCell>
                <TableCell>Shift+Up</TableCell>
            </TableRow>
            <TableRow>
                <TableCell>Shift Down</TableCell>
                <TableCell>Shift+Down</TableCell>
            </TableRow>
            <TableRow>
                <TableCell>Navigate</TableCell>
                <TableCell>Up/Down</TableCell>
            </TableRow>
            <TableRow>
                <TableCell>Indent Further</TableCell>
                <TableCell>Tab</TableCell>
            </TableRow>
            <TableRow>
                <TableCell>Indent Back</TableCell>
                <TableCell>Shift+Tab</TableCell>
            </TableRow>
            <TableRow>
                <TableCell>Enable Edit</TableCell>
                <TableCell>Enter</TableCell>
            </TableRow>
            <TableRow>
                <TableCell>Disable Edit</TableCell>
                <TableCell>Esc</TableCell>
            </TableRow>
            <TableRow>
                <TableCell>Add new note below</TableCell>
                <TableCell>Shift+Enter</TableCell>
            </TableRow>
        </TableBody>
    </Table>
))
