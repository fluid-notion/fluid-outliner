import React from "react"
import { Typography } from "@material-ui/core"

interface IDrawerSectionProps {
    title?: React.ReactChild
    show?: boolean
    style?: object
}

export const DrawerSection: React.StatelessComponent<IDrawerSectionProps> = ({
    title,
    show,
    style,
    children,
}) => (
    <>
        {show !== false && (
            <div
                style={{
                    ...style,
                    background: "rgba(0,0,0,0.1)",
                    borderRadius: "4px",
                    padding: "10px",
                    marginBottom: "10px",
                }}
            >
                {title && (
                    <Typography
                        variant="headline"
                        style={{ marginBottom: "10px", color: "slategray" }}
                    >
                        {title}
                    </Typography>
                )}
                <section>{children}</section>
            </div>
        )}
    </>
)
