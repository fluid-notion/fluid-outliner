import React from "react"
import { withStyles, Button } from "@material-ui/core"
import { palette } from "./styles/theme"

const S = withStyles({
    link: {
        color: "slategray",
        fontSize: "1.6rem",
        fontWeight: 100,
        cursor: "pointer",
        padding: "0 5px",
        minWidth: 0,
        "&:hover": {
            color: palette.primary.main,
        },
    },
});

export const SecondaryActionLink = S(({ className, classes, ...restProps }: any) => (
    <Button
        size="small"
        {...restProps}
        className={`${className || ""} ${classes.link}`}
    />
))
