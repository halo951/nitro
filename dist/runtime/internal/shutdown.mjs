import { useNitroApp } from "../app.mjs";
export function resolveGracefulShutdownConfig() {
	if (process.env.NITRO_SHUTDOWN_DISABLED === "true") {
		return false;
	}
	const timeoutMs = Number.parseInt(process.env.NITRO_SHUTDOWN_TIMEOUT ?? "", 10);
	if (timeoutMs > 0) {
		// srvx expects timeout in seconds
		return { gracefulTimeout: timeoutMs / 1e3 };
	}
	return undefined;
}
function _onShutdownSignal() {
	useNitroApp().hooks?.callHook("close");
}
export function setupShutdownHooks() {
	process.on("SIGTERM", _onShutdownSignal);
	process.on("SIGINT", _onShutdownSignal);
}
