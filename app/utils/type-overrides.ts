import { withStyles as ws } from "@material-ui/core"
import { StyleRules, StyleRulesCallback } from "@material-ui/core/styles"
import {
    WithStylesOptions,
    StyledComponentProps,
} from "@material-ui/core/styles/withStyles"

/**
 * "Dilute" the type of withStyles so that it plays well with restrictions on typescript
 * decorators.
 *
 * Required because typescript does not allow decorators to change class type.
 */
export const withStyles: <ClassKey extends string, P>(
    style: StyleRulesCallback<ClassKey> | StyleRules<ClassKey>,
    options?: WithStylesOptions<ClassKey>
) => (
    component: React.ComponentType<P & StyledComponentProps<ClassKey>>
) => any = ws as any
