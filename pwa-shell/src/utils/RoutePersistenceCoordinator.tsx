import { RouteState } from "../../../core/models/RouteState";
import { Repository } from "../../../core/utils/repository";
import { LocalPersistencePlugin } from "./LocalPersistencePlugin";

export class RoutePersistenceCoordinator {
    constructor(
        private routeState: RouteState,
        private repository: Repository
    ) {}

    public async init() {
        if (!await this.localPersistencePlugin.restoreFromLocalCache(this.routeState.outlineId)) {
            this.routeState.dialog = "welcome"
        }
    }

    private get localPersistencePlugin(): LocalPersistencePlugin {
        return this.repository.plugins.LocalPersistencePlugin as any
    }
}
