# About

This is the very early version of fluid-outliner electron app.

Currently, the electron app does not provide any advantages over using the PWA, but in future it is expected to have better native integration and synchronization capabilities.

## Running the android app 

You will need to ensure that Android SDK is installed, ANDROID_HOME path is set and platform-tools is added to PATH.

```
cd fluid-outliner
yarn
cd cordova-shell
yarn
yarn run build
yarn run emulate android
```

## Running the ios app

**TBD**

The DX is expected to improve when the electron shell matures. 

## Guidelines

- As a general policy it is expected that if something can be handled at the PWA layer, it goes there. 
- For performance, or better native integration experience, it may be desirable to provide alternative implementation of a few features in cordova-shell.
- Cordova specific feaures are to be added only as a last resort, when handling them at the PWA layer proves too restrictive or cumbersome even with latest HTML5/ES-next APIs.

## FAQs

### Why are there two package.json files

Primarily to prevent contributors contributing to PWA (which constitutes the bulk of this application) from having to download all cordova related dependencies.
