import React from "react"
import { Typography, ButtonBase } from "@material-ui/core"
import { ButtonBaseProps } from "@material-ui/core/ButtonBase"

interface IDrawerActionItemProps extends ButtonBaseProps {
    icon?: React.ReactElement<any>
    label: React.ReactChild
}

export const DrawerActionItem = ({
    icon,
    label,
    ...props
}: IDrawerActionItemProps) => (
    <ButtonBase
        {...props}
        style={{
            ...props.style,
            padding: "5px",
            display: "block",
        }}
        component="div"
    >
        <div
            style={{
                whiteSpace: "nowrap",
                textOverflow: "ellipsis",
                overflow: "hidden",
                maxWidth: "250px",
                width: "100%",
            }}
        >
            {icon &&
                React.cloneElement(icon, {
                    style: {
                        fontSize: "1.5rem",
                        position: "relative",
                        top: "2px",
                        marginRight: "5px",
                        ...icon.props.style,
                    },
                })}
            <Typography
                variant="body1"
                component="span"
                style={{ display: "inline" }}
            >
                {label}
            </Typography>
        </div>
    </ButtonBase>
)
