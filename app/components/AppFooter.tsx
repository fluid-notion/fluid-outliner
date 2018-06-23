import React from "react";
import { Divider, Typography } from "@material-ui/core";
import { IModalConsumerProps } from "./ModalContainer";
import { inject } from "mobx-react";

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
      <a
        onClick={() => modal.activate("PrivacyDialog")}
        style={{ borderBottom: "1px dotted silver", cursor: "pointer" }}
      >
        Know More
      </a>
    </Typography>
    <Divider />
    <Typography variant="body1" style={{ padding: "10px" }}>
      Github | @lorefnon
    </Typography>
  </div>
)) as any;
