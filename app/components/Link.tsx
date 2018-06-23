import React from "react";

export const Link = (
  props: React.DetailedHTMLProps<
    React.AnchorHTMLAttributes<HTMLAnchorElement>,
    HTMLAnchorElement
  >
) => (
  <a
    target={props.href ? "_blank" : undefined}
    {...props}
    style={{
      borderBottom: "1px dotted silver",
      cursor: "pointer",
      color: "black",
      textDecoration: "none",
      ...props.style,
    }}
  />
);
