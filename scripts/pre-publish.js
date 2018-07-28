#!/usr/bin/env node

const cp = require('child_process');
const {inPublish} = require('in-publish');
const log = require('fancy-log');

if (inPublish()) {
    log('Linting the project');
    cp.spawnSync("yarn", ["run", "tslint"], {
        shell: true,
        stdio: "inherit"
    });
    log('Building project');
    cp.spawnSync("yarn", ["run", "build"], {
        shell: true,
        stdio: "inherit"
    });
} else {
    log('Not really publishing. Pre-publish hook will be skipped.');
}
