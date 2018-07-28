#!/usr/bin/env node

const cp = require("child_process");
const path = require("path");

[
    ".",
    "pwa-shell",
    "electron-shell",
    "electron-shell/app",
    "cordova-shell"
].forEach((dir) => {
    console.log(`Installing dependencies in ${dir}`);
    cp.spawnSync("yarn", ["install"], {
        stdio: "inherit",
        shell: true,
        cwd: path.join(__dirname, '..', dir)
    });
});
