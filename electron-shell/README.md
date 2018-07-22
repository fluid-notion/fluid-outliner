# About

This is the very early version of fluid-outliner electron app.

Currently, the electron app does not provide any advantages over using the PWA, but in future it is expected to have better native integration and synchronization capabilities.

## Running the app 

```
cd fluid-outliner
yarn
cd electron-shell
yarn
cd app
yarn
cd ..
yarn run build

# In separate terminals: 
yarn run renderer-dev-server -- --port 9666
yarn run start
```

The DX is expected to improve when the electron shell matures. 

## Guidelines

- As a general policy it is expected that if something can be handled at the PWA layer, it goes there. 
- For performance, or better native integration experience, it may be desirable to provide alternative implementation of a few features in electron-shell.
- Electron specific feaures are to be added only as a last resort, when handling them at the PWA layer proves too restrictive or cumbersome even with latest HTML5/ES-next APIs.

## FAQs

### Why are there so many package.json files

Primarily to prevent contributors contributing to PWA (which constitutes the bulk of this application) from having to download electron and related dependencies.

`app/node_modules` is actually bundled with the application, so any native dependencies or dependencies which can't be webpacked belong in `app/package.json`.
