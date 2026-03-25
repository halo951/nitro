import { Stats } from "node:fs";
import { Url } from "node:url";
import http, { IncomingMessage } from "node:http";
import * as stream from "node:stream";
import { Readable } from "node:stream";
import { EventEmitter } from "node:events";
import "vite";
import { DownloadTemplateOptions } from "giget";
import "rolldown";
import { Plugin as Plugin$1 } from "rollup";
import { CompilerOptions, TypeAcquisition } from "typescript";
import { Socket } from "node:net";
import "webpack";
import "@farmfe/core";
import "@rspack/core";
import "unloader";

//#region node_modules/.pnpm/@rollup+pluginutils@5.3.0_rollup@4.57.1/node_modules/@rollup/pluginutils/types/index.d.ts
/**
 * A valid `picomatch` glob pattern, or array of patterns.
 */
type FilterPattern$1 = ReadonlyArray<string | RegExp> | string | RegExp | null;
//#endregion
//#region node_modules/.pnpm/@rollup+plugin-commonjs@29.0.0_rollup@4.57.1/node_modules/@rollup/plugin-commonjs/types/index.d.ts
type RequireReturnsDefaultOption = boolean | 'auto' | 'preferred' | 'namespace';
type DefaultIsModuleExportsOption = boolean | 'auto';
interface RollupCommonJSOptions {
  /**
   * A picomatch pattern, or array of patterns, which specifies the files in
   * the build the plugin should operate on. By default, all files with
   * extension `".cjs"` or those in `extensions` are included, but you can
   * narrow this list by only including specific files. These files will be
   * analyzed and transpiled if either the analysis does not find ES module
   * specific statements or `transformMixedEsModules` is `true`.
   * @default undefined
   */
  include?: FilterPattern$1;
  /**
   * A picomatch pattern, or array of patterns, which specifies the files in
   * the build the plugin should _ignore_. By default, all files with
   * extensions other than those in `extensions` or `".cjs"` are ignored, but you
   * can exclude additional files. See also the `include` option.
   * @default undefined
   */
  exclude?: FilterPattern$1;
  /**
   * For extensionless imports, search for extensions other than .js in the
   * order specified. Note that you need to make sure that non-JavaScript files
   * are transpiled by another plugin first.
   * @default [ '.js' ]
   */
  extensions?: ReadonlyArray<string>;
  /**
   * If true then uses of `global` won't be dealt with by this plugin
   * @default false
   */
  ignoreGlobal?: boolean;
  /**
   * If false, skips source map generation for CommonJS modules. This will
   * improve performance.
   * @default true
   */
  sourceMap?: boolean;
  /**
   * Some `require` calls cannot be resolved statically to be translated to
   * imports.
   * When this option is set to `false`, the generated code will either
   * directly throw an error when such a call is encountered or, when
   * `dynamicRequireTargets` is used, when such a call cannot be resolved with a
   * configured dynamic require target.
   * Setting this option to `true` will instead leave the `require` call in the
   * code or use it as a fallback for `dynamicRequireTargets`.
   * @default false
   */
  ignoreDynamicRequires?: boolean;
  /**
   * Instructs the plugin whether to enable mixed module transformations. This
   * is useful in scenarios with modules that contain a mix of ES `import`
   * statements and CommonJS `require` expressions. Set to `true` if `require`
   * calls should be transformed to imports in mixed modules, or `false` if the
   * `require` expressions should survive the transformation. The latter can be
   * important if the code contains environment detection, or you are coding
   * for an environment with special treatment for `require` calls such as
   * ElectronJS. See also the `ignore` option.
   * @default false
   */
  transformMixedEsModules?: boolean;
  /**
   * By default, this plugin will try to hoist `require` statements as imports
   * to the top of each file. While this works well for many code bases and
   * allows for very efficient ESM output, it does not perfectly capture
   * CommonJS semantics as the order of side effects like log statements may
   * change. But it is especially problematic when there are circular `require`
   * calls between CommonJS modules as those often rely on the lazy execution of
   * nested `require` calls.
   *
   * Setting this option to `true` will wrap all CommonJS files in functions
   * which are executed when they are required for the first time, preserving
   * NodeJS semantics. Note that this can have an impact on the size and
   * performance of the generated code.
   *
   * The default value of `"auto"` will only wrap CommonJS files when they are
   * part of a CommonJS dependency cycle, e.g. an index file that is required by
   * many of its dependencies. All other CommonJS files are hoisted. This is the
   * recommended setting for most code bases.
   *
   * `false` will entirely prevent wrapping and hoist all files. This may still
   * work depending on the nature of cyclic dependencies but will often cause
   * problems.
   *
   * You can also provide a picomatch pattern, or array of patterns, to only
   * specify a subset of files which should be wrapped in functions for proper
   * `require` semantics.
   *
   * `"debug"` works like `"auto"` but after bundling, it will display a warning
   * containing a list of ids that have been wrapped which can be used as
   * picomatch pattern for fine-tuning.
   * @default "auto"
   */
  strictRequires?: boolean | FilterPattern$1;
  /**
   * Sometimes you have to leave require statements unconverted. Pass an array
   * containing the IDs or a `id => boolean` function.
   * @default []
   */
  ignore?: ReadonlyArray<string> | ((id: string) => boolean);
  /**
   * In most cases, where `require` calls are inside a `try-catch` clause,
   * they should be left unconverted as it requires an optional dependency
   * that may or may not be installed beside the rolled up package.
   * Due to the conversion of `require` to a static `import` - the call is
   * hoisted to the top of the file, outside the `try-catch` clause.
   *
   * - `true`: Default. All `require` calls inside a `try` will be left unconverted.
   * - `false`: All `require` calls inside a `try` will be converted as if the
   *   `try-catch` clause is not there.
   * - `remove`: Remove all `require` calls from inside any `try` block.
   * - `string[]`: Pass an array containing the IDs to left unconverted.
   * - `((id: string) => boolean|'remove')`: Pass a function that controls
   *   individual IDs.
   *
   * @default true
   */
  ignoreTryCatch?: boolean | 'remove' | ReadonlyArray<string> | ((id: string) => boolean | 'remove');
  /**
   * Controls how to render imports from external dependencies. By default,
   * this plugin assumes that all external dependencies are CommonJS. This
   * means they are rendered as default imports to be compatible with e.g.
   * NodeJS where ES modules can only import a default export from a CommonJS
   * dependency.
   *
   * If you set `esmExternals` to `true`, this plugin assumes that all
   * external dependencies are ES modules and respect the
   * `requireReturnsDefault` option. If that option is not set, they will be
   * rendered as namespace imports.
   *
   * You can also supply an array of ids to be treated as ES modules, or a
   * function that will be passed each external id to determine whether it is
   * an ES module.
   * @default false
   */
  esmExternals?: boolean | ReadonlyArray<string> | ((id: string) => boolean);
  /**
   * Controls what is returned when requiring an ES module from a CommonJS file.
   * When using the `esmExternals` option, this will also apply to external
   * modules. By default, this plugin will render those imports as namespace
   * imports i.e.
   *
   * ```js
   * // input
   * const foo = require('foo');
   *
   * // output
   * import * as foo from 'foo';
   * ```
   *
   * However, there are some situations where this may not be desired.
   * For these situations, you can change Rollup's behaviour either globally or
   * per module. To change it globally, set the `requireReturnsDefault` option
   * to one of the following values:
   *
   * - `false`: This is the default, requiring an ES module returns its
   *   namespace. This is the only option that will also add a marker
   *   `__esModule: true` to the namespace to support interop patterns in
   *   CommonJS modules that are transpiled ES modules.
   * - `"namespace"`: Like `false`, requiring an ES module returns its
   *   namespace, but the plugin does not add the `__esModule` marker and thus
   *   creates more efficient code. For external dependencies when using
   *   `esmExternals: true`, no additional interop code is generated.
   * - `"auto"`: This is complementary to how `output.exports: "auto"` works in
   *   Rollup: If a module has a default export and no named exports, requiring
   *   that module returns the default export. In all other cases, the namespace
   *   is returned. For external dependencies when using `esmExternals: true`, a
   *   corresponding interop helper is added.
   * - `"preferred"`: If a module has a default export, requiring that module
   *   always returns the default export, no matter whether additional named
   *   exports exist. This is similar to how previous versions of this plugin
   *   worked. Again for external dependencies when using `esmExternals: true`,
   *   an interop helper is added.
   * - `true`: This will always try to return the default export on require
   *   without checking if it actually exists. This can throw at build time if
   *   there is no default export. This is how external dependencies are handled
   *   when `esmExternals` is not used. The advantage over the other options is
   *   that, like `false`, this does not add an interop helper for external
   *   dependencies, keeping the code lean.
   *
   * To change this for individual modules, you can supply a function for
   * `requireReturnsDefault` instead. This function will then be called once for
   * each required ES module or external dependency with the corresponding id
   * and allows you to return different values for different modules.
   * @default false
   */
  requireReturnsDefault?: RequireReturnsDefaultOption | ((id: string) => RequireReturnsDefaultOption);
  /**
   * @default "auto"
   */
  defaultIsModuleExports?: DefaultIsModuleExportsOption | ((id: string) => DefaultIsModuleExportsOption);
  /**
   * Some modules contain dynamic `require` calls, or require modules that
   * contain circular dependencies, which are not handled well by static
   * imports. Including those modules as `dynamicRequireTargets` will simulate a
   * CommonJS (NodeJS-like) environment for them with support for dynamic
   * dependencies. It also enables `strictRequires` for those modules.
   *
   * Note: In extreme cases, this feature may result in some paths being
   * rendered as absolute in the final bundle. The plugin tries to avoid
   * exposing paths from the local machine, but if you are `dynamicRequirePaths`
   * with paths that are far away from your project's folder, that may require
   * replacing strings like `"/Users/John/Desktop/foo-project/"` -> `"/"`.
   */
  dynamicRequireTargets?: string | ReadonlyArray<string>;
  /**
   * To avoid long paths when using the `dynamicRequireTargets` option, you can use this option to specify a directory
   * that is a common parent for all files that use dynamic require statements. Using a directory higher up such as `/`
   * may lead to unnecessarily long paths in the generated code and may expose directory names on your machine like your
   * home directory name. By default, it uses the current working directory.
   */
  dynamicRequireRoot?: string;
  /**
   * When enabled, external Node built-ins (e.g., `node:fs`) required from wrapped CommonJS modules
   * will use `createRequire(import.meta.url)` instead of being hoisted as ESM imports. This prevents
   * eager loading of Node built-ins at module initialization time.
   *
   * Note: This option adds a dependency on `node:module` in the output, which may not be available
   * in some environments like edge runtimes (Cloudflare Workers, Vercel Edge Runtime).
   *
   * @default false
   */
  requireNodeBuiltins?: boolean;
}
/**
 * Convert CommonJS modules to ES6, so they can be included in a Rollup bundle
 */
