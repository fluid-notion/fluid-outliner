export const pushAtKey = <K, V>(m: Map<K, V[]>, k: K, v: V) => {
    let vlist = m.get(k)
    if (!vlist) {
        vlist = []
        m.set(k, vlist)
    }
    vlist.push(v)
}
