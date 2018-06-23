import React from "react";
import { Divider, Typography } from "@material-ui/core";
import { IModalConsumerProps } from "./ModalContainer";
import { inject } from "mobx-react";
import { Link } from "./Link";

export const AppFooter: React.StatelessComponent<{}> = inject(
  ({ modal }: IModalConsumerProps) => ({ modal })
)(({ modal }: IModalConsumerProps) => (
  <div
    style={{
      maxWidth: "1200px",
      margin: "0 auto",
      textAlign: "center",
    }}
  >
    <Divider />
    <Typography variant="body1" style={{ padding: "10px" }}>
      Fluid Outliner cares about your privacy.{" "}
      <Link
        onClick={() => modal.activate("PrivacyDialog", true)}
      >
        Know More
      </Link>
    </Typography>
    <Divider />
    <Typography variant="body1" style={{ padding: "10px" }}>
      <Link href="https://github.com/fluid-notion/fluid-outliner">Source Code</Link>{" | "}
      <Link href="https://github.com/fluid-notion/fluid-outliner/issues">Issues</Link>{" | "}
      <Link href="https://github.com/fluid-notion/fluid-outliner/projects/1">Roadmap</Link>{" | "} 
      <Link href="https://twitter.com/lorefnon">@lorefnon</Link>
    </Typography>
  </div>
)) as any;
