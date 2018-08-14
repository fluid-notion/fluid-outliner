import { Repository } from "../../../core/utils/repository"
import { LocalPersistencePlugin } from "./LocalPersistencePlugin"
import * as Comlink from "comlink"

Repository.plugins.push(LocalPersistencePlugin)

Comlink.expose(Repository, self)
