import RLoadable from "react-loadable"
import { IFn0 } from "../utils/UtilTypes";

export const Loadable = (loader: IFn0<Promise<any>>) => RLoadable({
    loading: () => null,
    loader
})