declare function commonjs(options?: RollupCommonJSOptions): Plugin$1;
//#endregion
//#region node_modules/.pnpm/c12@4.0.0-beta.2_chokidar@5_057e05d9fd202908f499deec129b0d8b/node_modules/c12/dist/_chunks/libs/ohash.d.mts
//#region node_modules/.pnpm/ohash@2.0.11/node_modules/ohash/dist/utils/index.d.mts
/**
 * Calculates the difference between two objects and returns a list of differences.
 *
 * @param {any} obj1 - The first object to compare.
 * @param {any} obj2 - The second object to compare.
 * @param {HashOptions} [opts={}] - Configuration options for hashing the objects. See {@link HashOptions}.
 * @returns {DiffEntry[]} An array with the differences between the two objects.
 */
declare function diff(obj1: any, obj2: any): DiffEntry[];
declare class DiffEntry {
  key: string;
  type: "changed" | "added" | "removed";
  newValue: DiffHashedObject;
  oldValue?: DiffHashedObject | undefined;
  constructor(key: string, type: "changed" | "added" | "removed", newValue: DiffHashedObject, oldValue?: DiffHashedObject | undefined);
  toString(): string;
  toJSON(): string;
}
declare class DiffHashedObject {
  key: string;
  value: any;
  hash?: string | undefined;
  props?: Record<string, DiffHashedObject> | undefined;
  constructor(key: string, value: any, hash?: string | undefined, props?: Record<string, DiffHashedObject> | undefined);
  toString(): string;
  toJSON(): string;
} //#endregion
//#endregion
//#region node_modules/.pnpm/chokidar@5.0.0/node_modules/chokidar/index.d.ts
type AWF = {
  stabilityThreshold: number;
  pollInterval: number;
};
type BasicOpts = {
  persistent: boolean;
  ignoreInitial: boolean;
  followSymlinks: boolean;
  cwd?: string;
  usePolling: boolean;
  interval: number;
  binaryInterval: number;
  alwaysStat?: boolean;
  depth?: number;
  ignorePermissionErrors: boolean;
  atomic: boolean | number;
};
type ChokidarOptions = Partial<BasicOpts & {
  ignored: Matcher | Matcher[];
  awaitWriteFinish: boolean | Partial<AWF>;
}>;
type MatchFunction = (val: string, stats?: Stats) => boolean;
interface MatcherObject {
  path: string;
  recursive?: boolean;
}
type Matcher = string | RegExp | MatchFunction | MatcherObject;
//#endregion
//#region node_modules/.pnpm/c12@4.0.0-beta.2_chokidar@5_057e05d9fd202908f499deec129b0d8b/node_modules/c12/dist/index.d.mts
//#region src/dotenv.d.ts
interface DotenvOptions {
  /**
   * The project root directory (either absolute or relative to the current working directory).
   *
   * Defaults to `options.cwd` in `loadConfig` context, or `process.cwd()` when used as standalone.
   */
  cwd?: string;
  /**
   * What file or files to look in for environment variables (either absolute or relative
   * to the current working directory). For example, `.env`.
   * With the array type, the order enforce the env loading priority (last one overrides).
   */
  fileName?: string | string[];
  /**
   * Whether to interpolate variables within .env.
   *
   * @example
   * ```env
   * BASE_DIR="/test"
   * # resolves to "/test/further"
   * ANOTHER_DIR="${BASE_DIR}/further"
   * ```
   */
  interpolate?: boolean;
  /**
   * An object describing environment variables (key, value pairs).
   */
  env?: NodeJS.ProcessEnv;
  /**
   * Resolve `_FILE` suffixed environment variables by reading the file at the
   * specified path and assigning its trimmed content to the base key.
   *
   * This is useful for container secrets (e.g. Docker, Kubernetes) where
   * sensitive values are mounted as files.
   *
   * @default true
   *
   * @example
   * ```env
   * DATABASE_PASSWORD_FILE="/run/secrets/db_password"
   * # resolves to DATABASE_PASSWORD=<contents of /run/secrets/db_password>
   * ```
   */
  expandFileReferences?: boolean;
}
declare global {
  var __c12_dotenv_vars__: Map<Record<string, any>, Set<string>>;
} //#endregion
//#region src/types.d.ts
interface ConfigLayerMeta {
  name?: string;
  [key: string]: any;
}
type UserInputConfig = Record<string, any>;
interface C12InputConfig<T extends UserInputConfig = UserInputConfig, MT extends ConfigLayerMeta = ConfigLayerMeta> {
  $test?: T;
  $development?: T;
  $production?: T;
  $env?: Record<string, T>;
  $meta?: MT;
}
interface SourceOptions<T extends UserInputConfig = UserInputConfig, MT extends ConfigLayerMeta = ConfigLayerMeta> {
  /** Custom meta for layer */
  meta?: MT;
  /** Layer config overrides */
  overrides?: T;
  [key: string]: any;
  /**
   * Options for cloning remote sources
   *
   * @see https://giget.unjs.io
   */
  giget?: DownloadTemplateOptions;
  /**
   * Install dependencies after cloning
   *
   * @see https://nypm.unjs.io
   */
  install?: boolean;
  /**
   * Token for cloning private sources
   *
   * @see https://giget.unjs.io#providing-token-for-private-repositories
   */
  auth?: string;
}
interface ConfigLayer<T extends UserInputConfig = UserInputConfig, MT extends ConfigLayerMeta = ConfigLayerMeta> {
  config: T | null;
  source?: string;
  sourceOptions?: SourceOptions<T, MT>;
  meta?: MT;
  cwd?: string;
  configFile?: string;
}
interface ResolvedConfig<T extends UserInputConfig = UserInputConfig, MT extends ConfigLayerMeta = ConfigLayerMeta> extends ConfigLayer<T, MT> {
  config: T;
  layers?: ConfigLayer<T, MT>[];
  cwd?: string;
  _configFile?: string;
}
type ConfigSource = "overrides" | "main" | "rc" | "packageJson" | "defaultConfig";
interface ConfigFunctionContext {
  [key: string]: any;
}
interface ResolvableConfigContext<T extends UserInputConfig = UserInputConfig> {
  configs: Record<ConfigSource, T | null | undefined>;
  rawConfigs: Record<ConfigSource, ResolvableConfig<T> | null | undefined>;
}
type MaybePromise<T> = T | Promise<T>;
type ResolvableConfig<T extends UserInputConfig = UserInputConfig> = MaybePromise<T | null | undefined> | ((ctx: ResolvableConfigContext<T>) => MaybePromise<T | null | undefined>);
interface LoadConfigOptions<T extends UserInputConfig = UserInputConfig, MT extends ConfigLayerMeta = ConfigLayerMeta> {
  name?: string;
  cwd?: string;
  configFile?: string;
  rcFile?: false | string;
  globalRc?: boolean;
  dotenv?: boolean | DotenvOptions;
  envName?: string | false;
  packageJson?: boolean | string | string[];
  defaults?: T;
  defaultConfig?: ResolvableConfig<T>;
  overrides?: ResolvableConfig<T>;
  omit$Keys?: boolean;
  /** Context passed to config functions */
  context?: ConfigFunctionContext;
  resolve?: (id: string, options: LoadConfigOptions<T, MT>) => null | undefined | ResolvedConfig<T, MT> | Promise<ResolvedConfig<T, MT> | undefined | null>;
  /** Custom import function used to load configuration files */
  import?: (id: string) => Promise<unknown>;
  /** Custom resolver for picking which export to use from the loaded module. Default: `(mod) => mod.default || mod` */
  resolveModule?: (mod: any) => any;
  giget?: false | DownloadTemplateOptions;
  merger?: (...sources: Array<T | null | undefined>) => T;
  extend?: false | {
    extendKey?: string | string[];
  };
  configFileRequired?: boolean;
}
//#endregion
//#region src/watch.d.ts
type DiffEntries = ReturnType<typeof diff>;
type ConfigWatcher<T extends UserInputConfig = UserInputConfig, MT extends ConfigLayerMeta = ConfigLayerMeta> = ResolvedConfig<T, MT> & {
  watchingFiles: string[];
  unwatch: () => Promise<void>;
};
interface WatchConfigOptions<T extends UserInputConfig = UserInputConfig, MT extends ConfigLayerMeta = ConfigLayerMeta> extends LoadConfigOptions<T, MT> {
  chokidarOptions?: ChokidarOptions;
  debounce?: false | number;
  onWatch?: (event: {
    type: "created" | "updated" | "removed";
    path: string;
  }) => void | Promise<void>;
  acceptHMR?: (context: {
    getDiff: () => DiffEntries;
    newConfig: ResolvedConfig<T, MT>;
    oldConfig: ResolvedConfig<T, MT>;
  }) => void | boolean | Promise<void | boolean>;
  onUpdate?: (context: {
    getDiff: () => ReturnType<typeof diff>;
    newConfig: ResolvedConfig<T, MT>;
    oldConfig: ResolvedConfig<T, MT>;
  }) => void | Promise<void>;
}
//#endregion
//#region node_modules/.pnpm/compatx@0.2.0/node_modules/compatx/dist/index.d.mts
/**
 * Known platform names
 */
