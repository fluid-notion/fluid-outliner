import React from "react";
import { withStyles, Button } from "@material-ui/core";
import { palette } from "./styles/theme";

export const SecondaryActionLink = withStyles({
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
})(({className, classes, ...restProps}: any) => (
  <Button
    size="small"
    {...restProps}
    className={`${className || ""} ${classes.link}` as any}
  />
));
