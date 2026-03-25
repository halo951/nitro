import "../_common.mjs";
import { M as formatCompatibilityDate, b as watch$1, l as inject, n as json, r as commonjs, t as nodeResolve, u as alias, v as debounce } from "../_libs/c12+rc9+rou3+nypm+klona+citty.mjs";
import { _ as writeTypes, ct as join, d as libChunkName, f as baseBuildConfig, h as writeBuildInfo, l as NODE_MODULES_RE, n as baseBuildPlugins, st as isAbsolute, t as oxc, u as getChunkName, ut as relative } from "./common.mjs";
import { n as scanHandlers } from "../_chunks/nitro2.mjs";
import { t as generateFSTree } from "../_chunks/utils.mjs";
import { watch } from "node:fs";
import { defu } from "defu";
const getRollupConfig = async (nitro) => {
	const base = baseBuildConfig(nitro);
	const tsc = nitro.options.typescript.tsConfig?.compilerOptions;
	let config = {
		input: nitro.options.entry,
		external: [...base.env.external],
		plugins: [
			...await baseBuildPlugins(nitro, base),
			await oxc({
				sourcemap: !!nitro.options.sourcemap,
				minify: nitro.options.minify ? { ...nitro.options.oxc?.minify } : false,
				transform: {
					target: "esnext",
					cwd: nitro.options.rootDir,
					...nitro.options.oxc?.transform,
					jsx: {
						runtime: tsc?.jsx === "react" ? "classic" : "automatic",
						pragma: tsc?.jsxFactory,
						pragmaFrag: tsc?.jsxFragmentFactory,
						importSource: tsc?.jsxImportSource,
						development: nitro.options.dev,
						...nitro.options.oxc?.transform?.jsx
					}
				}
			}),
			alias({ entries: base.aliases }),
			nodeResolve({
				extensions: base.extensions,
				preferBuiltins: !!nitro.options.node,
				rootDir: nitro.options.rootDir,
				exportConditions: nitro.options.exportConditions
			}),
			commonjs({ ...nitro.options.commonJS }),
			json(),
			inject(base.env.inject)
		],
		onwarn(warning, rollupWarn) {
			if (!base.ignoreWarningCodes.has(warning.code || "")) rollupWarn(warning);
		},
		treeshake: { moduleSideEffects(id) {
			return nitro.options.moduleSideEffects.some((p) => id.startsWith(p));
		} },
		output: {
			format: "esm",
			entryFileNames: "index.mjs",
			chunkFileNames: (chunk) => getChunkName(chunk, nitro),
			dir: nitro.options.output.serverDir,
			inlineDynamicImports: nitro.options.inlineDynamicImports,
			generatedCode: { constBindings: true },
			sourcemap: nitro.options.sourcemap,
			sourcemapExcludeSources: true,
			sourcemapIgnoreList: (id) => id.includes("node_modules"),
			manualChunks(id) {
				if (NODE_MODULES_RE.test(id)) return libChunkName(id);
			}
		}
	};
	config = defu(nitro.options.rollupConfig, config);
	const outputConfig = config.output;
	if (outputConfig.inlineDynamicImports || outputConfig.format === "iife") delete outputConfig.manualChunks;
	return config;
};
function formatRollupError(_error) {
	try {
		const logs = [_error.toString()];
		const errors = _error?.errors || [_error];
		for (const error of errors) {
			const id = error.path || error.id || _error.id;
			let path = isAbsolute(id) ? relative(process.cwd(), id) : id;
			const location = error.loc;
			if (location) path += `:${location.line}:${location.column}`;
			const text = error.frame;
			logs.push(`Rollup error while processing \`${path}\`` + text ? "\n\n" + text : "");
		}
		return logs.join("\n");
	} catch {
		return _error?.toString();
	}
}
async function watchDev(nitro, rollupConfig) {
	const rollup = await import("rollup");
	let rollupWatcher;
	async function load() {
		if (rollupWatcher) await rollupWatcher.close();
		await scanHandlers(nitro);
		nitro.routing.sync();
		rollupWatcher = startRollupWatcher(nitro, rollupConfig);
		await writeTypes(nitro);
	}
	const reload = debounce(load);
	const scanDirs = nitro.options.scanDirs.flatMap((dir) => [
		join(dir, nitro.options.apiDir || "api"),
		join(dir, nitro.options.routesDir || "routes"),
		join(dir, "middleware"),
		join(dir, "plugins"),
		join(dir, "modules")
	]);
	const watchReloadEvents = new Set([
		"add",
		"addDir",
		"unlink",
		"unlinkDir"
	]);
	const scanDirsWatcher = watch$1(scanDirs, { ignoreInitial: true }).on("all", (event, path, stat) => {
		if (watchReloadEvents.has(event)) reload();
	});
	const rootDirWatcher = watch(nitro.options.rootDir, { persistent: false }, (_event, filename) => {
		if (filename && /^server\.[mc]?[jt]sx?$/.test(filename)) reload();
	});
	nitro.hooks.hook("close", () => {
		rollupWatcher.close();
		scanDirsWatcher.close();
		rootDirWatcher.close();
	});
	nitro.hooks.hook("rollup:reload", () => reload());
	await load();
	function startRollupWatcher(nitro, rollupConfig) {
		const watcher = rollup.watch(defu(rollupConfig, { watch: { chokidar: nitro.options.watchOptions } }));
		let start;
		watcher.on("event", (event) => {
			switch (event.code) {
				case "START":
					start = Date.now();
					nitro.logger.info(`Starting dev watcher (builder: \`rollup\`, preset: \`${nitro.options.preset}\`, compatibility date: \`${formatCompatibilityDate(nitro.options.compatibilityDate)}\`)`);
					nitro.hooks.callHook("dev:start");
					break;
				case "BUNDLE_END":
					nitro.hooks.callHook("compiled", nitro);
					if (nitro.options.logging.buildSuccess) nitro.logger.success(`Server built`, start ? `in ${Date.now() - start}ms` : "");
					nitro.hooks.callHook("dev:reload");
					break;
				case "ERROR":
					nitro.logger.error(formatRollupError(event.error));
					nitro.hooks.callHook("dev:error", event.error);
			}
		});
		return watcher;
	}
}
async function buildProduction(nitro, rollupConfig) {
	const rollup = await import("rollup");
	const buildStartTime = Date.now();
	await scanHandlers(nitro);
	await writeTypes(nitro);
	let output;
	if (!nitro.options.static) {
		nitro.logger.info(`Building server (builder: \`rollup\`, preset: \`${nitro.options.preset}\`, compatibility date: \`${formatCompatibilityDate(nitro.options.compatibilityDate)}\`)`);
		output = await (await rollup.rollup(rollupConfig).catch((error) => {
			nitro.logger.error(formatRollupError(error));
			throw error;
		})).write(rollupConfig.output);
	}
	const buildInfo = await writeBuildInfo(nitro, output);
	if (!nitro.options.static) {
		if (nitro.options.logging.buildSuccess) nitro.logger.success(`Server built in ${Date.now() - buildStartTime}ms`);
		if (nitro.options.logLevel > 1) process.stdout.write(await generateFSTree(nitro.options.output.serverDir, { compressedSizes: nitro.options.logging.compressedSizes }) || "");
	}
	await nitro.hooks.callHook("compiled", nitro);
	const rOutput = relative(process.cwd(), nitro.options.output.dir);
	const rewriteRelativePaths = (input) => {
		return input.replace(/([\s:])\.\/(\S*)/g, `$1${rOutput}/$2`);
	};
	if (buildInfo.commands.preview) nitro.logger.success(`You can preview this build using \`${rewriteRelativePaths(buildInfo.commands.preview)}\``);
	if (buildInfo.commands.deploy) nitro.logger.success(`You can deploy this build using \`${rewriteRelativePaths(buildInfo.commands.deploy)}\``);
}
async function rollupBuild(nitro) {
	await nitro.hooks.callHook("build:before", nitro);
	const config = await getRollupConfig(nitro);
	await nitro.hooks.callHook("rollup:before", nitro, config);
	return nitro.options.dev ? watchDev(nitro, config) : buildProduction(nitro, config);
}
export { rollupBuild };
