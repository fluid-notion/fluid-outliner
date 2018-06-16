import {
  AppBar,
  Icon,
  IconButton,
  Input,
  Toolbar,
  Typography
} from "@material-ui/core";
import { Menu as MenuIcon } from "@material-ui/icons";
import React from "react";
import { injectStore } from "../models/Store";

export const Navbar = injectStore(({store}) => (
  <AppBar position="static">
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
      <IconButton color="inherit" aria-label="Menu">
        <Icon
          style={{
            marginRight: -12,
            marginLeft: 10
          }}
          onClick={store.downloadFile}
        >
            cloud_download
        </Icon>
      </IconButton>
      <Input placeholder="Search ..." style={{ flex: 1 }} />
    </Toolbar>
  </AppBar>
));
