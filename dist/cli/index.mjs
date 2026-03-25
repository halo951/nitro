#!/usr/bin/env node
import { h as runMain, m as defineCommand } from "../_libs/c12+rc9+rou3+nypm+klona+citty.mjs";
import { version } from "nitro/meta";
runMain(defineCommand({
	meta: {
		name: "nitro",
		description: "Nitro CLI",
		version
	},
	subCommands: {
		dev: () => import("./_chunks/dev.mjs").then((r) => r.default),
		build: () => import("./_chunks/build.mjs").then((r) => r.default),
		prepare: () => import("./_chunks/prepare.mjs").then((r) => r.default),
		task: () => import("./_chunks/task.mjs").then((r) => r.default)
	}
}));
export {};