declare const platforms: readonly ["aws", "azure", "cloudflare", "deno", "firebase", "netlify", "vercel"];
/**
 * Known platform name
 */
type PlatformName = (typeof platforms)[number] | (string & {});
/**
 * Normalize the compatibility dates from input config and defaults.
 */
type Year = `${number}${number}${number}${number}`;
type Month = `${"0" | "1"}${number}`;
type Day = `${"0" | "1" | "2" | "3"}${number}`;
/**
 * Typed date string in `YYYY-MM-DD` format
 *
 * Empty string is used to represent an "unspecified" date.
 *
 * "latest" is used to represent the latest date available (date of today).
 */
type DateString = "" | "latest" | `${Year}-${Month}-${Day}`;
/**
 * Last known compatibility dates for platforms
 *
 * @example
 * {
 *  "default": "2024-01-01",
 *  "cloudflare": "2024-03-01",
 * }
 */
type CompatibilityDates = {
  /**
   * Default compatibility date for all unspecified platforms (required)
   */
  default: DateString;
} & Partial<Record<PlatformName, DateString>>;
/**
 * Last known compatibility date for the used platform
 */
type CompatibilityDateSpec = DateString | Partial<CompatibilityDates>;
/**
 * Get compatibility updates applicable for the user given platform and date range.
 */
