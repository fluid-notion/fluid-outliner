import { Icon } from "@material-ui/core"
import * as React from "react"

interface IIconPairProps {
    primary: string
    secondary: string
}

export const IconPair = ({ primary, secondary }: IIconPairProps) => (
    <div style={{ position: "relative", display: "inline-block" }}>
        <Icon
            color="primary"
            style={{
                fontSize: "5rem",
            }}
        >
            {primary}
        </Icon>
        <Icon
            style={{
                color: "white",
                position: "absolute",
                bottom: "15px",
                left: "15px",
                fontSize: "2rem",
            }}
        >
            {secondary}
        </Icon>
    </div>
)
