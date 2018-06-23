import React from "react";
import Octicon from "react-octicon";
import {
  withStyles,
  StyledComponentProps,
  WithStyles,
} from "@material-ui/core/styles";
import * as R from "ramda";
import { Typography, List, ListItem, Button } from "@material-ui/core";
import { Link } from "./Link";
import { KeyBindingsGlossary } from "./KeyBindingsGlossary";
import { IStoreConsumerProps } from "../models/IProviderProps";
import { IModalConsumerProps } from "./ModalContainer";
import { inject } from "mobx-react";
import { clearLocal } from "../utils/persistence";

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

export const DrawerBody: React.ComponentType<
  StyledComponentProps<keyof typeof styles>
> = withStyles(styles)(
  inject(({ store, modal }: IStoreConsumerProps & IModalConsumerProps) => ({
    store,
    modal,
  }))(
    ({
      classes,
      store,
      modal,
    }: WithStyles<keyof typeof styles> &
      IStoreConsumerProps &
      IModalConsumerProps) => (
      <div className={classes.container}>
        <Typography variant="headline">Current Notebook</Typography>
        <Section>
          <Button color="primary" onClick={store.saveFile}>
            <Typography variant="body1">
              <Octicon name="desktop-download" className={classes.icon} />
              Save To File
            </Typography>
          </Button>
          <Button
            color="primary"
            onClick={async () => {
              await clearLocal();
              location.reload();
            }}
          >
            <Typography variant="body1">
              <Octicon name="trashcan" className={classes.icon} />
              Clear Cache
            </Typography>
          </Button>
          <Button
            color="primary"
            onClick={() => {
              modal.activate("FileSelectionDialog");
            }}
          >
            <Typography variant="body1">
              <Octicon name="repo-push" className={classes.icon} />
              Open / Create Outline
            </Typography>
          </Button>
        </Section>
        <Typography variant="headline">Keybindings</Typography>
        <Section>
          <KeyBindingsGlossary classes={R.pick(["table"], classes)} />
        </Section>
        <Typography variant="headline">Credits</Typography>
        <Section>
          <Typography variant="body1">
            This project wouldn't exist without following amazing open source
            projects
            <br />
            (and the hard work of contributors working on them).
          </Typography>
          <List dense style={{ marginLeft: "-20px" }}>
            <ListItem>
              <Octicon name="star" className={classes.icon} />
              <Typography variant="body1">
                <Link href="https://mobx.js.org">Mobx</Link> &{" "}
                <Link href="https://github.com/mobxjs/mobx-state-tree">
                  MST
                </Link>
              </Typography>
            </ListItem>
            <ListItem>
              <Octicon name="star" className={classes.icon} />
              <Typography variant="body1">
                <Link href="https://reactjs.org">React</Link>
              </Typography>
            </ListItem>
            <ListItem>
              <Octicon name="star" className={classes.icon} />
              <Typography variant="body1">
                <Link href="https://webpack.js.org">Webpack</Link>
                <br />
                (& the{" "}
                <Link href="https://github.com/webpack-contrib/awesome-webpack">
                  ecosystem
                </Link>{" "}
                around it)
              </Typography>
            </ListItem>
            <ListItem>
              <Octicon name="star" className={classes.icon} />
              <Typography variant="body1">
                <Link href="https://github.com/fluid-notion/fluid-outliner/blob/master/package.json">
                  And Many More ...
                </Link>
              </Typography>
            </ListItem>
          </List>
        </Section>
      </div>
    )
  )
) as any;