//#endregion
//#region node_modules/.pnpm/httpxy@0.2.0/node_modules/httpxy/dist/index.d.ts
interface ProxyTargetDetailed {
  host: string;
  port: number;
  protocol?: string;
  hostname?: string;
  socketPath?: string;
  key?: string;
  passphrase?: string;
  pfx?: Buffer | string;
  cert?: string;
  ca?: string;
  ciphers?: string;
  secureProtocol?: string;
}
type ProxyTarget = string | URL | Partial<Url> | ProxyTargetDetailed;
interface ProxyServerOptions {
  /** URL string to be parsed. */
  target?: ProxyTarget;
  /** URL string to be parsed. */
  forward?: Exclude<ProxyTarget, ProxyTargetDetailed>;
  /** Object to be passed to http(s).request. */
  agent?: any;
  /** Object to be passed to https.createServer(). */
  ssl?: any;
  /** If you want to proxy websockets. */
  ws?: boolean;
  /** Adds x- forward headers. */
  xfwd?: boolean;
  /** Verify SSL certificate. */
  secure?: boolean;
  /** Explicitly specify if we are proxying to another proxy. */
  toProxy?: boolean;
  /** Specify whether you want to prepend the target's path to the proxy path. */
  prependPath?: boolean;
  /** Specify whether you want to ignore the proxy path of the incoming request. */
  ignorePath?: boolean;
  /** Local interface string to bind for outgoing connections. */
  localAddress?: string;
  /** Changes the origin of the host header to the target URL. */
  changeOrigin?: boolean;
  /** specify whether you want to keep letter case of response header key */
  preserveHeaderKeyCase?: boolean;
  /** Basic authentication i.e. 'user:password' to compute an Authorization header. */
  auth?: string;
  /** Rewrites the location hostname on (301 / 302 / 307 / 308) redirects, Default: null. */
  hostRewrite?: string;
  /** Rewrites the location host/ port on (301 / 302 / 307 / 308) redirects based on requested host/ port.Default: false. */
  autoRewrite?: boolean;
  /** Rewrites the location protocol on (301 / 302 / 307 / 308) redirects to 'http' or 'https'.Default: null. */
  protocolRewrite?: string;
  /** Rewrites domain of set-cookie headers. */
  cookieDomainRewrite?: false | string | {
    [oldDomain: string]: string;
  };
  /** Rewrites path of set-cookie headers. Default: false */
  cookiePathRewrite?: false | string | {
    [oldPath: string]: string;
  };
  /** Object with extra headers to be added to target requests. */
  headers?: {
    [header: string]: string;
  };
  /** Timeout (in milliseconds) when proxy receives no response from target. Default: 120000 (2 minutes) */
  proxyTimeout?: number;
  /** Timeout (in milliseconds) for incoming requests */
  timeout?: number;
  /** If set to true, none of the webOutgoing passes are called and it's your responsibility to appropriately return the response by listening and acting on the proxyRes event */
  selfHandleResponse?: boolean;
  /** Buffer */
  buffer?: stream.Stream;
}
//#endregion
//#region node_modules/.pnpm/pkg-types@2.3.0/node_modules/pkg-types/dist/index.d.mts
type StripEnums<T extends Record<string, any>> = { [K in keyof T]: T[K] extends boolean ? T[K] : T[K] extends string ? T[K] : T[K] extends object ? T[K] : T[K] extends Array<any> ? T[K] : T[K] extends undefined ? undefined : any };
interface TSConfig {
  compilerOptions?: StripEnums<CompilerOptions>;
  exclude?: string[];
  compileOnSave?: boolean;
  extends?: string | string[];
  files?: string[];
  include?: string[];
  typeAcquisition?: TypeAcquisition;
  references?: {
    path: string;
  }[];
}
/**
 * Defines a TSConfig structure.
 * @param tsconfig - The contents of `tsconfig.json` as an object. See {@link TSConfig}.
 * @returns the same `tsconfig.json` object.
 */
