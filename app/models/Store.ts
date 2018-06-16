import { flow } from "mobx";
import { inject, observer } from "mobx-react";
import {
  applySnapshot,
  getSnapshot,
  onSnapshot,
  Snapshot,
  types as t,
} from "mobx-state-tree";
import {
  debouncedSaveLocal,
  download,
  restoreLocal,
  wrapMetadata,
} from "../utils/persistence";
import { IProviderProps } from "./IProviderProps";
import { defaultOutlineId, Outline } from "./Outline";
import { OutlineVisitState } from "./OutlineVisitState";

export const Store = t
  .model("Store", {
    outline: t.maybe(Outline),
    visitState: t.maybe(OutlineVisitState),
  })
  .actions(self => ({
    createNew() {
      self.outline = Outline.create({ id: defaultOutlineId() });
      self.visitState = OutlineVisitState.create({
        outline: defaultOutlineId(),
      });
    },
    afterCreate() {
      onSnapshot(self, (snapshot: Snapshot<IStore>) => {
        // tslint:disable-next-line:no-console
        console.dir(snapshot);
        debouncedSaveLocal(wrapMetadata(snapshot));
      });
    },
    saveFile() {
      download(wrapMetadata(getSnapshot(self)));
    },
    restoreSaved(content: string) {
      const { snapshot } = JSON.parse(content);
      applySnapshot(self, snapshot);
    },
  }))
  .actions(self => ({
    restoreSaved: flow(function*() {
      const fileData = yield restoreLocal();
      if (fileData && fileData.snapshot) {
        applySnapshot(self, fileData.snapshot);
        return true;
      }
      return false;
    }),
  }));

export type IStore = typeof Store.Type;

export const injectStore = inject(({ store }: IProviderProps) => ({
  store,
}));

export const storeObserver = (Component: any) =>
  injectStore(observer(Component));
