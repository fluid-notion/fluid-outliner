import { LocalPersistencePlugin } from "../helpers/LocalPersistencePlugin"
import * as Comlink from "comlink"
import { Repository } from "../../../core/models/Repository"

Repository.plugins.push(LocalPersistencePlugin)

Comlink.expose(Repository, self)
