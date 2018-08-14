import React from "react"
import { Divider, Typography, Button } from "@material-ui/core"
import { Link } from "./Link"
import { inject } from "mobx-react";
import { RouteState } from "../models/RouteState";

interface IAppFooterProps  {
    routeState?: RouteState
    style?: object
}

export const AppFooter: React.StatelessComponent<IAppFooterProps> = inject('routeState')((({ routeState, style }: IAppFooterProps) => (
    <div
        style={{
            maxWidth: "1200px",
            margin: "0 auto",
            textAlign: "center",
            ...style,
        }}
    >
        <Divider />
        <Typography variant="body1" style={{ padding: "10px" }}>
            Fluid Outliner cares about your privacy.{" "}
            <Link onClick={() => { 
                routeState!.dialog = "privacy" 
            }}>Know More</Link>
        </Typography>
        <Divider />
        <Typography variant="body1" style={{ padding: "10px" }}>
            {[
                ["Source Code", "https://github.com/fluid-notion/fluid-outliner"],
                ["Roadmap", "https://github.com/fluid-notion/fluid-outliner/projects/1"],
                ["@lorefnon", "https://twitter.com/lorefnon"],
            ].map(([label, href]) => (
                <Button href={href} key={label} target="_blank" rel="noopener">
                    {label}
                </Button>
            ))}
        </Typography>
    </div>
)))
