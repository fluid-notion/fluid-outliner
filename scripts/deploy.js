#!/usr/bin/env node

const cp = require("child_process");
const path = require("path")

const deployIn = (subDir) =>
    cp.spawnSync("yarn", ["run", "deploy"], {
        stdio: "inherit",
        cwd: path.join(__dirname, "..", subDir),
        shell: true
    });

buildIn("pwa-shell")
