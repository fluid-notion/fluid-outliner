import { inject, observer } from "mobx-react";
import { onSnapshot, types as t } from "mobx-state-tree";
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
        console.dir(snapshot);
      });
    }
  }));

export type IStore = typeof Store.Type;

export const injectStore = inject(({ store }: IProviderProps) => ({
  store
}));

export const storeObserver = (Component: React.ComponentType<any>) =>
  injectStore(observer(Component));
