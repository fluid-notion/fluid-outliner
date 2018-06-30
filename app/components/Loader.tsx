import React from "react"
import Octicon from "react-octicon"
import { Typography } from "@material-ui/core"

export const Loader = () => (
    <div
        style={{
            display: "block",
            padding: "20px",
            fontSize: "3rem",
            textAlign: "center",
            textTransform: "uppercase",
        }}
    >
        <Typography variant="headline">
            <span
                style={{
                    height: "1.5rem",
                    width: "1.5rem",
                    display: "inline-block",
                }}
            >
                <Octicon
                    style={{
                        fontSize: "1.5rem",
                        display: "block",
                    }}
                    name="sync"
                    spin
                />
            </span>
            Loading ...
        </Typography>
    </div>
)
