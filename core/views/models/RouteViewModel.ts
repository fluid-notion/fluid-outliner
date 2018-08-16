import qs from "qs"
import memoize from "lodash/memoize"
import { serializable, deserialize, update, serialize } from "serializr"
import { observable, action, autorun, IReactionDisposer, computed } from "mobx"
import { decorate, autobind } from "core-decorators"
import { Maybe } from "../../helpers/types"
import { ModalKey } from "../components/modals"

export const currentRawQuery = () => location.search.slice(1)
export const parseQuery = (rawQuery = currentRawQuery()) => qs.parse(rawQuery)

interface IRouteQueryParams {
    outlineId: Maybe<string>
    rootNodeId: Maybe<string>
    dialog: Maybe<ModalKey>
}

export class RouteViewModel implements IRouteQueryParams {
    @decorate(memoize)
    public static instance() {
        return deserialize(RouteViewModel, parseQuery())
    }

    @serializable
    @observable
    public outlineId: Maybe<string>

    @serializable
    @observable
    public rootNodeId: Maybe<string>

    @serializable
    @observable
    public dialog: Maybe<ModalKey>

    @computed
    public get serializedQuery() {
        return qs.stringify(serialize(this))
    }

    private disposeInstanceObserver: IReactionDisposer | undefined

    @action.bound
    public syncFromQuery(query = parseQuery()) {
        update(this, {
            rootNodeId: null,
            dialog: null,
            ...query,
        })
    }

    @action.bound
    public update(props: IRouteQueryParams) {
        update(this, props)
    }

    public syncToQuery() {
        if (!this.didChange()) return
        history.pushState(undefined, undefined, this.serializedQuery)
    }

    public observeInstance() {
        this.disposeInstanceObserver = autorun(() => {
            const route = "/?" + this.serializedQuery
            if (!this.didChange()) return
            history.pushState(undefined, undefined, route)
        })
        return this
    }

    public unobserveInstance() {
        if (this.disposeInstanceObserver) {
            this.disposeInstanceObserver()
        }
        return this
    }

    public observeLocation() {
        window.addEventListener("popstate", this.handlePopState)
        return this
    }

    public unobserveLocation() {
        window.removeEventListener("popstate", this.handlePopState)
        return this
    }

    public observe() {
        this.observeLocation()
        this.observeInstance()
        return this
    }

    public unobserve() {
        this.unobserveLocation()
        this.unobserveInstance()
        return this
    }

    public didChange(rawQuery = currentRawQuery()) {
        return this.serializedQuery !== rawQuery
    }

    @autobind
    private handlePopState() {
        this.syncFromQuery()
    }
}
