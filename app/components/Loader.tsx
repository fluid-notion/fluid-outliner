import React from "react";
// @ts-ignore
import Octicon from "react-octicon";

export const Loader = () => (
  <div
    style={{
      display: "block",
      padding: "20px",
      fontSize: "3rem",
      textAlign: "center",
      textTransform: "uppercase"
    }}
  >
    <span
      style={{
        height: "3rem",
        width: "3rem",
        display: "inline-block"
      }}
    >
      <Octicon
        style={{
          fontSize: "3rem"
        }}
        name="sync"
        spin
      />
    </span>{" "}
    Loading ...
  </div>
);
