import React from "react"
import { Motion, spring } from "react-motion"

export const FadeInContainer = ({
    style,
    children,
}: React.HTMLAttributes<any>) => (
    <Motion defaultStyle={{ opacity: 0 }} style={{ opacity: spring(1) }}>
        {motionStyles => (
            <div
                style={{
                    ...style,
                    ...motionStyles,
                }}
            >
                {children}
            </div>
        )}
    </Motion>
)

export interface IDrawerContainerProps {
    style?: object
    fixed?: "left" | "right"
}

export const DrawerContainer: React.StatelessComponent<
    IDrawerContainerProps
> = ({ style, fixed, children }) => {
    const s: any = {
        flexBasis: "300px",
        flexGrow: 0,
        flexShrink: 0,
        padding: "20px",
        ...style,
    }
    if (fixed) {
        s.position = "fixed"
        s[fixed] = 0
        s.top = "70px"
        s.bottom = 0
    }
    return <FadeInContainer style={s}>{children}</FadeInContainer>
}
