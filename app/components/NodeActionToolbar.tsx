import React from "react";
import Octicon from "react-octicon";
import { Motion, spring } from "react-motion";
import {
  withStyles,
  WithStyles,
  StyledComponentProps,
  Button,
  Menu,
  MenuItem,
  Divider,
} from "@material-ui/core";
import { INode } from "../models/Node";
import { palette } from "./styles/theme";
import { Observer } from "mobx-react";
import { autobind } from "core-decorators";
import { observable } from "mobx";

const styles = {
  container: {
    display: "flex" as "flex",
    flexDirection: "row" as "row",
    position: "absolute" as "absolute",
    right: "5px",
    bottom: "5px",
  },
  menu: {
    position: "absolute" as "absolute",
    left: "100px",
    bottom: "-50px",
  },
  button: {
    padding: "5px",
    minWidth: 0,
    "&:hover $icon": {
      color: palette.primary.main,
    },
  },
  icon: {
    fontSize: "1.6rem",
    fontWeight: 100 as any,
    color: "slategray",
  },
};

class NodeActionToolbarInner extends React.Component<
  WithStyles<keyof typeof styles> & {
    node: INode;
    showNotes: () => void;
  }
> {
  @observable private memoMenuAnchor: HTMLElement | null = null;
  public render() {
    const { classes, node } = this.props;
    return (
      <Motion defaultStyle={{ opacity: 0 }} style={{ opacity: spring(1) }}>
        {({ opacity }) => (
          <Observer>
            {() => (
              <div className={classes.container} style={{ opacity }}>
                <Button
                  onClick={node.toggleBookmark}
                  className={classes.button}
                >
                  <Octicon name="bookmark" className={classes.icon} />
                </Button>
                <Button
                  onClick={this.handleMemoMenuControlClick}
                  className={classes.button}
                >
                  <Octicon name="file" className={classes.icon} />
                  <Octicon name="chevron-down" className={classes.icon} />
                </Button>
                {this.memoMenuAnchor && (
                  <Menu
                    open={!!this.memoMenuAnchor}
                    onClose={this.hideMemoMenu}
                    anchorEl={this.memoMenuAnchor}
                  >
                    <MenuItem>Add Memo</MenuItem>
                    <Divider />
                    <MenuItem onClick={this.addMarkdownMemo}>Markdown</MenuItem>
                    <MenuItem onClick={this.addRichTextMemo}>
                      Rich Text
                    </MenuItem>
                  </Menu>
                )}
                <Button onClick={node.toggleStar} className={classes.button}>
                  <Octicon name="star" className={classes.icon} />
                </Button>
              </div>
            )}
          </Observer>
        )}
      </Motion>
    );
  }

  @autobind
  private handleMemoMenuControlClick(event: React.MouseEvent<any>) {
    this.memoMenuAnchor = event.currentTarget;
  }

  @autobind
  private addMarkdownMemo() {
    this.props.node.addMemo("markdown");
    this.hideMemoMenu();
    this.props.showNotes();
  }

  @autobind
  private addRichTextMemo() {
    this.props.node.addMemo("html");
    this.hideMemoMenu();
    this.props.showNotes();
  }

  @autobind
  private hideMemoMenu() {
    this.memoMenuAnchor = null;
  }
}

export const NodeActionToolbar: React.ComponentType<
  StyledComponentProps<keyof typeof styles> & {
    node: INode;
    showNotes: () => void;
  }
> = withStyles(styles)(NodeActionToolbarInner);
