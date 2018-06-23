import React from "react";
import Octicon from "react-octicon";

interface ICloseButtonProps {
  onClick: () => void;
}

export const CloseButton = ({ onClick }: ICloseButtonProps) => (
  <Octicon
    onClick={onClick}
    name="x"
    style={{
      position: "absolute",
      right: "10px",
      top: "10px",
      fontSize: "1.5rem",
      cursor: "pointer",
    }}
  />
);