//#endregion
//#region node_modules/.pnpm/esbuild@0.27.3/node_modules/esbuild/lib/main.d.ts
// Note: These declarations exist to avoid type errors when you omit "dom" from
// "lib" in your "tsconfig.json" file. TypeScript confusingly declares the
// global "WebAssembly" type in "lib.dom.d.ts" even though it has nothing to do
// with the browser DOM and is present in many non-browser JavaScript runtimes
// (e.g. node and deno). Declaring it here allows esbuild's API to be used in
// these scenarios.
//
// There's an open issue about getting this problem corrected (although these
// declarations will need to remain even if this is fixed for backward
// compatibility with older TypeScript versions):
//
//   https://github.com/microsoft/TypeScript-DOM-lib-generator/issues/826
//
declare global {
  namespace WebAssembly {
    interface Module {}
  }
  interface URL {}
}
//#endregion
//#region node_modules/.pnpm/unplugin-utils@0.3.1/node_modules/unplugin-utils/dist/index.d.ts
//#region src/filter.d.ts
/**
* A valid `picomatch` glob pattern, or array of patterns.
*/
type FilterPattern = ReadonlyArray<string | RegExp> | string | RegExp | null;
/**
* Constructs a filter function which can be used to determine whether or not
* certain modules should be operated upon.
* @param include If `include` is omitted or has zero length, filter will return `true` by default.
* @param exclude ID must not match any of the `exclude` patterns.
* @param options Additional options.
* @param options.resolve Optionally resolves the patterns against a directory other than `process.cwd()`.
* If a `string` is specified, then the value will be used as the base directory.
* Relative paths will be resolved against `process.cwd()` first.
* If `false`, then the patterns will not be resolved against any directory.
* This can be useful if you want to create a filter for virtual module names.
*/
//#endregion
//#region node_modules/.pnpm/magic-string@0.30.21/node_modules/magic-string/dist/magic-string.es.d.mts
interface SourceMapOptions {
  /**
   * Whether the mapping should be high-resolution.
   * Hi-res mappings map every single character, meaning (for example) your devtools will always
   * be able to pinpoint the exact location of function calls and so on.
   * With lo-res mappings, devtools may only be able to identify the correct
   * line - but they're quicker to generate and less bulky.
   * You can also set `"boundary"` to generate a semi-hi-res mappings segmented per word boundary
   * instead of per character, suitable for string semantics that are separated by words.
   * If sourcemap locations have been specified with s.addSourceMapLocation(), they will be used here.
   */
  hires?: boolean | 'boundary';
  /**
   * The filename where you plan to write the sourcemap.
   */
  file?: string;
  /**
   * The filename of the file containing the original source.
   */
  source?: string;
  /**
   * Whether to include the original content in the map's sourcesContent array.
   */
  includeContent?: boolean;
}
type SourceMapSegment = [number] | [number, number, number, number] | [number, number, number, number, number];
interface DecodedSourceMap {
  file: string;
  sources: string[];
  sourcesContent?: string[];
  names: string[];
  mappings: SourceMapSegment[][];
  x_google_ignoreList?: number[];
}
declare class SourceMap {
  constructor(properties: DecodedSourceMap);
  version: number;
  file: string;
  sources: string[];
  sourcesContent?: string[];
  names: string[];
  mappings: string;
  x_google_ignoreList?: number[];
  debugId?: string;
  /**
   * Returns the equivalent of `JSON.stringify(map)`
   */
  toString(): string;
  /**
   * Returns a DataURI containing the sourcemap. Useful for doing this sort of thing:
   * `generateMap(options?: SourceMapOptions): SourceMap;`
   */
  toUrl(): string;
}
type ExclusionRange = [number, number];
interface MagicStringOptions {
  filename?: string;
  indentExclusionRanges?: ExclusionRange | Array<ExclusionRange>;
  offset?: number;
}
interface IndentOptions {
  exclude?: ExclusionRange | Array<ExclusionRange>;
  indentStart?: boolean;
}
interface OverwriteOptions {
  storeName?: boolean;
  contentOnly?: boolean;
}
interface UpdateOptions {
  storeName?: boolean;
  overwrite?: boolean;
}
declare class MagicString {
  constructor(str: string, options?: MagicStringOptions);
  /**
   * Adds the specified character index (with respect to the original string) to sourcemap mappings, if `hires` is false.
   */
  addSourcemapLocation(char: number): void;
  /**
   * Appends the specified content to the end of the string.
   */
  append(content: string): this;
  /**
   * Appends the specified content at the index in the original string.
   * If a range *ending* with index is subsequently moved, the insert will be moved with it.
   * See also `s.prependLeft(...)`.
   */
  appendLeft(index: number, content: string): this;
  /**
   * Appends the specified content at the index in the original string.
   * If a range *starting* with index is subsequently moved, the insert will be moved with it.
   * See also `s.prependRight(...)`.
   */
  appendRight(index: number, content: string): this;
  /**
   * Does what you'd expect.
   */
  clone(): this;
  /**
   * Generates a version 3 sourcemap.
   */
  generateMap(options?: SourceMapOptions): SourceMap;
  /**
   * Generates a sourcemap object with raw mappings in array form, rather than encoded as a string.
   * Useful if you need to manipulate the sourcemap further, but most of the time you will use `generateMap` instead.
   */
  generateDecodedMap(options?: SourceMapOptions): DecodedSourceMap;
  getIndentString(): string;
  /**
   * Prefixes each line of the string with prefix.
   * If prefix is not supplied, the indentation will be guessed from the original content, falling back to a single tab character.
   */
  indent(options?: IndentOptions): this;
  /**
   * Prefixes each line of the string with prefix.
   * If prefix is not supplied, the indentation will be guessed from the original content, falling back to a single tab character.
   *
   * The options argument can have an exclude property, which is an array of [start, end] character ranges.
   * These ranges will be excluded from the indentation - useful for (e.g.) multiline strings.
   */
  indent(indentStr?: string, options?: IndentOptions): this;
  indentExclusionRanges: ExclusionRange | Array<ExclusionRange>;
  /**
   * Moves the characters from `start` and `end` to `index`.
   */
  move(start: number, end: number, index: number): this;
  /**
   * Replaces the characters from `start` to `end` with `content`, along with the appended/prepended content in
   * that range. The same restrictions as `s.remove()` apply.
   *
   * The fourth argument is optional. It can have a storeName property — if true, the original name will be stored
   * for later inclusion in a sourcemap's names array — and a contentOnly property which determines whether only
   * the content is overwritten, or anything that was appended/prepended to the range as well.
   *
   * It may be preferred to use `s.update(...)` instead if you wish to avoid overwriting the appended/prepended content.
   */
  overwrite(start: number, end: number, content: string, options?: boolean | OverwriteOptions): this;
  /**
   * Replaces the characters from `start` to `end` with `content`. The same restrictions as `s.remove()` apply.
   *
   * The fourth argument is optional. It can have a storeName property — if true, the original name will be stored
   * for later inclusion in a sourcemap's names array — and an overwrite property which determines whether only
   * the content is overwritten, or anything that was appended/prepended to the range as well.
   */
  update(start: number, end: number, content: string, options?: boolean | UpdateOptions): this;
  /**
   * Prepends the string with the specified content.
   */
  prepend(content: string): this;
  /**
   * Same as `s.appendLeft(...)`, except that the inserted content will go *before* any previous appends or prepends at index
   */
  prependLeft(index: number, content: string): this;
  /**
   * Same as `s.appendRight(...)`, except that the inserted content will go *before* any previous appends or prepends at `index`
   */
  prependRight(index: number, content: string): this;
  /**
   * Removes the characters from `start` to `end` (of the original string, **not** the generated string).
   * Removing the same content twice, or making removals that partially overlap, will cause an error.
   */
  remove(start: number, end: number): this;
  /**
   * Reset the modified characters from `start` to `end` (of the original string, **not** the generated string).
   */
  reset(start: number, end: number): this;
  /**
   * Returns the content of the generated string that corresponds to the slice between `start` and `end` of the original string.
   * Throws error if the indices are for characters that were already removed.
   */
  slice(start: number, end: number): string;
  /**
   * Returns a clone of `s`, with all content before the `start` and `end` characters of the original string removed.
   */
  snip(start: number, end: number): this;
  /**
   * Trims content matching `charType` (defaults to `\s`, i.e. whitespace) from the start and end.
   */
  trim(charType?: string): this;
  /**
   * Trims content matching `charType` (defaults to `\s`, i.e. whitespace) from the start.
   */
  trimStart(charType?: string): this;
  /**
   * Trims content matching `charType` (defaults to `\s`, i.e. whitespace) from the end.
   */
  trimEnd(charType?: string): this;
  /**
   * Removes empty lines from the start and end.
   */
  trimLines(): this;
  /**
   * String replacement with RegExp or string.
   */
  replace(regex: RegExp | string, replacement: string | ((substring: string, ...args: any[]) => string)): this;
  /**
   * Same as `s.replace`, but replace all matched strings instead of just one.
   */
  replaceAll(regex: RegExp | string, replacement: string | ((substring: string, ...args: any[]) => string)): this;
  lastChar(): string;
  lastLine(): string;
  /**
   * Returns true if the resulting source is empty (disregarding white space).
   */
  isEmpty(): boolean;
  length(): number;
  /**
   * Indicates if the string has been changed.
   */
  hasChanged(): boolean;
  original: string;
  /**
   * Returns the generated string.
   */
  toString(): string;
  offset: number;
}
//#endregion
//#region node_modules/.pnpm/mlly@1.8.0/node_modules/mlly/dist/index.d.ts
/**
 * Represents a general structure for ECMAScript module exports.
 */
