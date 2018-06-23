import FileSaver from "file-saver";
import localForage from "localforage";
import debounce from "lodash/debounce";
import { Snapshot } from "mobx-state-tree";
import { IStore } from "../models/Store";

const LF_KEY = "fluid-outliner.file";

export interface IWrappedFileData {
  application: {
    manifest: {
      name: string;
      version: string;
    };
    origin: string;
  };
  snapshot: Snapshot<IStore>;
}

export const download = (content: any) => {
  const json = JSON.stringify(
    content,
    undefined,
    process.env.NODE_ENV === "development" ? 2 : undefined
  );
  const blob = new Blob([json], {
    type: "application/json;charset=utf-8",
  });
  FileSaver.saveAs(blob, "outline.fdor");
};

export const wrapMetadata = async (snapshot: any) => {
  // @ts-ignore
  const manifest = await import("../../package.json");
  const wrapped: IWrappedFileData = {
    application: {
      manifest: {
        name: manifest.name,
        version: manifest.version,
      },
      origin: location.href,
    },
    snapshot,
  };
  return wrapped;
};

export const unwrapMetadata = (fileData: IWrappedFileData) => fileData.snapshot;

export const saveLocal = async (fileData: IWrappedFileData) =>
  localForage.setItem(LF_KEY, fileData);

export const debouncedSaveLocal = debounce(saveLocal, 1000);

export const restoreLocal = async () => localForage.getItem(LF_KEY);

export const clearLocal = () => localForage.clear();