#!/usr/bin/env node

const cp = require("child_process");
const path = require("path");
const log = require("fancy-log");

console.log("You probably don't want to build all sub-projects including the mobile and electron apps. Refer project README")

const buildIn = (target, subDir, proceedAfterFailure = true) => {
    log("Building:", target)
    try {
        cp.spawnSync("yarn", ["run", "build"], {
            stdio: "inherit",
            cwd: path.join(__dirname, "..", subDir),
            shell: true
        });
    } catch (e) {
        log.error(e)
        log.error("Failed to build: ", target)
        if (!proceedAfterFailure) {
            log.error("Terminating build")
            process.exit(1)
        }
    }
}

buildIn("PWA", "pwa-shell", false)
buildIn("Node Server", "server")
buildIn("Desktop App", "electron-shell")
buildIn("Mobile App", "cordova-shell")
