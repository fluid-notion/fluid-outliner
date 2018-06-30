import React from "react"
import { Divider, Typography, Button } from "@material-ui/core"
import { IModalConsumerProps, injectModal } from "./ModalContainer"
import { Link } from "./Link"

export const AppFooter: React.StatelessComponent<Partial<IModalConsumerProps>> = injectModal(({ modal }: Partial<IModalConsumerProps>) => (
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
            <Link onClick={() => modal!.activate("PrivacyDialog", true)}>
                Know More
            </Link>
        </Typography>
        <Divider />
        <Typography variant="body1" style={{ padding: "10px" }}>
            {[
                [
                    "Source Code",
                    "https://github.com/fluid-notion/fluid-outliner",
                ],
                [
                    "Roadmap",
                    "https://github.com/fluid-notion/fluid-outliner/projects/1",
                ],
                ["@lorefnon", "https://twitter.com/lorefnon"],
            ].map(([label, href]) => (
                <Button href={href} key={label} target="_blank" rel="noopener">
                    {label}
                </Button>
            ))}
        </Typography>
    </div>
))
