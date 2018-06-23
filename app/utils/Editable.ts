import { IIdentifiable, IPropHost } from "./UtilTypes";
import { IStoreConsumerProps } from "../models/IProviderProps";
import { autobind } from "core-decorators";
import { computed } from "mobx";

export interface IEditableSource extends IPropHost<IStoreConsumerProps> {
  item: IIdentifiable;
}

export interface IEditable extends IEditableSource {
  isEditing: boolean;
  enableEditing: () => void;
  disableEditing: () => void;
}

export class Editable {
  constructor(private target: IEditableSource) {}
  @computed
  get visitState() {
    return this.target.props.store.visitState!;
  }
  @computed
  get isEditing() {
    return this.visitState.isActive(this.target.item);
  }
  @autobind
  public enableEditing() {
    this.visitState.activateItem(this.target.item)
  }
  @autobind
  public disableEditing() {
    this.visitState.deactivateItem(this.target.item);
  }
}
