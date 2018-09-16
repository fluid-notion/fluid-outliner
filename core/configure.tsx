import { configure as configureMobx } from "mobx"

export const configure = () => {
    configureMobx({
        enforceActions: "strict"
    });
}