interface ESMExport {
  /**
   * Optional explicit type for complex scenarios, often used internally.
   * @optional
   */
  _type?: "declaration" | "named" | "default" | "star";
  /**
   * The type of export (declaration, named, default or star).
   */
  type: "declaration" | "named" | "default" | "star";
  /**
   * The specific type of declaration being exported, if applicable.
   * @optional
   */
  declarationType?: "let" | "var" | "const" | "enum" | "const enum" | "class" | "function" | "async function";
  /**
   * The full code snippet of the export statement.
   */
  code: string;
  /**
   * The starting position (index) of the export declaration in the source code.
   */
  start: number;
  /**
   * The end position (index) of the export declaration in the source code.
   */
  end: number;
  /**
   * The name of the variable, function or class being exported, if given explicitly.
   * @optional
   */
  name?: string;
  /**
   * The name used for default exports when a specific identifier isn't given.
   * @optional
   */
  defaultName?: string;
  /**
   * An array of names to export, applicable to named and destructured exports.
   */
  names: string[];
  /**
   * The module specifier, if any, from which exports are being re-exported.
   * @optional
   */
  specifier?: string;
}
/**
 * Represents a declaration export within an ECMAScript module.
 * Extends {@link ESMExport}.
 */
//#endregion
//#region node_modules/.pnpm/unimport@5.6.0/node_modules/unimport/dist/shared/unimport.C0UbTDPO.d.mts
declare const builtinPresets: {
  '@vue/composition-api': InlinePreset;
  '@vueuse/core': () => Preset;
  '@vueuse/head': InlinePreset;
  pinia: InlinePreset;
  preact: InlinePreset;
  quasar: InlinePreset;
  react: InlinePreset;
  'react-router': InlinePreset;
  'react-router-dom': InlinePreset;
  svelte: InlinePreset;
  'svelte/animate': InlinePreset;
  'svelte/easing': InlinePreset;
  'svelte/motion': InlinePreset;
  'svelte/store': InlinePreset;
  'svelte/transition': InlinePreset;
  'vee-validate': InlinePreset;
  vitepress: InlinePreset;
  'vue-demi': InlinePreset;
  'vue-i18n': InlinePreset;
  'vue-router': InlinePreset;
  'vue-router-composables': InlinePreset;
  vue: InlinePreset;
  'vue/macros': InlinePreset;
  vuex: InlinePreset;
  vitest: InlinePreset;
  'uni-app': InlinePreset;
  'solid-js': InlinePreset;
  'solid-app-router': InlinePreset;
  rxjs: InlinePreset;
  'date-fns': InlinePreset;
};
type BuiltinPresetName = keyof typeof builtinPresets;
type ModuleId = string;
type ImportName = string;
interface ImportCommon {
  /** Module specifier to import from */
  from: ModuleId;
  /**
   * Priority of the import, if multiple imports have the same name, the one with the highest priority will be used
   * @default 1
   */
  priority?: number;
  /** If this import is disabled */
  disabled?: boolean;
  /** Won't output import in declaration file if true */
  dtsDisabled?: boolean;
  /** Import declaration type like const / var / enum */
  declarationType?: ESMExport['declarationType'];
  /**
   * Metadata of the import
   */
  meta?: {
    /** Short description of the import */description?: string; /** URL to the documentation */
    docsUrl?: string; /** Additional metadata */
    [key: string]: any;
  };
  /**
   * If this import is a pure type import
   */
  type?: boolean;
  /**
   * Using this as the from when generating type declarations
   */
  typeFrom?: ModuleId;
}
interface Import extends ImportCommon {
  /** Import name to be detected */
  name: ImportName;
  /** Import as this name */
  as?: ImportName;
  /**
   * With properties
   *
   * Ignored for CJS imports.
   */
  with?: Record<string, string>;
}
type PresetImport = Omit<Import, 'from'> | ImportName | [name: ImportName, as?: ImportName, from?: ModuleId];
interface InlinePreset extends ImportCommon {
  imports: (PresetImport | InlinePreset)[];
}
/**
 * Auto extract exports from a package for auto import
 */
