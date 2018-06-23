import { types as t } from "mobx-state-tree";
import { v4 as uuid } from "uuid";

export const Marker = t.model({
  id: t.optional(t.maybe(t.identifier(t.string)), uuid),
  icon: t.string,
  placement: t.enumeration(["left", "right"]),
});

export type IMarker = typeof Marker.Type;
