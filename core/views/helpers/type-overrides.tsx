import { withStyles as ws } from "@material-ui/core"
import { StyleRules, StyleRulesCallback } from "@material-ui/core/styles"
import { WithStylesOptions, StyledComponentProps } from "@material-ui/core/styles/withStyles"
import { CSSProperties, ComponentClass } from "react";

/**
 * "Dilute" the type of withStyles so that it plays well with restrictions on typescript
 * decorators.
 *
 * Required because typescript does not allow decorators to change class type.
 */
export const withStyles: <ClassKey extends string, P>(
    style: StyleRulesCallback<ClassKey> | StyleRules<ClassKey>,
    options?: WithStylesOptions<ClassKey>
) => (component: React.ComponentType<P & StyledComponentProps<ClassKey>>) => any = ws as any

export type StyleProps<P extends {}, S extends Record<string, CSSProperties>> = P & StyledComponentProps<(keyof S) & string>

export type SKey<S> = (keyof S) & string;

export const styled: <P, S extends Record<string, CSSProperties>> (
    style: StyleRulesCallback<SKey<S>> | S,
    options?: WithStylesOptions<SKey<S>>
) => (component: ComponentClass<StyleProps<P, S>>) => any = ws as any
