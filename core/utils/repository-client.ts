import * as Comlink from "comlink"
import { Repository } from "./repository";

export interface IRepositoryClient extends Repository {
    name: string;
    saveAs(name: string): void
}

export const instance = async (worker: Worker) => {
    const repoProxy: Repository = await (new (Comlink.proxy(worker) as any));
    const repoClient: IRepositoryClient = Object.create(repoProxy, {
        name: {
            value: 'repository'
        },
        saveAs: {
            value: () => {
                debugger
            }
        }
    });
    return repoClient
}