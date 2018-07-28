import * as React from "react"

interface IIconPairProps {
    primary: any // React.ComponentType
    secondary: any // React.ComponentType
}

export const IconPair = ({
    primary: Primary,
    secondary: Secondary,
}: IIconPairProps) => (
    <div style={{ position: "relative", display: "inline-block" }}>
        <Primary
            color="primary"
            style={{
                fontSize: "5rem",
            }}
        />
        <Secondary
            style={{
                color: "white",
                position: "absolute",
                bottom: "15px",
                left: "15px",
                fontSize: "2rem",
            }}
        />
    </div>
)
