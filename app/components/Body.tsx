import * as React from "react";
import { IStoreConsumerProps } from "../models/IProviderProps";
import { storeObserver } from "../models/Store";
import { FileSelectionDialog } from "./FileSelectionDialog";
import { OutlineEditor } from "./OutlineEditor";

export const Body = storeObserver(({ store }: IStoreConsumerProps) => {
  if (!store!.outline) {
    return <FileSelectionDialog />;
  }
  return <OutlineEditor/>;
});
