import React from "react";

export const DrawerSection = ({ children }: any) => (
    <section
        style={{
            padding: "10px",
            margin: "10px 0",
            borderLeft: "2px dotted silver",
        }}
    >
        {children}
    </section>
)
