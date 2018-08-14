import FileSaver from "file-saver"
import {instance as baseInstance, IRepositoryClient} from "../../../core/utils/repository-client"

export const instance = async (worker: Worker) => {
    const client: IRepositoryClient = await baseInstance(worker)
    client.name = "RepositoryClient"
    client.saveAs = async (name = "outline.fnoa") => {
        const blob = await client.getBlob()
        FileSaver.saveAs(blob, name)
    }
    return client;
}
