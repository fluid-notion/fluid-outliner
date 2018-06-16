import FileSaver from "file-saver";
// @ts-ignore
import manifest from "../../package.json";

export const download = (snapshot: any) => {
  const content = {
    application: {
      manifest: {
        name: manifest.name,
        version: manifest.version
      },
      origin: location.href
    },
    snapshot
  };
  const json = JSON.stringify(content, undefined, process.env.NODE_ENV === "development" ? 2 : undefined);
  const blob = new Blob([json], {
    type: "application/json;charset=utf-8"
  });
  FileSaver.saveAs(blob, "outline.fdor");
};