interface PackagePreset {
  /**
   * Name of the package
   */
  package: string;
  /**
   * Path of the importer
   * @default process.cwd()
   */
  url?: string;
  /**
   * RegExp, string, or custom function to exclude names of the extracted imports
   */
  ignore?: (string | RegExp | ((name: string) => boolean))[];
  /**
   * Use local cache if exits
   * @default true
   */
  cache?: boolean;
}
type Preset = InlinePreset | PackagePreset;
interface UnimportContext {
  readonly version: string;
  options: Partial<UnimportOptions>;
  staticImports: Import[];
  dynamicImports: Import[];
  addons: Addon[];
  getImports: () => Promise<Import[]>;
  getImportMap: () => Promise<Map<string, Import>>;
  getMetadata: () => UnimportMeta | undefined;
  modifyDynamicImports: (fn: (imports: Import[]) => Thenable<void | Import[]>) => Promise<void>;
  clearDynamicImports: () => void;
  replaceImports: (imports: UnimportOptions['imports']) => Promise<Import[]>;
  invalidate: () => void;
  resolveId: (id: string, parentId?: string) => Thenable<string | null | undefined | void>;
}
interface DetectImportResult {
  s: MagicString;
  strippedCode: string;
  isCJSContext: boolean;
  matchedImports: Import[];
  firstOccurrence: number;
}
interface Unimport {
  readonly version: string;
  init: () => Promise<void>;
  clearDynamicImports: UnimportContext['clearDynamicImports'];
  getImportMap: UnimportContext['getImportMap'];
  getImports: UnimportContext['getImports'];
  getInternalContext: () => UnimportContext;
  getMetadata: UnimportContext['getMetadata'];
  modifyDynamicImports: UnimportContext['modifyDynamicImports'];
  generateTypeDeclarations: (options?: TypeDeclarationOptions) => Promise<string>;
  /**
   * Get un-imported usages from code
   */
  detectImports: (code: string | MagicString) => Promise<DetectImportResult>;
  /**
   * Insert missing imports statements to code
   */
  injectImports: (code: string | MagicString, id?: string, options?: InjectImportsOptions) => Promise<ImportInjectionResult>;
  scanImportsFromDir: (dir?: (string | ScanDir)[], options?: ScanDirExportsOptions) => Promise<Import[]>;
  scanImportsFromFile: (file: string, includeTypes?: boolean) => Promise<Import[]>;
  /**
   * @deprecated
   */
  toExports: (filepath?: string, includeTypes?: boolean) => Promise<string>;
}
interface InjectionUsageRecord {
  import: Import;
  count: number;
  moduleIds: string[];
}
interface UnimportMeta {
  injectionUsage: Record<string, InjectionUsageRecord>;
}
interface AddonsOptions {
  addons?: Addon[];
  /**
   * Enable auto import inside for Vue's <template>
   *
   * @default false
   */
  vueTemplate?: boolean;
  /**
   * Enable auto import directives for Vue's SFC.
   *
   * Library authors should include `meta.vueDirective: true` in the import metadata.
   *
   * When using a local directives folder, provide the `isDirective`
   * callback to check if the import is a Vue directive.
   */
  vueDirectives?: true | AddonVueDirectivesOptions;
}
interface AddonVueDirectivesOptions {
  /**
   * Checks if the import is a Vue directive.
   *
   * **NOTES**:
   * - imports from a library should include `meta.vueDirective: true`.
   * - this callback is only invoked for local directives (only when meta.vueDirective is not set).
   *
   * @param from The path of the import normalized.
   * @param importEntry The import entry.
   */
  isDirective?: (from: string, importEntry: Import) => boolean;
}
interface UnimportOptions extends Pick<InjectImportsOptions, 'injectAtEnd' | 'mergeExisting' | 'parser'> {
  /**
   * Auto import items
   */
  imports: Import[];
  /**
   * Auto import preset
   */
  presets: (Preset | BuiltinPresetName)[];
  /**
   * Custom warning function
   * @default console.warn
   */
  warn: (msg: string) => void;
  /**
   * Custom debug log function
   * @default console.log
   */
  debugLog: (msg: string) => void;
  /**
   * Unimport Addons.
   * To use built-in addons, use:
   * ```js
   * addons: {
   *   addons: [<custom-addons-here>] // if you want to use also custom addons
   *   vueTemplate: true,
   *   vueDirectives: [<the-directives-here>]
   * }
   * ```
   *
   * Built-in addons:
   * - vueDirectives: enable auto import directives for Vue's SFC
   * - vueTemplate: enable auto import inside for Vue's <template>
   *
   * @default {}
   */
  addons: AddonsOptions | Addon[];
  /**
   * Name of virtual modules that exposed all the registed auto-imports
   * @default []
   */
  virtualImports: string[];
  /**
   * Directories to scan for auto import
   * @default []
   */
  dirs?: (string | ScanDir)[];
  /**
   * Options for scanning directories for auto import
   */
  dirsScanOptions?: ScanDirExportsOptions;
  /**
   * Custom resolver to auto import id
   */
  resolveId?: (id: string, importee?: string) => Thenable<string | void>;
  /**
   * Custom magic comments to be opt-out for auto import, per file/module
   *
   * @default ['@unimport-disable', '@imports-disable']
   */
  commentsDisable?: string[];
  /**
   * Custom magic comments to debug auto import, printed to console
   *
   * @default ['@unimport-debug', '@imports-debug']
   */
  commentsDebug?: string[];
  /**
   * Collect meta data for each auto import. Accessible via `ctx.meta`
   */
  collectMeta?: boolean;
}
type PathFromResolver = (_import: Import) => string | undefined;
interface ScanDirExportsOptions {
  /**
   * Glob patterns for matching files
   *
   * @default ['*.{ts,js,mjs,cjs,mts,cts,tsx,jsx}']
   */
  filePatterns?: string[];
  /**
   * Custom function to filter scanned files
   */
  fileFilter?: (file: string) => boolean;
  /**
   * Register type exports
   *
   * @default true
   */
  types?: boolean;
  /**
   * Current working directory
   *
   * @default process.cwd()
   */
  cwd?: string;
}
interface ScanDir {
  /**
   * Path pattern of the directory
   */
  glob: string;
  /**
   * Register type exports
   *
   * @default true
   */
  types?: boolean;
}
interface TypeDeclarationOptions {
  /**
   * Custom resolver for path of the import
   */
  resolvePath?: PathFromResolver;
  /**
   * Append `export {}` to the end of the file
   *
   * @default true
   */
  exportHelper?: boolean;
  /**
   * Auto-import for type exports
   *
   * @default true
   */
  typeReExports?: boolean;
}
interface InjectImportsOptions {
  /**
   * Merge the existing imports
   *
   * @default false
   */
  mergeExisting?: boolean;
  /**
   * If the module should be auto imported
   *
   * @default true
   */
  autoImport?: boolean;
  /**
   * If the module should be transformed for virtual modules.
   * Only available when `virtualImports` is set.
   *
   * @default true
   */
  transformVirtualImports?: boolean;
  /**
   * Parser to use for parsing the code
   *
   * Note that `acorn` only takes valid JS Code, should usually only be used after transformationa and transpilation
   *
   * @default 'regex'
   */
  parser?: 'acorn' | 'regex';
  /**
   * Inject the imports at the end of other imports
   *
   * @default false
   */
  injectAtEnd?: boolean;
}
type Thenable<T> = Promise<T> | T;
interface Addon {
  name?: string;
  transform?: (this: UnimportContext, code: MagicString, id: string | undefined) => Thenable<MagicString>;
  declaration?: (this: UnimportContext, dts: string, options: TypeDeclarationOptions) => Thenable<string>;
  matchImports?: (this: UnimportContext, identifiers: Set<string>, matched: Import[]) => Thenable<Import[] | void>;
  /**
   * Extend or modify the imports list before injecting
   */
  extendImports?: (this: UnimportContext, imports: Import[]) => Import[] | void;
  /**
   * Resolve imports before injecting
   */
  injectImportsResolved?: (this: UnimportContext, imports: Import[], code: MagicString, id?: string) => Import[] | void;
  /**
   * Modify the injection code before injecting
   */
  injectImportsStringified?: (this: UnimportContext, injection: string, imports: Import[], code: MagicString, id?: string) => string | void;
}
interface MagicStringResult {
  s: MagicString;
  code: string;
}
interface ImportInjectionResult extends MagicStringResult {
  imports: Import[];
}
//#endregion
//#region node_modules/.pnpm/unimport@5.6.0/node_modules/unimport/dist/unplugin.d.mts
interface UnimportPluginOptions extends UnimportOptions {
  include: FilterPattern;
  exclude: FilterPattern;
  dts: boolean | string;
  /**
   * Enable implicit auto import.
   * Generate global TypeScript definitions.
   *
   * @default true
   */
  autoImport?: boolean;
}
//#endregion
//#region node_modules/.pnpm/unwasm@0.5.3/node_modules/unwasm/dist/plugin/index.d.mts
//#region src/plugin/shared.d.ts
interface UnwasmPluginOptions {
  /**
   * Directly import the `.wasm` files instead of bundling as base64 string.
   *
   * @default false
   */
  esmImport?: boolean;
  /**
   * Avoid using top level await and always use a proxy.
   *
   * Useful for compatibility with environments that don't support top level await.
   *
   * @default false
   */
  lazy?: boolean;
  /**
   * Suppress all warnings from the plugin.
   *
   * @default false
   */
  silent?: boolean;
} //#endregion
//#region src/plugin/index.d.ts
//#endregion
//#region node_modules/.pnpm/rou3@0.7.12/node_modules/rou3/dist/index.d.mts
interface RouterContext<T = unknown> {
  root: Node<T>;
  static: Record<string, Node<T> | undefined>;
}
type ParamsIndexMap = Array<[Index: number, name: string | RegExp, optional: boolean]>;
type MethodData<T = unknown> = {
  data: T;
  paramsMap?: ParamsIndexMap;
  paramsRegexp: RegExp[];
};
interface Node<T = unknown> {
  key: string;
  static?: Record<string, Node<T>>;
  param?: Node<T>;
  wildcard?: Node<T>;
  hasRegexParam?: boolean;
  methods?: Record<string, MethodData<T>[] | undefined>;
}
//#endregion
//#region node_modules/.pnpm/rou3@0.7.12/node_modules/rou3/dist/compiler.d.mts
interface RouterCompilerOptions<T = any> {
  matchAll?: boolean;
  serialize?: (data: T) => string;
}
/**
* Compiles the router instance into a faster route-matching function.
*
* **IMPORTANT:** `compileRouter` requires eval support with `new Function()` in the runtime for JIT compilation.
*
* @example
* import { createRouter, addRoute } from "rou3";
* import { compileRouter } from "rou3/compiler";
* const router = createRouter();
* // [add some routes]
* const findRoute = compileRouter(router);
* const matchAll = compileRouter(router, { matchAll: true });
* findRoute("GET", "/path/foo/bar");
*
* @param router - The router context to compile.
*/
//#endregion
//#region node_modules/.pnpm/std-env@3.10.0/node_modules/std-env/dist/index.d.ts
type ProviderName = "" | "appveyor" | "aws_amplify" | "azure_pipelines" | "azure_static" | "appcircle" | "bamboo" | "bitbucket" | "bitrise" | "buddy" | "buildkite" | "circle" | "cirrus" | "cloudflare_pages" | "cloudflare_workers" | "codebuild" | "codefresh" | "drone" | "drone" | "dsari" | "github_actions" | "gitlab" | "gocd" | "layerci" | "hudson" | "jenkins" | "magnum" | "netlify" | "nevercode" | "render" | "sail" | "semaphore" | "screwdriver" | "shippable" | "solano" | "strider" | "teamcity" | "travis" | "vercel" | "appcenter" | "codesandbox" | "stackblitz" | "stormkit" | "cleavr" | "zeabur" | "codesphere" | "railway" | "deno-deploy" | "firebase_app_hosting";
//#endregion
export { ChokidarOptions as _, type UnimportPluginOptions as a, type ProxyServerOptions as c, type DateString as d, C12InputConfig as f, type WatchConfigOptions as g, type ResolvedConfig as h, type UnwasmPluginOptions as i, type CompatibilityDateSpec as l, type DotenvOptions as m, type RouterCompilerOptions as n, type Unimport as o, type ConfigWatcher as p, type RouterContext as r, type TSConfig as s, type ProviderName as t, CompatibilityDates as u, commonjs as v };