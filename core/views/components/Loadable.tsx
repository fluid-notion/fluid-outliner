import RLoadable from "react-loadable"
import { Fn0 } from "../../helpers/types"

export const Loadable = (loader: Fn0<Promise<any>>) =>
    RLoadable({
        loading: () => null,
        loader,
    })
