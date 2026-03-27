import { m as defineCommand } from "../../_libs/c12+rc9+rou3+nypm+klona+citty.mjs";
import { dt as resolve } from "../../_build/common.mjs";
import { t as NitroDevServer } from "../../_chunks/dev.mjs";
import { t as commonArgs } from "./common.mjs";
import { consola } from "consola";
import { build, createNitro, prepare } from "nitro/builder";
const hmrKeyRe = /^runtimeConfig\.|routeRules\./;
const shutdownSignals = [
	"SIGINT",
	"SIGTERM",
	"SIGHUP",
	"SIGBREAK"
];
var dev_default = defineCommand({
	meta: {
		name: "dev",
		description: "Start the development server"
	},
	args: {
		...commonArgs,
		port: {
			type: "string",
			description: "specify port"
		},
		host: {
			type: "string",
			description: "specify hostname "
		}
	},
	async run({ args }) {
		const rootDir = resolve(args.dir || args._dir || ".");
		let nitro;
		let shuttingDown = false;
		const cleanupAndExit = async (signal) => {
			if (shuttingDown) return;
			shuttingDown = true;
			consola.info(`Received ${signal}, shutting down dev server...`);
			try {
				if (nitro) await nitro.close();
			} catch (error) {
				consola.error(error);
			} finally {
				for (const sig of shutdownSignals) process.off(sig, onSignal);
				process.exit(signal === "SIGINT" ? 130 : 0);
			}
		};
		const onSignal = (signal) => cleanupAndExit(signal);
		for (const signal of shutdownSignals) process.on(signal, onSignal);
		const reload = async () => {
			if (nitro) {
				consola.info("Restarting dev server...");
				if ("unwatch" in nitro.options._c12) await nitro.options._c12.unwatch();
				await nitro.close();
			}
			nitro = await createNitro({
				rootDir,
				dev: true,
				_cli: { command: "dev" }
			}, {
				watch: true,
				c12: { async onUpdate({ getDiff, newConfig }) {
					const diff = getDiff();
					if (diff.length === 0) return;
					consola.info("Nitro config updated:\n" + diff.map((entry) => `  ${entry.toString()}`).join("\n"));
					await (diff.every((e) => hmrKeyRe.test(e.key)) ? nitro.updateConfig(newConfig.config || {}) : reload());
				} }
			});
			nitro.hooks.hookOnce("restart", reload);
			await new NitroDevServer(nitro).listen({
				port: args.port || nitro.options.devServer.port,
				hostname: args.host || nitro.options.devServer.hostname
			});
			await prepare(nitro);
			await build(nitro);
		};
		await reload();
	}
});
export { dev_default as default };
