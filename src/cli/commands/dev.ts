import type { Nitro } from "nitro/types";
import { defineCommand } from "citty";
import { consola } from "consola";
import { build, createNitro, prepare } from "nitro/builder";
import { resolve } from "pathe";
import { commonArgs } from "../common.ts";
import { NitroDevServer } from "../../dev/server.ts";

const hmrKeyRe = /^runtimeConfig\.|routeRules\./;
const shutdownSignals = ["SIGINT", "SIGTERM", "SIGHUP", "SIGBREAK"] as const;

export default defineCommand({
  meta: {
    name: "dev",
    description: "Start the development server",
  },
  args: {
    ...commonArgs,
    port: { type: "string", description: "specify port" },
    host: { type: "string", description: "specify hostname " },
  },
  async run({ args }) {
    const rootDir = resolve((args.dir || args._dir || ".") as string);
    let nitro: Nitro;
    let shuttingDown = false;

    const cleanupAndExit = async (signal: (typeof shutdownSignals)[number]) => {
      if (shuttingDown) {
        return;
      }
      shuttingDown = true;
      consola.info(`Received ${signal}, shutting down dev server...`);
      try {
        if (nitro) {
          await nitro.hooks.callHook("close");
          await nitro.close();
        }
      } catch (error) {
        consola.error(error);
      } finally {
        for (const sig of shutdownSignals) {
          process.off(sig, onSignal);
        }
        process.exit(signal === "SIGINT" ? 130 : 0);
      }
    };

    const onSignal = (signal: string) =>
      cleanupAndExit(signal as (typeof shutdownSignals)[number]);
    for (const signal of shutdownSignals) {
      process.on(signal, onSignal);
    }

    const reload = async () => {
      if (nitro) {
        consola.info("Restarting dev server...");
        if ("unwatch" in nitro.options._c12) {
          await nitro.options._c12.unwatch();
        }
        await nitro.close();
      }
      nitro = await createNitro(
        {
          rootDir,
          dev: true,
          _cli: { command: "dev" },
        },
        {
          watch: true,
          c12: {
            async onUpdate({ getDiff, newConfig }) {
              const diff = getDiff();

              if (diff.length === 0) {
                return; // No changes
              }

              consola.info(
                "Nitro config updated:\n" +
                  diff.map((entry) => `  ${entry.toString()}`).join("\n"),
              );

              await (diff.every((e) => hmrKeyRe.test(e.key))
                ? nitro.updateConfig(newConfig.config || {}) // Hot reload
                : reload()); // Full reload
            },
          },
        },
      );
      nitro.hooks.hookOnce("restart", reload);
      const server = new NitroDevServer(nitro);

      await server.listen({
        port: args.port || nitro.options.devServer.port,
        hostname: args.host || nitro.options.devServer.hostname,
      });
      await prepare(nitro);
      await build(nitro);
    };
    await reload();
  },
});
