import React from "react";

export const Link = (
  props: React.DetailedHTMLProps<
    React.AnchorHTMLAttributes<HTMLAnchorElement> & {
      nodeType?: string | React.ReactType<React.AnchorHTMLAttributes<any>>
    },
    HTMLAnchorElement
  >
) => {
  const Presenter = props.nodeType || "a";
  return (
  <Presenter
    target={props.href ? "_blank" : undefined}
    rel={props.href ? "noopener" : undefined}
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
}