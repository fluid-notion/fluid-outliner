import { applySnapshot, IStateTreeNode } from "mobx-state-tree"

export const downloadJSON = (obj: any) => {
    const str =
        "data:text/json;charset=utf-8," +
        encodeURIComponent(JSON.stringify(obj))
    const anchor = document.createElement("a")
    anchor.setAttribute("href", str)
    anchor.setAttribute("download", "scene.json")
    anchor.click()
}

export const safeApplySnapshot = (target: IStateTreeNode, snapshot: any) => {
    try {
        applySnapshot(target, snapshot)
        return true
    } catch (e) {
        // tslint:disable-next-line:no-console
        console.error(e)
        alert(
            "Saved outline was found to be corrupt." +
                "Please report this as an issue." +
                "It will help us debug if you could also attach the downloaded snapshot in the bug report"
        )
        try {
            downloadJSON(snapshot)
        } catch (e) {
            // tslint:disable-next-line:no-console
            console.error(e)
            alert("Failed to download snapshot")
        }
    }
    return false
}
