import {
  AppBar,
  IconButton,
  Input,
  Toolbar,
  Typography,
} from "@material-ui/core";
import {
  withStyles,
  WithStyles,
  StyledComponentProps,
} from "@material-ui/core/styles";
import React from "react";
import { IStoreConsumerProps } from "../models/IProviderProps";
import flow from "lodash/flow";
import Octicon from "react-octicon";
import { observer, inject } from "mobx-react";
import { IModalConsumerProps } from "./ModalContainer";

const styles = {
  root: {
    position: "fixed" as "fixed",
    top: 0,
    left: 0,
    right: 0,
  },
  icon: {
    fontSize: "1.5rem",
    position: "relative" as "relative"
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
      display: "none",
    },
  },
};

interface INavbarCommonProps {
  toggleDrawer: () => void;
}

type INavbarInnerProps = WithStyles<keyof typeof styles> &
  INavbarCommonProps &
  IStoreConsumerProps &
  IModalConsumerProps;

type INavbarProps = INavbarCommonProps &
  StyledComponentProps<keyof typeof styles>;

export const NavbarInner = ({
  store,
  classes,
  toggleDrawer,
  modal,
}: INavbarInnerProps) => (
  <AppBar position="static" className={classes.root}>
    <Toolbar>
      <IconButton color="inherit" aria-label="Menu" onClick={toggleDrawer}>
        <Octicon name="settings" className={classes.icon} />
      </IconButton>
      <Typography
        variant="title"
        color="inherit"
        style={{
          flex: "0 1 0%",
          whiteSpace: "nowrap",
          padding: "0 10px 0 0",
          fontWeight: 500,
        }}
      >
        Fluid Notion
      </Typography>
      <div style={{ flex: 1 }}>
        <Input
          placeholder="Search ..."
          className={classes.searchInputWrapper}
          value={(store!.visitState && store!.visitState!.searchQuery) || ""}
          onChange={event =>
            store!.visitState!.setSearchQuery(event.target.value)
          }
          inputProps={{
            style: {
              padding: "10px",
              borderBottom: "1px solid rgba(255, 255, 255, 0.2)",
            },
          }}
        />
      </div>
      <IconButton color="inherit" aria-label="Menu" onClick={store.saveFile}>
        <Octicon
          name="desktop-download"
          className={classes.icon}
        />
      </IconButton>
      <IconButton
        color="inherit"
        aria-label="Menu"
        onClick={() => modal.activate("FileSelectionDialog")}
      >
        <Octicon
          name="desktop-download"
          className={classes.icon}
          style={{
            transform: "rotate(180deg)",
          }}
        />
      </IconButton>
    </Toolbar>
  </AppBar>
);

export const Navbar: React.ComponentType<INavbarProps> = flow(
  observer,
  withStyles(styles),
  inject(({ store, modal }: IStoreConsumerProps & IModalConsumerProps) => ({
    store,
    modal,
  }))
)(NavbarInner) as any;
