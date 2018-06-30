import React from "react"
import { DrawerSection } from "./DrawerSection"
import { Typography, List, ListItem, StyledComponentProps } from "@material-ui/core"
import Octicon from "react-octicon"
import { Link } from "./Link";
import { icon } from "./styles/drawer";
import { withStyles } from "../utils/type-overrides";

const styles = {
    icon
}

@withStyles(styles)
export class ResourceRefList extends React.Component<StyledComponentProps<keyof typeof styles>> {
    public render() {
        const classes = this.props.classes!;
        return (
            <DrawerSection>
                <Typography variant="body1">
                    This project wouldn't exist without following amazing open
                    source projects
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
            </DrawerSection>
        )
    }
}
