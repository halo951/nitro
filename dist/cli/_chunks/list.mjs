import { m as defineCommand } from "../../_libs/c12+rc9+rou3+nypm+klona+citty.mjs";
import { dt as resolve } from "../../_build/common.mjs";
import { consola } from "consola";
import { listTasks, loadOptions } from "nitro/builder";
var list_default = defineCommand({
	meta: {
		name: "run",
		description: "List available tasks (experimental)"
	},
	args: { dir: {
		type: "string",
		description: "project root directory"
	} },
	async run({ args }) {
		const cwd = resolve(args.dir || args.cwd || ".");
		const tasks = await listTasks({
			cwd,
			buildDir: (await loadOptions({ rootDir: cwd }).catch(() => void 0))?.buildDir || ".nitro"
		});
		for (const [name, task] of Object.entries(tasks)) consola.log(` - \`${name}\`${task.meta?.description ? ` - ${task.meta.description}` : ""}`);
	}
});
export { list_default as default };
