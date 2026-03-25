import { m as defineCommand } from "../../_libs/c12+rc9+rou3+nypm+klona+citty.mjs";
var task_default = defineCommand({
	meta: {
		name: "task",
		description: "Operate in nitro tasks (experimental)"
	},
	subCommands: {
		list: () => import("./list.mjs").then((r) => r.default),
		run: () => import("./run.mjs").then((r) => r.default)
	}
});
export { task_default as default };
