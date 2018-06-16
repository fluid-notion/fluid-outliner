import { inject, observer } from "mobx-react";
import { applySnapshot, getSnapshot, onSnapshot, types as t } from "mobx-state-tree";
import { download } from "../utils/download";
import { IProviderProps } from "./IProviderProps";
import { defaultOutlineId, Outline, OutlineVisitState } from "./Outline";

export const Store = t
  .model("Store", {
    outline: t.maybe(Outline),
    visitState: t.maybe(OutlineVisitState)
  })
  .actions(self => ({
    createNew() {
      self.outline = Outline.create({ id: defaultOutlineId() });
      self.visitState = OutlineVisitState.create({
        outline: defaultOutlineId()
      });
    },
    afterCreate() {
      onSnapshot(self, snapshot => {
        // tslint:disable-next-line:no-console
        console.dir(snapshot);
      });
    },
    saveFile() {
      download(getSnapshot(self));
    },
    restoreSaved(content: string) {
      const {snapshot} = JSON.parse(content);
      applySnapshot(self, snapshot);
    }
  }));

export type IStore = typeof Store.Type;

export const injectStore = inject(({ store }: IProviderProps) => ({
  store
}));

export const storeObserver = (Component: any) =>
  injectStore(observer(Component));
