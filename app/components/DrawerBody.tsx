import React from "react";
import Octicon from "react-octicon";
import { withStyles } from "@material-ui/core/styles";
import {
  Typography,
  Table,
  TableBody,
  TableRow,
  TableCell,
  List,
  ListItem,
  Button,
} from "@material-ui/core";

const styles = {
  container: {
    maxWidth: "300px",
    float: "left" as "left",
    marginLeft: "10px",
  },
  icon: {
    marginRight: "5px",
  },
  table: {
    "& td": {
      padding: "5px",
    },
    "& tr": {
      height: "auto",
    },
  },
};

const Section = ({ children }: any) => (
  <section
    style={{
      padding: "10px",
      margin: "10px 0",
      borderLeft: "2px dotted silver",
    }}
  >
    {children}
  </section>
);

export const DrawerBody = withStyles(styles)(({ classes }) => (
  <div className={classes.container}>
    <Typography variant="headline">Current Notebook</Typography>
    <Section>
      <Button color="primary">
        <Typography variant="body1">
          <Octicon name="desktop-download" className={classes.icon} /> Save To
          File
        </Typography>
      </Button>
      <Button color="primary">
        <Typography variant="body1">
          <Octicon name="trashcan" className={classes.icon} /> Clear Cache
        </Typography>
      </Button>
    </Section>
    <Typography variant="headline">Keybindings</Typography>
    <Section>
      <Table className={classes.table}>
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
    </Section>
    <Typography variant="headline">Credits</Typography>
    <Section>
      <Typography variant="body1">
        This project wouldn't exist without following amazing open source
        projects (and the hard work of contributors working on them).
      </Typography>
      <List dense style={{ marginLeft: "-20px" }}>
        <ListItem>
          <Octicon name="star" className={classes.icon} />
          <Typography variant="body1">mobx</Typography>
        </ListItem>
        <ListItem>
          <Octicon name="star" className={classes.icon} />
          <Typography variant="body1">mobx-state-tree</Typography>
        </ListItem>
        <ListItem>
          <Octicon name="star" className={classes.icon} />
          <Typography variant="body1">react</Typography>
        </ListItem>
        <ListItem>
          <Octicon name="star" className={classes.icon} />
          <Typography variant="body1">webpack</Typography>
        </ListItem>
        <ListItem>
          <Octicon name="star" className={classes.icon} />
          <Typography variant="body1">quill</Typography>
        </ListItem>
        <ListItem>
          <Octicon name="star" className={classes.icon} />
          <Typography variant="body1">webpack-offline</Typography>
        </ListItem>
        <ListItem>
          <Octicon name="star" className={classes.icon} />
          <Typography variant="body1">And Many More ...</Typography>
        </ListItem>
      </List>
    </Section>
  </div>
));
