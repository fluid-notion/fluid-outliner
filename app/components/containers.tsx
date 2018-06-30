import React from "react";
import { Motion, spring } from "react-motion";

export const FadeInContainer =  ({style, children}: React.HTMLAttributes<any>) => (
    <Motion defaultStyle={{opacity: 0}} style={{opacity: spring(1)}}>
        {(motionStyles) => (
            <div style={{
                ...style,
                ...motionStyles,
            }} >
                {children}
            </div>
        )}
    </Motion>
)

export const DrawerContainer = ({style, children}: React.HTMLAttributes<any>) => (
    <FadeInContainer style={{
        flexBasis: "300px",
        flexGrow: 0,
        flexShrink: 0,
        padding: "30px",
        ...style 
    }}>
        {children}
    </FadeInContainer>
)