import { inject, observer } from "mobx-react";
import { getSnapshot, onSnapshot, types as t } from "mobx-state-tree";
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
    downloadFile() {
      download(getSnapshot(self));
    }
  }));

export type IStore = typeof Store.Type;

export const injectStore = inject(({ store }: IProviderProps) => ({
  store
}));

export const storeObserver = (Component: React.ComponentType<any>) =>
  injectStore(observer(Component));
