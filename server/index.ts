#!/usr/bin/env node

import express from "express";
import path from "path";

const app = express();
app.use(express.static(path.join(__dirname, '../../dist-webpack')));
app.listen(process.env.FLUID_OUTLINER_HTTP_SERVER_PORT || 9000);