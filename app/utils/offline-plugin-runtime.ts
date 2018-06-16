import _debug from "debug";
import * as OfflinePluginRuntime from "offline-plugin/runtime";

const debug = _debug("fluid-notion:service-workers");

export const installOfflinePlugin = () => {
  OfflinePluginRuntime.install({
    onUpdating: () => {
      debug("Event: onUpdating");
    },
    onUpdateReady: () => {
      debug("Event: onUpdateReady");
      // Tells to new SW to take control immediately
      OfflinePluginRuntime.applyUpdate();
    },
    onUpdated: () => {
      debug("Event: onUpdated");
      // Reload the webpage to load into the new version
      window.location.reload();
    },
    onUpdateFailed: () => {
      debug("Event: onUpdateFailed");
    }
  });
};
