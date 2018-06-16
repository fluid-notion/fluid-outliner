import {
  AppBar,
  Icon,
  IconButton,
  Input,
  Toolbar,
  Typography
} from "@material-ui/core";
import { withStyles, WithStyles } from "@material-ui/core/styles";
import { Menu as MenuIcon } from "@material-ui/icons";
import React from "react";
import { IStoreConsumerProps } from "../models/IProviderProps";
import { storeObserver } from "../models/Store";

const styles = {
  root: {
    position: "fixed" as "fixed",
    top: 0,
    left: 0,
    right: 0
  },
  searchInputWrapper: {
    padding: "3px",
    background: "rgba(255, 255, 255, 0.3)",
    color: "white",
    borderRadius: "4px",
    maxWidth: "1200px",
    width: "100%",
    margin: "auto",
    display: "flex",
    "@media(max-width: 700px)": {
      display: "none"
    }
  }
};

type INavbarProps = IStoreConsumerProps & WithStyles<keyof typeof styles>;

export const Navbar = withStyles(styles)(
  storeObserver(({ store, classes }: INavbarProps) => (
    <AppBar
      position="static"
      className={classes.root}
    >
      <Toolbar>
        <IconButton color="inherit" aria-label="Menu">
          <MenuIcon
            style={{
              marginLeft: -12,
              marginRight: 10
            }}
          />
        </IconButton>
        <Typography
          variant="title"
          color="inherit"
          style={{
            flex: "0 1 0%",
            whiteSpace: "nowrap",
            padding: "0 10px 0 0",
            fontWeight: 500
          }}
        >
          Fluid Notion
        </Typography>
        <div style={{flex: 1}}>
        <Input
          placeholder="Search ..."
          className={classes.searchInputWrapper}
          inputProps={{
            style: {
              padding: "10px",
              borderBottom: "1px solid rgba(255, 255, 255, 0.2)"
            }
          }}
        />
        </div>
        <IconButton color="inherit" aria-label="Menu">
          <Icon
            style={{
              marginRight: -12,
              marginLeft: 10
            }}
            onClick={store!.saveFile}
          >
            cloud_download
          </Icon>
        </IconButton>
        <IconButton color="inherit" aria-label="Menu">
          <Icon>settings</Icon>
        </IconButton>
      </Toolbar>
    </AppBar>
  ))
);
