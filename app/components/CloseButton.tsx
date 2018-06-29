import React from "react"
import Octicon from "react-octicon"

interface ICloseButtonProps {
    onClick: () => void
    name?: string
}

export const CloseButton = ({ onClick, name = "x" }: ICloseButtonProps) => (
    <Octicon
        onClick={onClick}
        name={name}
        style={{
            position: "absolute",
            right: "10px",
            top: "10px",
            fontSize: "1.5rem",
            cursor: "pointer",
            zIndex: 999,
        }}
    />
)
