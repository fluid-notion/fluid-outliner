import { StyledComponentProps } from "@material-ui/core"

export interface StyledComponent<Styles, Props>
    extends React.Component<Props & StyledComponentProps<(keyof Styles) & string>> {}
