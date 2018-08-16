import { LocalPersistencePlugin } from "./LocalPersistencePlugin"
import { RouteViewModel } from "../../../core/views/models/RouteViewModel"
import { RepositoryViewModel } from "../../../core/views/models/RepositoryViewModel"

export class RoutePersistenceCoordinator {
    constructor(private route: RouteViewModel, private repository: RepositoryViewModel) {}

    public async init() {
        if (!(await this.localPersistencePlugin.restoreFromLocalCache(this.route.outlineId))) {
            this.route.dialog = "welcome"
        }
    }

    private get localPersistencePlugin(): LocalPersistencePlugin {
        return this.repository.repositoryProxy.plugins.LocalPersistencePlugin as any
    }
}
