import { i as __toESM, n as __exportAll$1, r as __require, t as __commonJSMin } from "../_common.mjs";
import { $ as o$5, C as decode, E as parse$4, F as Builder, P as require_picomatch, Q as a$4, S as MagicString, T as Parser, Y as readPackageJSON$1, a as dataToEsm, at as dirname$2, b as getMagicString, c as walk$1, ct as join$2, dt as resolve$3, et as c$4, i as createFilter$2, it as basename$2, lt as normalize$2, nt as resolveModulePath, o as extractAssignedNames, ot as extname$2, q as findWorkspaceDir, r as attachScopes, s as makeLegalIdentifier, st as isAbsolute$2, tt as o$4, w as encode, x as stripLiteral, y as createUnimport } from "../_build/common.mjs";
import { createRequire } from "node:module";
import fs, { Stats, existsSync, promises, readFileSync, stat, statSync, unwatchFile, watch, watchFile } from "node:fs";
import * as nodeUtil from "node:util";
import { parseArgs } from "node:util";
import { lstat, open, readFile, readdir, realpath, rm, stat as stat$1 } from "node:fs/promises";
import { fileURLToPath, pathToFileURL } from "node:url";
import { homedir, type } from "node:os";
import * as sp from "node:path";
import path, { basename, delimiter, dirname, extname, isAbsolute, join, normalize, relative, resolve, sep } from "node:path";
import assert from "node:assert";
import process$1, { cwd } from "node:process";
import destr from "destr";
import { defu } from "defu";
import { builtinModules as builtinModules$1, createRequire as createRequire$1 } from "module";
import nativeFs, { existsSync as existsSync$1, readFileSync as readFileSync$1, realpathSync as realpathSync$1, statSync as statSync$1 } from "fs";
import path$1, { basename as basename$1, dirname as dirname$1, extname as extname$1, join as join$1, normalize as normalize$1, relative as relative$1, resolve as resolve$1, sep as sep$1 } from "path";
import { fileURLToPath as fileURLToPath$1, pathToFileURL as pathToFileURL$1 } from "url";
import "scule";
import http from "node:http";
import { PassThrough, Readable } from "node:stream";
import nodeHTTPS from "node:https";
import { EventEmitter } from "node:events";
import { createHash } from "node:crypto";
import { isCSSRequest, normalizePath } from "vite";
import { spawn } from "node:child_process";
import assert$1 from "node:assert/strict";
import c from "node:readline";
import { Buffer as Buffer$1 } from "node:buffer";
import * as querystring from "node:querystring";
import { promisify as promisify$1 } from "util";
const DEBOUNCE_DEFAULTS$1 = { trailing: true };
function debounce$1(fn, wait = 25, options = {}) {
	options = {
		...DEBOUNCE_DEFAULTS$1,
		...options
	};
	if (!Number.isFinite(wait)) throw new TypeError("Expected `wait` to be a finite number");
	let leadingValue;
	let timeout;
	let resolveList = [];
	let currentPromise;
	let trailingArgs;
	const applyFn = (_this, args) => {
		currentPromise = _applyPromised$1(fn, _this, args);
		currentPromise.finally(() => {
			currentPromise = null;
			if (options.trailing && trailingArgs && !timeout) {
				const promise = applyFn(_this, trailingArgs);
				trailingArgs = null;
				return promise;
			}
		});
		return currentPromise;
	};
	const debounced = function(...args) {
		if (options.trailing) trailingArgs = args;
		if (currentPromise) return currentPromise;
		return new Promise((resolve) => {
			const shouldCallNow = !timeout && options.leading;
			clearTimeout(timeout);
			timeout = setTimeout(() => {
				timeout = null;
				const promise = options.leading ? leadingValue : applyFn(this, args);
				trailingArgs = null;
				for (const _resolve of resolveList) _resolve(promise);
				resolveList = [];
			}, wait);
			if (shouldCallNow) {
				leadingValue = applyFn(this, args);
				resolve(leadingValue);
			} else resolveList.push(resolve);
		});
	};
	const _clearTimeout = (timer) => {
		if (timer) {
			clearTimeout(timer);
			timeout = null;
		}
	};
	debounced.isPending = () => !!timeout;
	debounced.cancel = () => {
		_clearTimeout(timeout);
		resolveList = [];
		trailingArgs = null;
	};
	debounced.flush = () => {
		_clearTimeout(timeout);
		if (!trailingArgs || currentPromise) return;
		const args = trailingArgs;
		trailingArgs = null;
		return applyFn(this, args);
	};
	return debounced;
}
async function _applyPromised$1(fn, _this, args) {
	return await fn.apply(_this, args);
}
function isBuffer(obj) {
	return obj && obj.constructor && typeof obj.constructor.isBuffer === "function" && obj.constructor.isBuffer(obj);
}
function keyIdentity(key) {
	return key;
}
function flatten$1(target, opts) {
	opts = opts || {};
	const delimiter = opts.delimiter || ".";
	const maxDepth = opts.maxDepth;
	const transformKey = opts.transformKey || keyIdentity;
	const output = {};
	function step(object, prev, currentDepth) {
		currentDepth = currentDepth || 1;
		Object.keys(object).forEach(function(key) {
			const value = object[key];
			const isarray = opts.safe && Array.isArray(value);
			const type = Object.prototype.toString.call(value);
			const isbuffer = isBuffer(value);
			const isobject = type === "[object Object]" || type === "[object Array]";
			const newKey = prev ? prev + delimiter + transformKey(key) : transformKey(key);
			if (!isarray && !isbuffer && isobject && Object.keys(value).length && (!opts.maxDepth || currentDepth < maxDepth)) return step(value, newKey, currentDepth + 1);
			output[newKey] = value;
		});
	}
	step(target);
	return output;
}
function unflatten(target, opts) {
	opts = opts || {};
	const delimiter = opts.delimiter || ".";
	const overwrite = opts.overwrite || false;
	const transformKey = opts.transformKey || keyIdentity;
	const result = {};
	if (isBuffer(target) || Object.prototype.toString.call(target) !== "[object Object]") return target;
	function getkey(key) {
		const parsedKey = Number(key);
		return isNaN(parsedKey) || key.indexOf(".") !== -1 || opts.object ? key : parsedKey;
	}
	function addKeys(keyPrefix, recipient, target) {
		return Object.keys(target).reduce(function(result, key) {
			result[keyPrefix + delimiter + key] = target[key];
			return result;
		}, recipient);
	}
	function isEmpty(val) {
		const type = Object.prototype.toString.call(val);
		const isArray = type === "[object Array]";
		const isObject = type === "[object Object]";
		if (!val) return true;
		else if (isArray) return !val.length;
		else if (isObject) return !Object.keys(val).length;
	}
	target = Object.keys(target).reduce(function(result, key) {
		const type = Object.prototype.toString.call(target[key]);
		if (!(type === "[object Object]" || type === "[object Array]") || isEmpty(target[key])) {
			result[key] = target[key];
			return result;
		} else return addKeys(key, result, flatten$1(target[key], opts));
	}, {});
	Object.keys(target).forEach(function(key) {
		const split = key.split(delimiter).map(transformKey);
		let key1 = getkey(split.shift());
		let key2 = getkey(split[0]);
		let recipient = result;
		while (key2 !== void 0) {
			if (key1 === "__proto__") return;
			const type = Object.prototype.toString.call(recipient[key1]);
			const isobject = type === "[object Object]" || type === "[object Array]";
			if (!overwrite && !isobject && typeof recipient[key1] !== "undefined") return;
			if (overwrite && !isobject || !overwrite && recipient[key1] == null) recipient[key1] = typeof key2 === "number" && !opts.object ? [] : {};
			recipient = recipient[key1];
			if (split.length > 0) {
				key1 = getkey(split.shift());
				key2 = getkey(split[0]);
			}
		}
		recipient[key1] = unflatten(target[key], opts);
	});
	return result;
}
const RE_KEY_VAL = /^\s*([^\s=]+)\s*=\s*(.*)?\s*$/;
const RE_LINES = /\n|\r|\r\n/;
const defaults$1 = {
	name: ".conf",
	dir: process.cwd(),
	flat: false
};
function withDefaults(options) {
	if (typeof options === "string") options = { name: options };
	return {
		...defaults$1,
		...options
	};
}
function parse$3(contents, options = {}) {
	const config = {};
	const lines = contents.split(RE_LINES);
	for (const line of lines) {
		const match = line.match(RE_KEY_VAL);
		if (!match) continue;
		const key = match[1];
		if (!key || key === "__proto__" || key === "constructor") continue;
		const value = destr((match[2] || "").trim());
		if (key.endsWith("[]")) {
			const nkey = key.slice(0, Math.max(0, key.length - 2));
			config[nkey] = (config[nkey] || []).concat(value);
			continue;
		}
		config[key] = value;
	}
	return options.flat ? config : unflatten(config, { overwrite: true });
}
function parseFile$1(path, options) {
	if (!existsSync(path)) return {};
	return parse$3(readFileSync(path, "utf8"), options);
}
function read(options) {
	options = withDefaults(options);
	return parseFile$1(resolve(options.dir, options.name), options);
}
function readUser(options) {
	options = withDefaults(options);
	options.dir = process.env.XDG_CONFIG_HOME || homedir();
	return read(options);
}
var t$2 = o$4(((e, t) => {
	t.exports.Space_Separator = /[\u1680\u2000-\u200A\u202F\u205F\u3000]/, t.exports.ID_Start = /[\xAA\xB5\xBA\xC0-\xD6\xD8-\xF6\xF8-\u02C1\u02C6-\u02D1\u02E0-\u02E4\u02EC\u02EE\u0370-\u0374\u0376\u0377\u037A-\u037D\u037F\u0386\u0388-\u038A\u038C\u038E-\u03A1\u03A3-\u03F5\u03F7-\u0481\u048A-\u052F\u0531-\u0556\u0559\u0561-\u0587\u05D0-\u05EA\u05F0-\u05F2\u0620-\u064A\u066E\u066F\u0671-\u06D3\u06D5\u06E5\u06E6\u06EE\u06EF\u06FA-\u06FC\u06FF\u0710\u0712-\u072F\u074D-\u07A5\u07B1\u07CA-\u07EA\u07F4\u07F5\u07FA\u0800-\u0815\u081A\u0824\u0828\u0840-\u0858\u0860-\u086A\u08A0-\u08B4\u08B6-\u08BD\u0904-\u0939\u093D\u0950\u0958-\u0961\u0971-\u0980\u0985-\u098C\u098F\u0990\u0993-\u09A8\u09AA-\u09B0\u09B2\u09B6-\u09B9\u09BD\u09CE\u09DC\u09DD\u09DF-\u09E1\u09F0\u09F1\u09FC\u0A05-\u0A0A\u0A0F\u0A10\u0A13-\u0A28\u0A2A-\u0A30\u0A32\u0A33\u0A35\u0A36\u0A38\u0A39\u0A59-\u0A5C\u0A5E\u0A72-\u0A74\u0A85-\u0A8D\u0A8F-\u0A91\u0A93-\u0AA8\u0AAA-\u0AB0\u0AB2\u0AB3\u0AB5-\u0AB9\u0ABD\u0AD0\u0AE0\u0AE1\u0AF9\u0B05-\u0B0C\u0B0F\u0B10\u0B13-\u0B28\u0B2A-\u0B30\u0B32\u0B33\u0B35-\u0B39\u0B3D\u0B5C\u0B5D\u0B5F-\u0B61\u0B71\u0B83\u0B85-\u0B8A\u0B8E-\u0B90\u0B92-\u0B95\u0B99\u0B9A\u0B9C\u0B9E\u0B9F\u0BA3\u0BA4\u0BA8-\u0BAA\u0BAE-\u0BB9\u0BD0\u0C05-\u0C0C\u0C0E-\u0C10\u0C12-\u0C28\u0C2A-\u0C39\u0C3D\u0C58-\u0C5A\u0C60\u0C61\u0C80\u0C85-\u0C8C\u0C8E-\u0C90\u0C92-\u0CA8\u0CAA-\u0CB3\u0CB5-\u0CB9\u0CBD\u0CDE\u0CE0\u0CE1\u0CF1\u0CF2\u0D05-\u0D0C\u0D0E-\u0D10\u0D12-\u0D3A\u0D3D\u0D4E\u0D54-\u0D56\u0D5F-\u0D61\u0D7A-\u0D7F\u0D85-\u0D96\u0D9A-\u0DB1\u0DB3-\u0DBB\u0DBD\u0DC0-\u0DC6\u0E01-\u0E30\u0E32\u0E33\u0E40-\u0E46\u0E81\u0E82\u0E84\u0E87\u0E88\u0E8A\u0E8D\u0E94-\u0E97\u0E99-\u0E9F\u0EA1-\u0EA3\u0EA5\u0EA7\u0EAA\u0EAB\u0EAD-\u0EB0\u0EB2\u0EB3\u0EBD\u0EC0-\u0EC4\u0EC6\u0EDC-\u0EDF\u0F00\u0F40-\u0F47\u0F49-\u0F6C\u0F88-\u0F8C\u1000-\u102A\u103F\u1050-\u1055\u105A-\u105D\u1061\u1065\u1066\u106E-\u1070\u1075-\u1081\u108E\u10A0-\u10C5\u10C7\u10CD\u10D0-\u10FA\u10FC-\u1248\u124A-\u124D\u1250-\u1256\u1258\u125A-\u125D\u1260-\u1288\u128A-\u128D\u1290-\u12B0\u12B2-\u12B5\u12B8-\u12BE\u12C0\u12C2-\u12C5\u12C8-\u12D6\u12D8-\u1310\u1312-\u1315\u1318-\u135A\u1380-\u138F\u13A0-\u13F5\u13F8-\u13FD\u1401-\u166C\u166F-\u167F\u1681-\u169A\u16A0-\u16EA\u16EE-\u16F8\u1700-\u170C\u170E-\u1711\u1720-\u1731\u1740-\u1751\u1760-\u176C\u176E-\u1770\u1780-\u17B3\u17D7\u17DC\u1820-\u1877\u1880-\u1884\u1887-\u18A8\u18AA\u18B0-\u18F5\u1900-\u191E\u1950-\u196D\u1970-\u1974\u1980-\u19AB\u19B0-\u19C9\u1A00-\u1A16\u1A20-\u1A54\u1AA7\u1B05-\u1B33\u1B45-\u1B4B\u1B83-\u1BA0\u1BAE\u1BAF\u1BBA-\u1BE5\u1C00-\u1C23\u1C4D-\u1C4F\u1C5A-\u1C7D\u1C80-\u1C88\u1CE9-\u1CEC\u1CEE-\u1CF1\u1CF5\u1CF6\u1D00-\u1DBF\u1E00-\u1F15\u1F18-\u1F1D\u1F20-\u1F45\u1F48-\u1F4D\u1F50-\u1F57\u1F59\u1F5B\u1F5D\u1F5F-\u1F7D\u1F80-\u1FB4\u1FB6-\u1FBC\u1FBE\u1FC2-\u1FC4\u1FC6-\u1FCC\u1FD0-\u1FD3\u1FD6-\u1FDB\u1FE0-\u1FEC\u1FF2-\u1FF4\u1FF6-\u1FFC\u2071\u207F\u2090-\u209C\u2102\u2107\u210A-\u2113\u2115\u2119-\u211D\u2124\u2126\u2128\u212A-\u212D\u212F-\u2139\u213C-\u213F\u2145-\u2149\u214E\u2160-\u2188\u2C00-\u2C2E\u2C30-\u2C5E\u2C60-\u2CE4\u2CEB-\u2CEE\u2CF2\u2CF3\u2D00-\u2D25\u2D27\u2D2D\u2D30-\u2D67\u2D6F\u2D80-\u2D96\u2DA0-\u2DA6\u2DA8-\u2DAE\u2DB0-\u2DB6\u2DB8-\u2DBE\u2DC0-\u2DC6\u2DC8-\u2DCE\u2DD0-\u2DD6\u2DD8-\u2DDE\u2E2F\u3005-\u3007\u3021-\u3029\u3031-\u3035\u3038-\u303C\u3041-\u3096\u309D-\u309F\u30A1-\u30FA\u30FC-\u30FF\u3105-\u312E\u3131-\u318E\u31A0-\u31BA\u31F0-\u31FF\u3400-\u4DB5\u4E00-\u9FEA\uA000-\uA48C\uA4D0-\uA4FD\uA500-\uA60C\uA610-\uA61F\uA62A\uA62B\uA640-\uA66E\uA67F-\uA69D\uA6A0-\uA6EF\uA717-\uA71F\uA722-\uA788\uA78B-\uA7AE\uA7B0-\uA7B7\uA7F7-\uA801\uA803-\uA805\uA807-\uA80A\uA80C-\uA822\uA840-\uA873\uA882-\uA8B3\uA8F2-\uA8F7\uA8FB\uA8FD\uA90A-\uA925\uA930-\uA946\uA960-\uA97C\uA984-\uA9B2\uA9CF\uA9E0-\uA9E4\uA9E6-\uA9EF\uA9FA-\uA9FE\uAA00-\uAA28\uAA40-\uAA42\uAA44-\uAA4B\uAA60-\uAA76\uAA7A\uAA7E-\uAAAF\uAAB1\uAAB5\uAAB6\uAAB9-\uAABD\uAAC0\uAAC2\uAADB-\uAADD\uAAE0-\uAAEA\uAAF2-\uAAF4\uAB01-\uAB06\uAB09-\uAB0E\uAB11-\uAB16\uAB20-\uAB26\uAB28-\uAB2E\uAB30-\uAB5A\uAB5C-\uAB65\uAB70-\uABE2\uAC00-\uD7A3\uD7B0-\uD7C6\uD7CB-\uD7FB\uF900-\uFA6D\uFA70-\uFAD9\uFB00-\uFB06\uFB13-\uFB17\uFB1D\uFB1F-\uFB28\uFB2A-\uFB36\uFB38-\uFB3C\uFB3E\uFB40\uFB41\uFB43\uFB44\uFB46-\uFBB1\uFBD3-\uFD3D\uFD50-\uFD8F\uFD92-\uFDC7\uFDF0-\uFDFB\uFE70-\uFE74\uFE76-\uFEFC\uFF21-\uFF3A\uFF41-\uFF5A\uFF66-\uFFBE\uFFC2-\uFFC7\uFFCA-\uFFCF\uFFD2-\uFFD7\uFFDA-\uFFDC]|\uD800[\uDC00-\uDC0B\uDC0D-\uDC26\uDC28-\uDC3A\uDC3C\uDC3D\uDC3F-\uDC4D\uDC50-\uDC5D\uDC80-\uDCFA\uDD40-\uDD74\uDE80-\uDE9C\uDEA0-\uDED0\uDF00-\uDF1F\uDF2D-\uDF4A\uDF50-\uDF75\uDF80-\uDF9D\uDFA0-\uDFC3\uDFC8-\uDFCF\uDFD1-\uDFD5]|\uD801[\uDC00-\uDC9D\uDCB0-\uDCD3\uDCD8-\uDCFB\uDD00-\uDD27\uDD30-\uDD63\uDE00-\uDF36\uDF40-\uDF55\uDF60-\uDF67]|\uD802[\uDC00-\uDC05\uDC08\uDC0A-\uDC35\uDC37\uDC38\uDC3C\uDC3F-\uDC55\uDC60-\uDC76\uDC80-\uDC9E\uDCE0-\uDCF2\uDCF4\uDCF5\uDD00-\uDD15\uDD20-\uDD39\uDD80-\uDDB7\uDDBE\uDDBF\uDE00\uDE10-\uDE13\uDE15-\uDE17\uDE19-\uDE33\uDE60-\uDE7C\uDE80-\uDE9C\uDEC0-\uDEC7\uDEC9-\uDEE4\uDF00-\uDF35\uDF40-\uDF55\uDF60-\uDF72\uDF80-\uDF91]|\uD803[\uDC00-\uDC48\uDC80-\uDCB2\uDCC0-\uDCF2]|\uD804[\uDC03-\uDC37\uDC83-\uDCAF\uDCD0-\uDCE8\uDD03-\uDD26\uDD50-\uDD72\uDD76\uDD83-\uDDB2\uDDC1-\uDDC4\uDDDA\uDDDC\uDE00-\uDE11\uDE13-\uDE2B\uDE80-\uDE86\uDE88\uDE8A-\uDE8D\uDE8F-\uDE9D\uDE9F-\uDEA8\uDEB0-\uDEDE\uDF05-\uDF0C\uDF0F\uDF10\uDF13-\uDF28\uDF2A-\uDF30\uDF32\uDF33\uDF35-\uDF39\uDF3D\uDF50\uDF5D-\uDF61]|\uD805[\uDC00-\uDC34\uDC47-\uDC4A\uDC80-\uDCAF\uDCC4\uDCC5\uDCC7\uDD80-\uDDAE\uDDD8-\uDDDB\uDE00-\uDE2F\uDE44\uDE80-\uDEAA\uDF00-\uDF19]|\uD806[\uDCA0-\uDCDF\uDCFF\uDE00\uDE0B-\uDE32\uDE3A\uDE50\uDE5C-\uDE83\uDE86-\uDE89\uDEC0-\uDEF8]|\uD807[\uDC00-\uDC08\uDC0A-\uDC2E\uDC40\uDC72-\uDC8F\uDD00-\uDD06\uDD08\uDD09\uDD0B-\uDD30\uDD46]|\uD808[\uDC00-\uDF99]|\uD809[\uDC00-\uDC6E\uDC80-\uDD43]|[\uD80C\uD81C-\uD820\uD840-\uD868\uD86A-\uD86C\uD86F-\uD872\uD874-\uD879][\uDC00-\uDFFF]|\uD80D[\uDC00-\uDC2E]|\uD811[\uDC00-\uDE46]|\uD81A[\uDC00-\uDE38\uDE40-\uDE5E\uDED0-\uDEED\uDF00-\uDF2F\uDF40-\uDF43\uDF63-\uDF77\uDF7D-\uDF8F]|\uD81B[\uDF00-\uDF44\uDF50\uDF93-\uDF9F\uDFE0\uDFE1]|\uD821[\uDC00-\uDFEC]|\uD822[\uDC00-\uDEF2]|\uD82C[\uDC00-\uDD1E\uDD70-\uDEFB]|\uD82F[\uDC00-\uDC6A\uDC70-\uDC7C\uDC80-\uDC88\uDC90-\uDC99]|\uD835[\uDC00-\uDC54\uDC56-\uDC9C\uDC9E\uDC9F\uDCA2\uDCA5\uDCA6\uDCA9-\uDCAC\uDCAE-\uDCB9\uDCBB\uDCBD-\uDCC3\uDCC5-\uDD05\uDD07-\uDD0A\uDD0D-\uDD14\uDD16-\uDD1C\uDD1E-\uDD39\uDD3B-\uDD3E\uDD40-\uDD44\uDD46\uDD4A-\uDD50\uDD52-\uDEA5\uDEA8-\uDEC0\uDEC2-\uDEDA\uDEDC-\uDEFA\uDEFC-\uDF14\uDF16-\uDF34\uDF36-\uDF4E\uDF50-\uDF6E\uDF70-\uDF88\uDF8A-\uDFA8\uDFAA-\uDFC2\uDFC4-\uDFCB]|\uD83A[\uDC00-\uDCC4\uDD00-\uDD43]|\uD83B[\uDE00-\uDE03\uDE05-\uDE1F\uDE21\uDE22\uDE24\uDE27\uDE29-\uDE32\uDE34-\uDE37\uDE39\uDE3B\uDE42\uDE47\uDE49\uDE4B\uDE4D-\uDE4F\uDE51\uDE52\uDE54\uDE57\uDE59\uDE5B\uDE5D\uDE5F\uDE61\uDE62\uDE64\uDE67-\uDE6A\uDE6C-\uDE72\uDE74-\uDE77\uDE79-\uDE7C\uDE7E\uDE80-\uDE89\uDE8B-\uDE9B\uDEA1-\uDEA3\uDEA5-\uDEA9\uDEAB-\uDEBB]|\uD869[\uDC00-\uDED6\uDF00-\uDFFF]|\uD86D[\uDC00-\uDF34\uDF40-\uDFFF]|\uD86E[\uDC00-\uDC1D\uDC20-\uDFFF]|\uD873[\uDC00-\uDEA1\uDEB0-\uDFFF]|\uD87A[\uDC00-\uDFE0]|\uD87E[\uDC00-\uDE1D]/, t.exports.ID_Continue = /[\xAA\xB5\xBA\xC0-\xD6\xD8-\xF6\xF8-\u02C1\u02C6-\u02D1\u02E0-\u02E4\u02EC\u02EE\u0300-\u0374\u0376\u0377\u037A-\u037D\u037F\u0386\u0388-\u038A\u038C\u038E-\u03A1\u03A3-\u03F5\u03F7-\u0481\u0483-\u0487\u048A-\u052F\u0531-\u0556\u0559\u0561-\u0587\u0591-\u05BD\u05BF\u05C1\u05C2\u05C4\u05C5\u05C7\u05D0-\u05EA\u05F0-\u05F2\u0610-\u061A\u0620-\u0669\u066E-\u06D3\u06D5-\u06DC\u06DF-\u06E8\u06EA-\u06FC\u06FF\u0710-\u074A\u074D-\u07B1\u07C0-\u07F5\u07FA\u0800-\u082D\u0840-\u085B\u0860-\u086A\u08A0-\u08B4\u08B6-\u08BD\u08D4-\u08E1\u08E3-\u0963\u0966-\u096F\u0971-\u0983\u0985-\u098C\u098F\u0990\u0993-\u09A8\u09AA-\u09B0\u09B2\u09B6-\u09B9\u09BC-\u09C4\u09C7\u09C8\u09CB-\u09CE\u09D7\u09DC\u09DD\u09DF-\u09E3\u09E6-\u09F1\u09FC\u0A01-\u0A03\u0A05-\u0A0A\u0A0F\u0A10\u0A13-\u0A28\u0A2A-\u0A30\u0A32\u0A33\u0A35\u0A36\u0A38\u0A39\u0A3C\u0A3E-\u0A42\u0A47\u0A48\u0A4B-\u0A4D\u0A51\u0A59-\u0A5C\u0A5E\u0A66-\u0A75\u0A81-\u0A83\u0A85-\u0A8D\u0A8F-\u0A91\u0A93-\u0AA8\u0AAA-\u0AB0\u0AB2\u0AB3\u0AB5-\u0AB9\u0ABC-\u0AC5\u0AC7-\u0AC9\u0ACB-\u0ACD\u0AD0\u0AE0-\u0AE3\u0AE6-\u0AEF\u0AF9-\u0AFF\u0B01-\u0B03\u0B05-\u0B0C\u0B0F\u0B10\u0B13-\u0B28\u0B2A-\u0B30\u0B32\u0B33\u0B35-\u0B39\u0B3C-\u0B44\u0B47\u0B48\u0B4B-\u0B4D\u0B56\u0B57\u0B5C\u0B5D\u0B5F-\u0B63\u0B66-\u0B6F\u0B71\u0B82\u0B83\u0B85-\u0B8A\u0B8E-\u0B90\u0B92-\u0B95\u0B99\u0B9A\u0B9C\u0B9E\u0B9F\u0BA3\u0BA4\u0BA8-\u0BAA\u0BAE-\u0BB9\u0BBE-\u0BC2\u0BC6-\u0BC8\u0BCA-\u0BCD\u0BD0\u0BD7\u0BE6-\u0BEF\u0C00-\u0C03\u0C05-\u0C0C\u0C0E-\u0C10\u0C12-\u0C28\u0C2A-\u0C39\u0C3D-\u0C44\u0C46-\u0C48\u0C4A-\u0C4D\u0C55\u0C56\u0C58-\u0C5A\u0C60-\u0C63\u0C66-\u0C6F\u0C80-\u0C83\u0C85-\u0C8C\u0C8E-\u0C90\u0C92-\u0CA8\u0CAA-\u0CB3\u0CB5-\u0CB9\u0CBC-\u0CC4\u0CC6-\u0CC8\u0CCA-\u0CCD\u0CD5\u0CD6\u0CDE\u0CE0-\u0CE3\u0CE6-\u0CEF\u0CF1\u0CF2\u0D00-\u0D03\u0D05-\u0D0C\u0D0E-\u0D10\u0D12-\u0D44\u0D46-\u0D48\u0D4A-\u0D4E\u0D54-\u0D57\u0D5F-\u0D63\u0D66-\u0D6F\u0D7A-\u0D7F\u0D82\u0D83\u0D85-\u0D96\u0D9A-\u0DB1\u0DB3-\u0DBB\u0DBD\u0DC0-\u0DC6\u0DCA\u0DCF-\u0DD4\u0DD6\u0DD8-\u0DDF\u0DE6-\u0DEF\u0DF2\u0DF3\u0E01-\u0E3A\u0E40-\u0E4E\u0E50-\u0E59\u0E81\u0E82\u0E84\u0E87\u0E88\u0E8A\u0E8D\u0E94-\u0E97\u0E99-\u0E9F\u0EA1-\u0EA3\u0EA5\u0EA7\u0EAA\u0EAB\u0EAD-\u0EB9\u0EBB-\u0EBD\u0EC0-\u0EC4\u0EC6\u0EC8-\u0ECD\u0ED0-\u0ED9\u0EDC-\u0EDF\u0F00\u0F18\u0F19\u0F20-\u0F29\u0F35\u0F37\u0F39\u0F3E-\u0F47\u0F49-\u0F6C\u0F71-\u0F84\u0F86-\u0F97\u0F99-\u0FBC\u0FC6\u1000-\u1049\u1050-\u109D\u10A0-\u10C5\u10C7\u10CD\u10D0-\u10FA\u10FC-\u1248\u124A-\u124D\u1250-\u1256\u1258\u125A-\u125D\u1260-\u1288\u128A-\u128D\u1290-\u12B0\u12B2-\u12B5\u12B8-\u12BE\u12C0\u12C2-\u12C5\u12C8-\u12D6\u12D8-\u1310\u1312-\u1315\u1318-\u135A\u135D-\u135F\u1380-\u138F\u13A0-\u13F5\u13F8-\u13FD\u1401-\u166C\u166F-\u167F\u1681-\u169A\u16A0-\u16EA\u16EE-\u16F8\u1700-\u170C\u170E-\u1714\u1720-\u1734\u1740-\u1753\u1760-\u176C\u176E-\u1770\u1772\u1773\u1780-\u17D3\u17D7\u17DC\u17DD\u17E0-\u17E9\u180B-\u180D\u1810-\u1819\u1820-\u1877\u1880-\u18AA\u18B0-\u18F5\u1900-\u191E\u1920-\u192B\u1930-\u193B\u1946-\u196D\u1970-\u1974\u1980-\u19AB\u19B0-\u19C9\u19D0-\u19D9\u1A00-\u1A1B\u1A20-\u1A5E\u1A60-\u1A7C\u1A7F-\u1A89\u1A90-\u1A99\u1AA7\u1AB0-\u1ABD\u1B00-\u1B4B\u1B50-\u1B59\u1B6B-\u1B73\u1B80-\u1BF3\u1C00-\u1C37\u1C40-\u1C49\u1C4D-\u1C7D\u1C80-\u1C88\u1CD0-\u1CD2\u1CD4-\u1CF9\u1D00-\u1DF9\u1DFB-\u1F15\u1F18-\u1F1D\u1F20-\u1F45\u1F48-\u1F4D\u1F50-\u1F57\u1F59\u1F5B\u1F5D\u1F5F-\u1F7D\u1F80-\u1FB4\u1FB6-\u1FBC\u1FBE\u1FC2-\u1FC4\u1FC6-\u1FCC\u1FD0-\u1FD3\u1FD6-\u1FDB\u1FE0-\u1FEC\u1FF2-\u1FF4\u1FF6-\u1FFC\u203F\u2040\u2054\u2071\u207F\u2090-\u209C\u20D0-\u20DC\u20E1\u20E5-\u20F0\u2102\u2107\u210A-\u2113\u2115\u2119-\u211D\u2124\u2126\u2128\u212A-\u212D\u212F-\u2139\u213C-\u213F\u2145-\u2149\u214E\u2160-\u2188\u2C00-\u2C2E\u2C30-\u2C5E\u2C60-\u2CE4\u2CEB-\u2CF3\u2D00-\u2D25\u2D27\u2D2D\u2D30-\u2D67\u2D6F\u2D7F-\u2D96\u2DA0-\u2DA6\u2DA8-\u2DAE\u2DB0-\u2DB6\u2DB8-\u2DBE\u2DC0-\u2DC6\u2DC8-\u2DCE\u2DD0-\u2DD6\u2DD8-\u2DDE\u2DE0-\u2DFF\u2E2F\u3005-\u3007\u3021-\u302F\u3031-\u3035\u3038-\u303C\u3041-\u3096\u3099\u309A\u309D-\u309F\u30A1-\u30FA\u30FC-\u30FF\u3105-\u312E\u3131-\u318E\u31A0-\u31BA\u31F0-\u31FF\u3400-\u4DB5\u4E00-\u9FEA\uA000-\uA48C\uA4D0-\uA4FD\uA500-\uA60C\uA610-\uA62B\uA640-\uA66F\uA674-\uA67D\uA67F-\uA6F1\uA717-\uA71F\uA722-\uA788\uA78B-\uA7AE\uA7B0-\uA7B7\uA7F7-\uA827\uA840-\uA873\uA880-\uA8C5\uA8D0-\uA8D9\uA8E0-\uA8F7\uA8FB\uA8FD\uA900-\uA92D\uA930-\uA953\uA960-\uA97C\uA980-\uA9C0\uA9CF-\uA9D9\uA9E0-\uA9FE\uAA00-\uAA36\uAA40-\uAA4D\uAA50-\uAA59\uAA60-\uAA76\uAA7A-\uAAC2\uAADB-\uAADD\uAAE0-\uAAEF\uAAF2-\uAAF6\uAB01-\uAB06\uAB09-\uAB0E\uAB11-\uAB16\uAB20-\uAB26\uAB28-\uAB2E\uAB30-\uAB5A\uAB5C-\uAB65\uAB70-\uABEA\uABEC\uABED\uABF0-\uABF9\uAC00-\uD7A3\uD7B0-\uD7C6\uD7CB-\uD7FB\uF900-\uFA6D\uFA70-\uFAD9\uFB00-\uFB06\uFB13-\uFB17\uFB1D-\uFB28\uFB2A-\uFB36\uFB38-\uFB3C\uFB3E\uFB40\uFB41\uFB43\uFB44\uFB46-\uFBB1\uFBD3-\uFD3D\uFD50-\uFD8F\uFD92-\uFDC7\uFDF0-\uFDFB\uFE00-\uFE0F\uFE20-\uFE2F\uFE33\uFE34\uFE4D-\uFE4F\uFE70-\uFE74\uFE76-\uFEFC\uFF10-\uFF19\uFF21-\uFF3A\uFF3F\uFF41-\uFF5A\uFF66-\uFFBE\uFFC2-\uFFC7\uFFCA-\uFFCF\uFFD2-\uFFD7\uFFDA-\uFFDC]|\uD800[\uDC00-\uDC0B\uDC0D-\uDC26\uDC28-\uDC3A\uDC3C\uDC3D\uDC3F-\uDC4D\uDC50-\uDC5D\uDC80-\uDCFA\uDD40-\uDD74\uDDFD\uDE80-\uDE9C\uDEA0-\uDED0\uDEE0\uDF00-\uDF1F\uDF2D-\uDF4A\uDF50-\uDF7A\uDF80-\uDF9D\uDFA0-\uDFC3\uDFC8-\uDFCF\uDFD1-\uDFD5]|\uD801[\uDC00-\uDC9D\uDCA0-\uDCA9\uDCB0-\uDCD3\uDCD8-\uDCFB\uDD00-\uDD27\uDD30-\uDD63\uDE00-\uDF36\uDF40-\uDF55\uDF60-\uDF67]|\uD802[\uDC00-\uDC05\uDC08\uDC0A-\uDC35\uDC37\uDC38\uDC3C\uDC3F-\uDC55\uDC60-\uDC76\uDC80-\uDC9E\uDCE0-\uDCF2\uDCF4\uDCF5\uDD00-\uDD15\uDD20-\uDD39\uDD80-\uDDB7\uDDBE\uDDBF\uDE00-\uDE03\uDE05\uDE06\uDE0C-\uDE13\uDE15-\uDE17\uDE19-\uDE33\uDE38-\uDE3A\uDE3F\uDE60-\uDE7C\uDE80-\uDE9C\uDEC0-\uDEC7\uDEC9-\uDEE6\uDF00-\uDF35\uDF40-\uDF55\uDF60-\uDF72\uDF80-\uDF91]|\uD803[\uDC00-\uDC48\uDC80-\uDCB2\uDCC0-\uDCF2]|\uD804[\uDC00-\uDC46\uDC66-\uDC6F\uDC7F-\uDCBA\uDCD0-\uDCE8\uDCF0-\uDCF9\uDD00-\uDD34\uDD36-\uDD3F\uDD50-\uDD73\uDD76\uDD80-\uDDC4\uDDCA-\uDDCC\uDDD0-\uDDDA\uDDDC\uDE00-\uDE11\uDE13-\uDE37\uDE3E\uDE80-\uDE86\uDE88\uDE8A-\uDE8D\uDE8F-\uDE9D\uDE9F-\uDEA8\uDEB0-\uDEEA\uDEF0-\uDEF9\uDF00-\uDF03\uDF05-\uDF0C\uDF0F\uDF10\uDF13-\uDF28\uDF2A-\uDF30\uDF32\uDF33\uDF35-\uDF39\uDF3C-\uDF44\uDF47\uDF48\uDF4B-\uDF4D\uDF50\uDF57\uDF5D-\uDF63\uDF66-\uDF6C\uDF70-\uDF74]|\uD805[\uDC00-\uDC4A\uDC50-\uDC59\uDC80-\uDCC5\uDCC7\uDCD0-\uDCD9\uDD80-\uDDB5\uDDB8-\uDDC0\uDDD8-\uDDDD\uDE00-\uDE40\uDE44\uDE50-\uDE59\uDE80-\uDEB7\uDEC0-\uDEC9\uDF00-\uDF19\uDF1D-\uDF2B\uDF30-\uDF39]|\uD806[\uDCA0-\uDCE9\uDCFF\uDE00-\uDE3E\uDE47\uDE50-\uDE83\uDE86-\uDE99\uDEC0-\uDEF8]|\uD807[\uDC00-\uDC08\uDC0A-\uDC36\uDC38-\uDC40\uDC50-\uDC59\uDC72-\uDC8F\uDC92-\uDCA7\uDCA9-\uDCB6\uDD00-\uDD06\uDD08\uDD09\uDD0B-\uDD36\uDD3A\uDD3C\uDD3D\uDD3F-\uDD47\uDD50-\uDD59]|\uD808[\uDC00-\uDF99]|\uD809[\uDC00-\uDC6E\uDC80-\uDD43]|[\uD80C\uD81C-\uD820\uD840-\uD868\uD86A-\uD86C\uD86F-\uD872\uD874-\uD879][\uDC00-\uDFFF]|\uD80D[\uDC00-\uDC2E]|\uD811[\uDC00-\uDE46]|\uD81A[\uDC00-\uDE38\uDE40-\uDE5E\uDE60-\uDE69\uDED0-\uDEED\uDEF0-\uDEF4\uDF00-\uDF36\uDF40-\uDF43\uDF50-\uDF59\uDF63-\uDF77\uDF7D-\uDF8F]|\uD81B[\uDF00-\uDF44\uDF50-\uDF7E\uDF8F-\uDF9F\uDFE0\uDFE1]|\uD821[\uDC00-\uDFEC]|\uD822[\uDC00-\uDEF2]|\uD82C[\uDC00-\uDD1E\uDD70-\uDEFB]|\uD82F[\uDC00-\uDC6A\uDC70-\uDC7C\uDC80-\uDC88\uDC90-\uDC99\uDC9D\uDC9E]|\uD834[\uDD65-\uDD69\uDD6D-\uDD72\uDD7B-\uDD82\uDD85-\uDD8B\uDDAA-\uDDAD\uDE42-\uDE44]|\uD835[\uDC00-\uDC54\uDC56-\uDC9C\uDC9E\uDC9F\uDCA2\uDCA5\uDCA6\uDCA9-\uDCAC\uDCAE-\uDCB9\uDCBB\uDCBD-\uDCC3\uDCC5-\uDD05\uDD07-\uDD0A\uDD0D-\uDD14\uDD16-\uDD1C\uDD1E-\uDD39\uDD3B-\uDD3E\uDD40-\uDD44\uDD46\uDD4A-\uDD50\uDD52-\uDEA5\uDEA8-\uDEC0\uDEC2-\uDEDA\uDEDC-\uDEFA\uDEFC-\uDF14\uDF16-\uDF34\uDF36-\uDF4E\uDF50-\uDF6E\uDF70-\uDF88\uDF8A-\uDFA8\uDFAA-\uDFC2\uDFC4-\uDFCB\uDFCE-\uDFFF]|\uD836[\uDE00-\uDE36\uDE3B-\uDE6C\uDE75\uDE84\uDE9B-\uDE9F\uDEA1-\uDEAF]|\uD838[\uDC00-\uDC06\uDC08-\uDC18\uDC1B-\uDC21\uDC23\uDC24\uDC26-\uDC2A]|\uD83A[\uDC00-\uDCC4\uDCD0-\uDCD6\uDD00-\uDD4A\uDD50-\uDD59]|\uD83B[\uDE00-\uDE03\uDE05-\uDE1F\uDE21\uDE22\uDE24\uDE27\uDE29-\uDE32\uDE34-\uDE37\uDE39\uDE3B\uDE42\uDE47\uDE49\uDE4B\uDE4D-\uDE4F\uDE51\uDE52\uDE54\uDE57\uDE59\uDE5B\uDE5D\uDE5F\uDE61\uDE62\uDE64\uDE67-\uDE6A\uDE6C-\uDE72\uDE74-\uDE77\uDE79-\uDE7C\uDE7E\uDE80-\uDE89\uDE8B-\uDE9B\uDEA1-\uDEA3\uDEA5-\uDEA9\uDEAB-\uDEBB]|\uD869[\uDC00-\uDED6\uDF00-\uDFFF]|\uD86D[\uDC00-\uDF34\uDF40-\uDFFF]|\uD86E[\uDC00-\uDC1D\uDC20-\uDFFF]|\uD873[\uDC00-\uDEA1\uDEB0-\uDFFF]|\uD87A[\uDC00-\uDFE0]|\uD87E[\uDC00-\uDE1D]|\uDB40[\uDD00-\uDDEF]/;
})), n$2 = o$4(((e, n) => {
	let r = t$2();
	n.exports = {
		isSpaceSeparator(e) {
			return typeof e == `string` && r.Space_Separator.test(e);
		},
		isIdStartChar(e) {
			return typeof e == `string` && (e >= `a` && e <= `z` || e >= `A` && e <= `Z` || e === `$` || e === `_` || r.ID_Start.test(e));
		},
		isIdContinueChar(e) {
			return typeof e == `string` && (e >= `a` && e <= `z` || e >= `A` && e <= `Z` || e >= `0` && e <= `9` || e === `$` || e === `_` || e === `‌` || e === `‍` || r.ID_Continue.test(e));
		},
		isDigit(e) {
			return typeof e == `string` && /[0-9]/.test(e);
		},
		isHexDigit(e) {
			return typeof e == `string` && /[0-9A-Fa-f]/.test(e);
		}
	};
})), r$3 = o$4(((e, t) => {
	let r = n$2(), i, a, o, s, c, l, u, d, f;
	t.exports = function(e, t) {
		i = String(e), a = `start`, o = [], s = 0, c = 1, l = 0, u = void 0, d = void 0, f = void 0;
		do
			u = y(), O[a]();
		while (u.type !== `eof`);
		return typeof t == `function` ? p({ "": f }, ``, t) : f;
	};
	function p(e, t, n) {
		let r = e[t];
		if (typeof r == `object` && r) if (Array.isArray(r)) for (let e = 0; e < r.length; e++) {
			let t = String(e), i = p(r, t, n);
			i === void 0 ? delete r[t] : Object.defineProperty(r, t, {
				value: i,
				writable: !0,
				enumerable: !0,
				configurable: !0
			});
		}
		else for (let e in r) {
			let t = p(r, e, n);
			t === void 0 ? delete r[e] : Object.defineProperty(r, e, {
				value: t,
				writable: !0,
				enumerable: !0,
				configurable: !0
			});
		}
		return n.call(e, t, r);
	}
	let m, h, g, _, v;
	function y() {
		for (m = `default`, h = ``, g = !1, _ = 1;;) {
			v = b();
			let e = S[m]();
			if (e) return e;
		}
	}
	function b() {
		if (i[s]) return String.fromCodePoint(i.codePointAt(s));
	}
	function x() {
		let e = b();
		return e === `
` ? (c++, l = 0) : e ? l += e.length : l++, e && (s += e.length), e;
	}
	let S = {
		default() {
			switch (v) {
				case `	`:
				case `\v`:
				case `\f`:
				case ` `:
				case `\xA0`:
				case `﻿`:
				case `
`:
				case `\r`:
				case `\u2028`:
				case `\u2029`:
					x();
					return;
				case `/`:
					x(), m = `comment`;
					return;
				case void 0: return x(), C(`eof`);
			}
			if (r.isSpaceSeparator(v)) {
				x();
				return;
			}
			return S[a]();
		},
		comment() {
			switch (v) {
				case `*`:
					x(), m = `multiLineComment`;
					return;
				case `/`:
					x(), m = `singleLineComment`;
					return;
			}
			throw j(x());
		},
		multiLineComment() {
			switch (v) {
				case `*`:
					x(), m = `multiLineCommentAsterisk`;
					return;
				case void 0: throw j(x());
			}
			x();
		},
		multiLineCommentAsterisk() {
			switch (v) {
				case `*`:
					x();
					return;
				case `/`:
					x(), m = `default`;
					return;
				case void 0: throw j(x());
			}
			x(), m = `multiLineComment`;
		},
		singleLineComment() {
			switch (v) {
				case `
`:
				case `\r`:
				case `\u2028`:
				case `\u2029`:
					x(), m = `default`;
					return;
				case void 0: return x(), C(`eof`);
			}
			x();
		},
		value() {
			switch (v) {
				case `{`:
				case `[`: return C(`punctuator`, x());
				case `n`: return x(), w(`ull`), C(`null`, null);
				case `t`: return x(), w(`rue`), C(`boolean`, !0);
				case `f`: return x(), w(`alse`), C(`boolean`, !1);
				case `-`:
				case `+`:
					x() === `-` && (_ = -1), m = `sign`;
					return;
				case `.`:
					h = x(), m = `decimalPointLeading`;
					return;
				case `0`:
					h = x(), m = `zero`;
					return;
				case `1`:
				case `2`:
				case `3`:
				case `4`:
				case `5`:
				case `6`:
				case `7`:
				case `8`:
				case `9`:
					h = x(), m = `decimalInteger`;
					return;
				case `I`: return x(), w(`nfinity`), C(`numeric`, Infinity);
				case `N`: return x(), w(`aN`), C(`numeric`, NaN);
				case `"`:
				case `'`:
					g = x() === `"`, h = ``, m = `string`;
					return;
			}
			throw j(x());
		},
		identifierNameStartEscape() {
			if (v !== `u`) throw j(x());
			x();
			let e = D();
			switch (e) {
				case `$`:
				case `_`: break;
				default:
					if (!r.isIdStartChar(e)) throw N();
					break;
			}
			h += e, m = `identifierName`;
		},
		identifierName() {
			switch (v) {
				case `$`:
				case `_`:
				case `‌`:
				case `‍`:
					h += x();
					return;
				case `\\`:
					x(), m = `identifierNameEscape`;
					return;
			}
			if (r.isIdContinueChar(v)) {
				h += x();
				return;
			}
			return C(`identifier`, h);
		},
		identifierNameEscape() {
			if (v !== `u`) throw j(x());
			x();
			let e = D();
			switch (e) {
				case `$`:
				case `_`:
				case `‌`:
				case `‍`: break;
				default:
					if (!r.isIdContinueChar(e)) throw N();
					break;
			}
			h += e, m = `identifierName`;
		},
		sign() {
			switch (v) {
				case `.`:
					h = x(), m = `decimalPointLeading`;
					return;
				case `0`:
					h = x(), m = `zero`;
					return;
				case `1`:
				case `2`:
				case `3`:
				case `4`:
				case `5`:
				case `6`:
				case `7`:
				case `8`:
				case `9`:
					h = x(), m = `decimalInteger`;
					return;
				case `I`: return x(), w(`nfinity`), C(`numeric`, _ * Infinity);
				case `N`: return x(), w(`aN`), C(`numeric`, NaN);
			}
			throw j(x());
		},
		zero() {
			switch (v) {
				case `.`:
					h += x(), m = `decimalPoint`;
					return;
				case `e`:
				case `E`:
					h += x(), m = `decimalExponent`;
					return;
				case `x`:
				case `X`:
					h += x(), m = `hexadecimal`;
					return;
			}
			return C(`numeric`, _ * 0);
		},
		decimalInteger() {
			switch (v) {
				case `.`:
					h += x(), m = `decimalPoint`;
					return;
				case `e`:
				case `E`:
					h += x(), m = `decimalExponent`;
					return;
			}
			if (r.isDigit(v)) {
				h += x();
				return;
			}
			return C(`numeric`, _ * Number(h));
		},
		decimalPointLeading() {
			if (r.isDigit(v)) {
				h += x(), m = `decimalFraction`;
				return;
			}
			throw j(x());
		},
		decimalPoint() {
			switch (v) {
				case `e`:
				case `E`:
					h += x(), m = `decimalExponent`;
					return;
			}
			if (r.isDigit(v)) {
				h += x(), m = `decimalFraction`;
				return;
			}
			return C(`numeric`, _ * Number(h));
		},
		decimalFraction() {
			switch (v) {
				case `e`:
				case `E`:
					h += x(), m = `decimalExponent`;
					return;
			}
			if (r.isDigit(v)) {
				h += x();
				return;
			}
			return C(`numeric`, _ * Number(h));
		},
		decimalExponent() {
			switch (v) {
				case `+`:
				case `-`:
					h += x(), m = `decimalExponentSign`;
					return;
			}
			if (r.isDigit(v)) {
				h += x(), m = `decimalExponentInteger`;
				return;
			}
			throw j(x());
		},
		decimalExponentSign() {
			if (r.isDigit(v)) {
				h += x(), m = `decimalExponentInteger`;
				return;
			}
			throw j(x());
		},
		decimalExponentInteger() {
			if (r.isDigit(v)) {
				h += x();
				return;
			}
			return C(`numeric`, _ * Number(h));
		},
		hexadecimal() {
			if (r.isHexDigit(v)) {
				h += x(), m = `hexadecimalInteger`;
				return;
			}
			throw j(x());
		},
		hexadecimalInteger() {
			if (r.isHexDigit(v)) {
				h += x();
				return;
			}
			return C(`numeric`, _ * Number(h));
		},
		string() {
			switch (v) {
				case `\\`:
					x(), h += T();
					return;
				case `"`:
					if (g) return x(), C(`string`, h);
					h += x();
					return;
				case `'`:
					if (!g) return x(), C(`string`, h);
					h += x();
					return;
				case `
`:
				case `\r`: throw j(x());
				case `\u2028`:
				case `\u2029`:
					P(v);
					break;
				case void 0: throw j(x());
			}
			h += x();
		},
		start() {
			switch (v) {
				case `{`:
				case `[`: return C(`punctuator`, x());
			}
			m = `value`;
		},
		beforePropertyName() {
			switch (v) {
				case `$`:
				case `_`:
					h = x(), m = `identifierName`;
					return;
				case `\\`:
					x(), m = `identifierNameStartEscape`;
					return;
				case `}`: return C(`punctuator`, x());
				case `"`:
				case `'`:
					g = x() === `"`, m = `string`;
					return;
			}
			if (r.isIdStartChar(v)) {
				h += x(), m = `identifierName`;
				return;
			}
			throw j(x());
		},
		afterPropertyName() {
			if (v === `:`) return C(`punctuator`, x());
			throw j(x());
		},
		beforePropertyValue() {
			m = `value`;
		},
		afterPropertyValue() {
			switch (v) {
				case `,`:
				case `}`: return C(`punctuator`, x());
			}
			throw j(x());
		},
		beforeArrayValue() {
			if (v === `]`) return C(`punctuator`, x());
			m = `value`;
		},
		afterArrayValue() {
			switch (v) {
				case `,`:
				case `]`: return C(`punctuator`, x());
			}
			throw j(x());
		},
		end() {
			throw j(x());
		}
	};
	function C(e, t) {
		return {
			type: e,
			value: t,
			line: c,
			column: l
		};
	}
	function w(e) {
		for (let t of e) {
			if (b() !== t) throw j(x());
			x();
		}
	}
	function T() {
		switch (b()) {
			case `b`: return x(), `\b`;
			case `f`: return x(), `\f`;
			case `n`: return x(), `
`;
			case `r`: return x(), `\r`;
			case `t`: return x(), `	`;
			case `v`: return x(), `\v`;
			case `0`:
				if (x(), r.isDigit(b())) throw j(x());
				return `\0`;
			case `x`: return x(), E();
			case `u`: return x(), D();
			case `
`:
			case `\u2028`:
			case `\u2029`: return x(), ``;
			case `\r`: return x(), b() === `
` && x(), ``;
			case `1`:
			case `2`:
			case `3`:
			case `4`:
			case `5`:
			case `6`:
			case `7`:
			case `8`:
			case `9`: throw j(x());
			case void 0: throw j(x());
		}
		return x();
	}
	function E() {
		let e = ``, t = b();
		if (!r.isHexDigit(t) || (e += x(), t = b(), !r.isHexDigit(t))) throw j(x());
		return e += x(), String.fromCodePoint(parseInt(e, 16));
	}
	function D() {
		let e = ``, t = 4;
		for (; t-- > 0;) {
			let t = b();
			if (!r.isHexDigit(t)) throw j(x());
			e += x();
		}
		return String.fromCodePoint(parseInt(e, 16));
	}
	let O = {
		start() {
			if (u.type === `eof`) throw M();
			k();
		},
		beforePropertyName() {
			switch (u.type) {
				case `identifier`:
				case `string`:
					d = u.value, a = `afterPropertyName`;
					return;
				case `punctuator`:
					A();
					return;
				case `eof`: throw M();
			}
		},
		afterPropertyName() {
			if (u.type === `eof`) throw M();
			a = `beforePropertyValue`;
		},
		beforePropertyValue() {
			if (u.type === `eof`) throw M();
			k();
		},
		beforeArrayValue() {
			if (u.type === `eof`) throw M();
			if (u.type === `punctuator` && u.value === `]`) {
				A();
				return;
			}
			k();
		},
		afterPropertyValue() {
			if (u.type === `eof`) throw M();
			switch (u.value) {
				case `,`:
					a = `beforePropertyName`;
					return;
				case `}`: A();
			}
		},
		afterArrayValue() {
			if (u.type === `eof`) throw M();
			switch (u.value) {
				case `,`:
					a = `beforeArrayValue`;
					return;
				case `]`: A();
			}
		},
		end() {}
	};
	function k() {
		let e;
		switch (u.type) {
			case `punctuator`:
				switch (u.value) {
					case `{`:
						e = {};
						break;
					case `[`:
						e = [];
						break;
				}
				break;
			case `null`:
			case `boolean`:
			case `numeric`:
			case `string`:
				e = u.value;
				break;
		}
		if (f === void 0) f = e;
		else {
			let t = o[o.length - 1];
			Array.isArray(t) ? t.push(e) : Object.defineProperty(t, d, {
				value: e,
				writable: !0,
				enumerable: !0,
				configurable: !0
			});
		}
		if (typeof e == `object` && e) o.push(e), a = Array.isArray(e) ? `beforeArrayValue` : `beforePropertyName`;
		else {
			let e = o[o.length - 1];
			a = e == null ? `end` : Array.isArray(e) ? `afterArrayValue` : `afterPropertyValue`;
		}
	}
	function A() {
		o.pop();
		let e = o[o.length - 1];
		a = e == null ? `end` : Array.isArray(e) ? `afterArrayValue` : `afterPropertyValue`;
	}
	function j(e) {
		return I(e === void 0 ? `JSON5: invalid end of input at ${c}:${l}` : `JSON5: invalid character '${F(e)}' at ${c}:${l}`);
	}
	function M() {
		return I(`JSON5: invalid end of input at ${c}:${l}`);
	}
	function N() {
		return l -= 5, I(`JSON5: invalid identifier character at ${c}:${l}`);
	}
	function P(e) {
		console.warn(`JSON5: '${F(e)}' in strings is not valid ECMAScript; consider escaping`);
	}
	function F(e) {
		let t = {
			"'": `\\'`,
			"\"": `\\"`,
			"\\": `\\\\`,
			"\b": `\\b`,
			"\f": `\\f`,
			"\n": `\\n`,
			"\r": `\\r`,
			"	": `\\t`,
			"\v": `\\v`,
			"\0": `\\0`,
			"\u2028": `\\u2028`,
			"\u2029": `\\u2029`
		};
		if (t[e]) return t[e];
		if (e < ` `) {
			let t = e.charCodeAt(0).toString(16);
			return `\\x` + (`00` + t).substring(t.length);
		}
		return e;
	}
	function I(e) {
		let t = SyntaxError(e);
		return t.lineNumber = c, t.columnNumber = l, t;
	}
})), i$4 = o$4(((e, t) => {
	let r = n$2();
	t.exports = function(e, t, n) {
		let i = [], a = ``, o, s, c = ``, l;
		if (typeof t == `object` && t && !Array.isArray(t) && (n = t.space, l = t.quote, t = t.replacer), typeof t == `function`) s = t;
		else if (Array.isArray(t)) {
			o = [];
			for (let e of t) {
				let t;
				typeof e == `string` ? t = e : (typeof e == `number` || e instanceof String || e instanceof Number) && (t = String(e)), t !== void 0 && o.indexOf(t) < 0 && o.push(t);
			}
		}
		return n instanceof Number ? n = Number(n) : n instanceof String && (n = String(n)), typeof n == `number` ? n > 0 && (n = Math.min(10, Math.floor(n)), c = `          `.substr(0, n)) : typeof n == `string` && (c = n.substr(0, 10)), u(``, { "": e });
		function u(e, t) {
			let n = t[e];
			switch (n != null && (typeof n.toJSON5 == `function` ? n = n.toJSON5(e) : typeof n.toJSON == `function` && (n = n.toJSON(e))), s && (n = s.call(t, e, n)), n instanceof Number ? n = Number(n) : n instanceof String ? n = String(n) : n instanceof Boolean && (n = n.valueOf()), n) {
				case null: return `null`;
				case !0: return `true`;
				case !1: return `false`;
			}
			if (typeof n == `string`) return d(n, !1);
			if (typeof n == `number`) return String(n);
			if (typeof n == `object`) return Array.isArray(n) ? m(n) : f(n);
		}
		function d(e) {
			let t = {
				"'": .1,
				"\"": .2
			}, n = {
				"'": `\\'`,
				"\"": `\\"`,
				"\\": `\\\\`,
				"\b": `\\b`,
				"\f": `\\f`,
				"\n": `\\n`,
				"\r": `\\r`,
				"	": `\\t`,
				"\v": `\\v`,
				"\0": `\\0`,
				"\u2028": `\\u2028`,
				"\u2029": `\\u2029`
			}, i = ``;
			for (let a = 0; a < e.length; a++) {
				let o = e[a];
				switch (o) {
					case `'`:
					case `"`:
						t[o]++, i += o;
						continue;
					case `\0`: if (r.isDigit(e[a + 1])) {
						i += `\\x00`;
						continue;
					}
				}
				if (n[o]) {
					i += n[o];
					continue;
				}
				if (o < ` `) {
					let e = o.charCodeAt(0).toString(16);
					i += `\\x` + (`00` + e).substring(e.length);
					continue;
				}
				i += o;
			}
			let a = l || Object.keys(t).reduce((e, n) => t[e] < t[n] ? e : n);
			return i = i.replace(new RegExp(a, `g`), n[a]), a + i + a;
		}
		function f(e) {
			if (i.indexOf(e) >= 0) throw TypeError(`Converting circular structure to JSON5`);
			i.push(e);
			let t = a;
			a += c;
			let n = o || Object.keys(e), r = [];
			for (let t of n) {
				let n = u(t, e);
				if (n !== void 0) {
					let e = p(t) + `:`;
					c !== `` && (e += ` `), e += n, r.push(e);
				}
			}
			let s;
			if (r.length === 0) s = `{}`;
			else {
				let e;
				if (c === ``) e = r.join(`,`), s = `{` + e + `}`;
				else {
					let n = `,
` + a;
					e = r.join(n), s = `{
` + a + e + `,
` + t + `}`;
				}
			}
			return i.pop(), a = t, s;
		}
		function p(e) {
			if (e.length === 0) return d(e, !0);
			let t = String.fromCodePoint(e.codePointAt(0));
			if (!r.isIdStartChar(t)) return d(e, !0);
			for (let n = t.length; n < e.length; n++) if (!r.isIdContinueChar(String.fromCodePoint(e.codePointAt(n)))) return d(e, !0);
			return e;
		}
		function m(e) {
			if (i.indexOf(e) >= 0) throw TypeError(`Converting circular structure to JSON5`);
			i.push(e);
			let t = a;
			a += c;
			let n = [];
			for (let t = 0; t < e.length; t++) {
				let r = u(String(t), e);
				n.push(r === void 0 ? `null` : r);
			}
			let r;
			if (n.length === 0) r = `[]`;
			else if (c === ``) r = `[` + n.join(`,`) + `]`;
			else {
				let e = `,
` + a, i = n.join(e);
				r = `[
` + a + i + `,
` + t + `]`;
			}
			return i.pop(), a = t, r;
		}
	};
}));
var json5_exports = /* @__PURE__ */ __exportAll$1({ parseJSON5: () => s$3 }), a$3 = c$4(r$3(), 1);
c$4(i$4(), 1);
function s$3(e, n) {
	let r = (0, a$3.default)(e, n?.reviver);
	return a$4(e, r, n), r;
}
/*! js-yaml 4.1.1 https://github.com/nodeca/js-yaml @license MIT */
function e$2(e) {
	return e == null;
}
function t$1(e) {
	return typeof e == `object` && !!e;
}
function n$1(t) {
	return Array.isArray(t) ? t : e$2(t) ? [] : [t];
}
function r$2(e, t) {
	var n, r, i, a;
	if (t) for (a = Object.keys(t), n = 0, r = a.length; n < r; n += 1) i = a[n], e[i] = t[i];
	return e;
}
function i$3(e, t) {
	var n = ``, r;
	for (r = 0; r < t; r += 1) n += e;
	return n;
}
function a$2(e) {
	return e === 0 && 1 / e == -Infinity;
}
var o$2 = {
	isNothing: e$2,
	isObject: t$1,
	toArray: n$1,
	repeat: i$3,
	isNegativeZero: a$2,
	extend: r$2
};
function s$2(e, t) {
	var n = ``, r = e.reason || `(unknown reason)`;
	return e.mark ? (e.mark.name && (n += `in "` + e.mark.name + `" `), n += `(` + (e.mark.line + 1) + `:` + (e.mark.column + 1) + `)`, !t && e.mark.snippet && (n += `

` + e.mark.snippet), r + ` ` + n) : r;
}
function c$3(e, t) {
	Error.call(this), this.name = `YAMLException`, this.reason = e, this.mark = t, this.message = s$2(this, !1), Error.captureStackTrace ? Error.captureStackTrace(this, this.constructor) : this.stack = Error().stack || ``;
}
c$3.prototype = Object.create(Error.prototype), c$3.prototype.constructor = c$3, c$3.prototype.toString = function(e) {
	return this.name + `: ` + s$2(this, e);
};
var l$2 = c$3;
function u$2(e, t, n, r, i) {
	var a = ``, o = ``, s = Math.floor(i / 2) - 1;
	return r - t > s && (a = ` ... `, t = r - s + a.length), n - r > s && (o = ` ...`, n = r + s - o.length), {
		str: a + e.slice(t, n).replace(/\t/g, `→`) + o,
		pos: r - t + a.length
	};
}
function d$2(e, t) {
	return o$2.repeat(` `, t - e.length) + e;
}
function f$3(e, t) {
	if (t = Object.create(t || null), !e.buffer) return null;
	t.maxLength ||= 79, typeof t.indent != `number` && (t.indent = 1), typeof t.linesBefore != `number` && (t.linesBefore = 3), typeof t.linesAfter != `number` && (t.linesAfter = 2);
	for (var n = /\r?\n|\r|\0/g, r = [0], i = [], a, s = -1; a = n.exec(e.buffer);) i.push(a.index), r.push(a.index + a[0].length), e.position <= a.index && s < 0 && (s = r.length - 2);
	s < 0 && (s = r.length - 1);
	var c = ``, l, f, p = Math.min(e.line + t.linesAfter, i.length).toString().length, m = t.maxLength - (t.indent + p + 3);
	for (l = 1; l <= t.linesBefore && !(s - l < 0); l++) f = u$2(e.buffer, r[s - l], i[s - l], e.position - (r[s] - r[s - l]), m), c = o$2.repeat(` `, t.indent) + d$2((e.line - l + 1).toString(), p) + ` | ` + f.str + `
` + c;
	for (f = u$2(e.buffer, r[s], i[s], e.position, m), c += o$2.repeat(` `, t.indent) + d$2((e.line + 1).toString(), p) + ` | ` + f.str + `
`, c += o$2.repeat(`-`, t.indent + p + 3 + f.pos) + `^
`, l = 1; l <= t.linesAfter && !(s + l >= i.length); l++) f = u$2(e.buffer, r[s + l], i[s + l], e.position - (r[s] - r[s + l]), m), c += o$2.repeat(` `, t.indent) + d$2((e.line + l + 1).toString(), p) + ` | ` + f.str + `
`;
	return c.replace(/\n$/, ``);
}
var p$3 = f$3, m$2 = [
	`kind`,
	`multi`,
	`resolve`,
	`construct`,
	`instanceOf`,
	`predicate`,
	`represent`,
	`representName`,
	`defaultStyle`,
	`styleAliases`
], h$2 = [
	`scalar`,
	`sequence`,
	`mapping`
];
function g$2(e) {
	var t = {};
	return e !== null && Object.keys(e).forEach(function(n) {
		e[n].forEach(function(e) {
			t[String(e)] = n;
		});
	}), t;
}
function _$2(e, t) {
	if (t ||= {}, Object.keys(t).forEach(function(t) {
		if (m$2.indexOf(t) === -1) throw new l$2(`Unknown option "` + t + `" is met in definition of "` + e + `" YAML type.`);
	}), this.options = t, this.tag = e, this.kind = t.kind || null, this.resolve = t.resolve || function() {
		return !0;
	}, this.construct = t.construct || function(e) {
		return e;
	}, this.instanceOf = t.instanceOf || null, this.predicate = t.predicate || null, this.represent = t.represent || null, this.representName = t.representName || null, this.defaultStyle = t.defaultStyle || null, this.multi = t.multi || !1, this.styleAliases = g$2(t.styleAliases || null), h$2.indexOf(this.kind) === -1) throw new l$2(`Unknown kind "` + this.kind + `" is specified for "` + e + `" YAML type.`);
}
var v$2 = _$2;
function ee(e, t) {
	var n = [];
	return e[t].forEach(function(e) {
		var t = n.length;
		n.forEach(function(n, r) {
			n.tag === e.tag && n.kind === e.kind && n.multi === e.multi && (t = r);
		}), n[t] = e;
	}), n;
}
function te() {
	var e = {
		scalar: {},
		sequence: {},
		mapping: {},
		fallback: {},
		multi: {
			scalar: [],
			sequence: [],
			mapping: [],
			fallback: []
		}
	}, t, n;
	function r(t) {
		t.multi ? (e.multi[t.kind].push(t), e.multi.fallback.push(t)) : e[t.kind][t.tag] = e.fallback[t.tag] = t;
	}
	for (t = 0, n = arguments.length; t < n; t += 1) arguments[t].forEach(r);
	return e;
}
function y$2(e) {
	return this.extend(e);
}
y$2.prototype.extend = function(e) {
	var t = [], n = [];
	if (e instanceof v$2) n.push(e);
	else if (Array.isArray(e)) n = n.concat(e);
	else if (e && (Array.isArray(e.implicit) || Array.isArray(e.explicit))) e.implicit && (t = t.concat(e.implicit)), e.explicit && (n = n.concat(e.explicit));
	else throw new l$2(`Schema.extend argument should be a Type, [ Type ], or a schema definition ({ implicit: [...], explicit: [...] })`);
	t.forEach(function(e) {
		if (!(e instanceof v$2)) throw new l$2(`Specified list of YAML types (or a single Type object) contains a non-Type object.`);
		if (e.loadKind && e.loadKind !== `scalar`) throw new l$2(`There is a non-scalar type in the implicit list of a schema. Implicit resolving of such types is not supported.`);
		if (e.multi) throw new l$2(`There is a multi type in the implicit list of a schema. Multi tags can only be listed as explicit.`);
	}), n.forEach(function(e) {
		if (!(e instanceof v$2)) throw new l$2(`Specified list of YAML types (or a single Type object) contains a non-Type object.`);
	});
	var r = Object.create(y$2.prototype);
	return r.implicit = (this.implicit || []).concat(t), r.explicit = (this.explicit || []).concat(n), r.compiledImplicit = ee(r, `implicit`), r.compiledExplicit = ee(r, `explicit`), r.compiledTypeMap = te(r.compiledImplicit, r.compiledExplicit), r;
};
var ne = new y$2({ explicit: [
	new v$2(`tag:yaml.org,2002:str`, {
		kind: `scalar`,
		construct: function(e) {
			return e === null ? `` : e;
		}
	}),
	new v$2(`tag:yaml.org,2002:seq`, {
		kind: `sequence`,
		construct: function(e) {
			return e === null ? [] : e;
		}
	}),
	new v$2(`tag:yaml.org,2002:map`, {
		kind: `mapping`,
		construct: function(e) {
			return e === null ? {} : e;
		}
	})
] });
function re(e) {
	if (e === null) return !0;
	var t = e.length;
	return t === 1 && e === `~` || t === 4 && (e === `null` || e === `Null` || e === `NULL`);
}
function ie() {
	return null;
}
function ae(e) {
	return e === null;
}
var oe = new v$2(`tag:yaml.org,2002:null`, {
	kind: `scalar`,
	resolve: re,
	construct: ie,
	predicate: ae,
	represent: {
		canonical: function() {
			return `~`;
		},
		lowercase: function() {
			return `null`;
		},
		uppercase: function() {
			return `NULL`;
		},
		camelcase: function() {
			return `Null`;
		},
		empty: function() {
			return ``;
		}
	},
	defaultStyle: `lowercase`
});
function se(e) {
	if (e === null) return !1;
	var t = e.length;
	return t === 4 && (e === `true` || e === `True` || e === `TRUE`) || t === 5 && (e === `false` || e === `False` || e === `FALSE`);
}
function ce(e) {
	return e === `true` || e === `True` || e === `TRUE`;
}
function le(e) {
	return Object.prototype.toString.call(e) === `[object Boolean]`;
}
var ue = new v$2(`tag:yaml.org,2002:bool`, {
	kind: `scalar`,
	resolve: se,
	construct: ce,
	predicate: le,
	represent: {
		lowercase: function(e) {
			return e ? `true` : `false`;
		},
		uppercase: function(e) {
			return e ? `TRUE` : `FALSE`;
		},
		camelcase: function(e) {
			return e ? `True` : `False`;
		}
	},
	defaultStyle: `lowercase`
});
function de(e) {
	return 48 <= e && e <= 57 || 65 <= e && e <= 70 || 97 <= e && e <= 102;
}
function fe(e) {
	return 48 <= e && e <= 55;
}
function pe(e) {
	return 48 <= e && e <= 57;
}
function me(e) {
	if (e === null) return !1;
	var t = e.length, n = 0, r = !1, i;
	if (!t) return !1;
	if (i = e[n], (i === `-` || i === `+`) && (i = e[++n]), i === `0`) {
		if (n + 1 === t) return !0;
		if (i = e[++n], i === `b`) {
			for (n++; n < t; n++) if (i = e[n], i !== `_`) {
				if (i !== `0` && i !== `1`) return !1;
				r = !0;
			}
			return r && i !== `_`;
		}
		if (i === `x`) {
			for (n++; n < t; n++) if (i = e[n], i !== `_`) {
				if (!de(e.charCodeAt(n))) return !1;
				r = !0;
			}
			return r && i !== `_`;
		}
		if (i === `o`) {
			for (n++; n < t; n++) if (i = e[n], i !== `_`) {
				if (!fe(e.charCodeAt(n))) return !1;
				r = !0;
			}
			return r && i !== `_`;
		}
	}
	if (i === `_`) return !1;
	for (; n < t; n++) if (i = e[n], i !== `_`) {
		if (!pe(e.charCodeAt(n))) return !1;
		r = !0;
	}
	return !(!r || i === `_`);
}
function he(e) {
	var t = e, n = 1, r;
	if (t.indexOf(`_`) !== -1 && (t = t.replace(/_/g, ``)), r = t[0], (r === `-` || r === `+`) && (r === `-` && (n = -1), t = t.slice(1), r = t[0]), t === `0`) return 0;
	if (r === `0`) {
		if (t[1] === `b`) return n * parseInt(t.slice(2), 2);
		if (t[1] === `x`) return n * parseInt(t.slice(2), 16);
		if (t[1] === `o`) return n * parseInt(t.slice(2), 8);
	}
	return n * parseInt(t, 10);
}
function ge(e) {
	return Object.prototype.toString.call(e) === `[object Number]` && e % 1 == 0 && !o$2.isNegativeZero(e);
}
var _e = new v$2(`tag:yaml.org,2002:int`, {
	kind: `scalar`,
	resolve: me,
	construct: he,
	predicate: ge,
	represent: {
		binary: function(e) {
			return e >= 0 ? `0b` + e.toString(2) : `-0b` + e.toString(2).slice(1);
		},
		octal: function(e) {
			return e >= 0 ? `0o` + e.toString(8) : `-0o` + e.toString(8).slice(1);
		},
		decimal: function(e) {
			return e.toString(10);
		},
		hexadecimal: function(e) {
			return e >= 0 ? `0x` + e.toString(16).toUpperCase() : `-0x` + e.toString(16).toUpperCase().slice(1);
		}
	},
	defaultStyle: `decimal`,
	styleAliases: {
		binary: [2, `bin`],
		octal: [8, `oct`],
		decimal: [10, `dec`],
		hexadecimal: [16, `hex`]
	}
}), ve = RegExp(`^(?:[-+]?(?:[0-9][0-9_]*)(?:\\.[0-9_]*)?(?:[eE][-+]?[0-9]+)?|\\.[0-9_]+(?:[eE][-+]?[0-9]+)?|[-+]?\\.(?:inf|Inf|INF)|\\.(?:nan|NaN|NAN))$`);
function ye(e) {
	return !(e === null || !ve.test(e) || e[e.length - 1] === `_`);
}
function be(e) {
	var t = e.replace(/_/g, ``).toLowerCase(), n = t[0] === `-` ? -1 : 1;
	return `+-`.indexOf(t[0]) >= 0 && (t = t.slice(1)), t === `.inf` ? n === 1 ? Infinity : -Infinity : t === `.nan` ? NaN : n * parseFloat(t, 10);
}
var xe = /^[-+]?[0-9]+e/;
function Se(e, t) {
	var n;
	if (isNaN(e)) switch (t) {
		case `lowercase`: return `.nan`;
		case `uppercase`: return `.NAN`;
		case `camelcase`: return `.NaN`;
	}
	else if (e === Infinity) switch (t) {
		case `lowercase`: return `.inf`;
		case `uppercase`: return `.INF`;
		case `camelcase`: return `.Inf`;
	}
	else if (e === -Infinity) switch (t) {
		case `lowercase`: return `-.inf`;
		case `uppercase`: return `-.INF`;
		case `camelcase`: return `-.Inf`;
	}
	else if (o$2.isNegativeZero(e)) return `-0.0`;
	return n = e.toString(10), xe.test(n) ? n.replace(`e`, `.e`) : n;
}
function Ce(e) {
	return Object.prototype.toString.call(e) === `[object Number]` && (e % 1 != 0 || o$2.isNegativeZero(e));
}
var we = new v$2(`tag:yaml.org,2002:float`, {
	kind: `scalar`,
	resolve: ye,
	construct: be,
	predicate: Ce,
	represent: Se,
	defaultStyle: `lowercase`
}), Te = ne.extend({ implicit: [
	oe,
	ue,
	_e,
	we
] }), Ee = RegExp(`^([0-9][0-9][0-9][0-9])-([0-9][0-9])-([0-9][0-9])$`), De = RegExp(`^([0-9][0-9][0-9][0-9])-([0-9][0-9]?)-([0-9][0-9]?)(?:[Tt]|[ \\t]+)([0-9][0-9]?):([0-9][0-9]):([0-9][0-9])(?:\\.([0-9]*))?(?:[ \\t]*(Z|([-+])([0-9][0-9]?)(?::([0-9][0-9]))?))?$`);
function Oe(e) {
	return e === null ? !1 : Ee.exec(e) !== null || De.exec(e) !== null;
}
function ke(e) {
	var t, n, r, i, a, o, s, c = 0, l = null, u, d, f;
	if (t = Ee.exec(e), t === null && (t = De.exec(e)), t === null) throw Error(`Date resolve error`);
	if (n = +t[1], r = t[2] - 1, i = +t[3], !t[4]) return new Date(Date.UTC(n, r, i));
	if (a = +t[4], o = +t[5], s = +t[6], t[7]) {
		for (c = t[7].slice(0, 3); c.length < 3;) c += `0`;
		c = +c;
	}
	return t[9] && (u = +t[10], d = +(t[11] || 0), l = (u * 60 + d) * 6e4, t[9] === `-` && (l = -l)), f = new Date(Date.UTC(n, r, i, a, o, s, c)), l && f.setTime(f.getTime() - l), f;
}
function Ae(e) {
	return e.toISOString();
}
var je = new v$2(`tag:yaml.org,2002:timestamp`, {
	kind: `scalar`,
	resolve: Oe,
	construct: ke,
	instanceOf: Date,
	represent: Ae
});
function Me(e) {
	return e === `<<` || e === null;
}
var Ne = new v$2(`tag:yaml.org,2002:merge`, {
	kind: `scalar`,
	resolve: Me
}), b$3 = `ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=
\r`;
function Pe(e) {
	if (e === null) return !1;
	var t, n, r = 0, i = e.length, a = b$3;
	for (n = 0; n < i; n++) if (t = a.indexOf(e.charAt(n)), !(t > 64)) {
		if (t < 0) return !1;
		r += 6;
	}
	return r % 8 == 0;
}
function Fe(e) {
	var t, n, r = e.replace(/[\r\n=]/g, ``), i = r.length, a = b$3, o = 0, s = [];
	for (t = 0; t < i; t++) t % 4 == 0 && t && (s.push(o >> 16 & 255), s.push(o >> 8 & 255), s.push(o & 255)), o = o << 6 | a.indexOf(r.charAt(t));
	return n = i % 4 * 6, n === 0 ? (s.push(o >> 16 & 255), s.push(o >> 8 & 255), s.push(o & 255)) : n === 18 ? (s.push(o >> 10 & 255), s.push(o >> 2 & 255)) : n === 12 && s.push(o >> 4 & 255), new Uint8Array(s);
}
function Ie(e) {
	var t = ``, n = 0, r, i, a = e.length, o = b$3;
	for (r = 0; r < a; r++) r % 3 == 0 && r && (t += o[n >> 18 & 63], t += o[n >> 12 & 63], t += o[n >> 6 & 63], t += o[n & 63]), n = (n << 8) + e[r];
	return i = a % 3, i === 0 ? (t += o[n >> 18 & 63], t += o[n >> 12 & 63], t += o[n >> 6 & 63], t += o[n & 63]) : i === 2 ? (t += o[n >> 10 & 63], t += o[n >> 4 & 63], t += o[n << 2 & 63], t += o[64]) : i === 1 && (t += o[n >> 2 & 63], t += o[n << 4 & 63], t += o[64], t += o[64]), t;
}
function Le(e) {
	return Object.prototype.toString.call(e) === `[object Uint8Array]`;
}
var Re = new v$2(`tag:yaml.org,2002:binary`, {
	kind: `scalar`,
	resolve: Pe,
	construct: Fe,
	predicate: Le,
	represent: Ie
}), ze = Object.prototype.hasOwnProperty, Be = Object.prototype.toString;
function Ve(e) {
	if (e === null) return !0;
	var t = [], n, r, i, a, o, s = e;
	for (n = 0, r = s.length; n < r; n += 1) {
		if (i = s[n], o = !1, Be.call(i) !== `[object Object]`) return !1;
		for (a in i) if (ze.call(i, a)) if (!o) o = !0;
		else return !1;
		if (!o) return !1;
		if (t.indexOf(a) === -1) t.push(a);
		else return !1;
	}
	return !0;
}
function He(e) {
	return e === null ? [] : e;
}
var Ue = new v$2(`tag:yaml.org,2002:omap`, {
	kind: `sequence`,
	resolve: Ve,
	construct: He
}), We = Object.prototype.toString;
function Ge(e) {
	if (e === null) return !0;
	var t, n, r, i, a, o = e;
	for (a = Array(o.length), t = 0, n = o.length; t < n; t += 1) {
		if (r = o[t], We.call(r) !== `[object Object]` || (i = Object.keys(r), i.length !== 1)) return !1;
		a[t] = [i[0], r[i[0]]];
	}
	return !0;
}
function Ke(e) {
	if (e === null) return [];
	var t, n, r, i, a, o = e;
	for (a = Array(o.length), t = 0, n = o.length; t < n; t += 1) r = o[t], i = Object.keys(r), a[t] = [i[0], r[i[0]]];
	return a;
}
var qe = new v$2(`tag:yaml.org,2002:pairs`, {
	kind: `sequence`,
	resolve: Ge,
	construct: Ke
}), Je = Object.prototype.hasOwnProperty;
function Ye(e) {
	if (e === null) return !0;
	var t, n = e;
	for (t in n) if (Je.call(n, t) && n[t] !== null) return !1;
	return !0;
}
function Xe(e) {
	return e === null ? {} : e;
}
var Ze = new v$2(`tag:yaml.org,2002:set`, {
	kind: `mapping`,
	resolve: Ye,
	construct: Xe
}), Qe = Te.extend({
	implicit: [je, Ne],
	explicit: [
		Re,
		Ue,
		qe,
		Ze
	]
}), x$3 = Object.prototype.hasOwnProperty, S$3 = 1, $e = 2, et = 3, C$2 = 4, w$2 = 1, tt = 2, nt = 3, rt = /[\x00-\x08\x0B\x0C\x0E-\x1F\x7F-\x84\x86-\x9F\uFFFE\uFFFF]|[\uD800-\uDBFF](?![\uDC00-\uDFFF])|(?:[^\uD800-\uDBFF]|^)[\uDC00-\uDFFF]/, it = /[\x85\u2028\u2029]/, at = /[,\[\]\{\}]/, ot = /^(?:!|!!|![a-z\-]+!)$/i, st = /^(?:!|[^,\[\]\{\}])(?:%[0-9a-f]{2}|[0-9a-z\-#;\/\?:@&=\+\$,_\.!~\*'\(\)\[\]])*$/i;
function ct(e) {
	return Object.prototype.toString.call(e);
}
function T$3(e) {
	return e === 10 || e === 13;
}
function E$1(e) {
	return e === 9 || e === 32;
}
function D$2(e) {
	return e === 9 || e === 32 || e === 10 || e === 13;
}
function O$2(e) {
	return e === 44 || e === 91 || e === 93 || e === 123 || e === 125;
}
function lt(e) {
	var t;
	return 48 <= e && e <= 57 ? e - 48 : (t = e | 32, 97 <= t && t <= 102 ? t - 97 + 10 : -1);
}
function ut(e) {
	return e === 120 ? 2 : e === 117 ? 4 : e === 85 ? 8 : 0;
}
function dt(e) {
	return 48 <= e && e <= 57 ? e - 48 : -1;
}
function ft(e) {
	return e === 48 ? `\0` : e === 97 ? `\x07` : e === 98 ? `\b` : e === 116 || e === 9 ? `	` : e === 110 ? `
` : e === 118 ? `\v` : e === 102 ? `\f` : e === 114 ? `\r` : e === 101 ? `\x1B` : e === 32 ? ` ` : e === 34 ? `"` : e === 47 ? `/` : e === 92 ? `\\` : e === 78 ? `` : e === 95 ? `\xA0` : e === 76 ? `\u2028` : e === 80 ? `\u2029` : ``;
}
function pt(e) {
	return e <= 65535 ? String.fromCharCode(e) : String.fromCharCode((e - 65536 >> 10) + 55296, (e - 65536 & 1023) + 56320);
}
function mt(e, t, n) {
	t === `__proto__` ? Object.defineProperty(e, t, {
		configurable: !0,
		enumerable: !0,
		writable: !0,
		value: n
	}) : e[t] = n;
}
for (var ht = Array(256), gt = Array(256), k$1 = 0; k$1 < 256; k$1++) ht[k$1] = ft(k$1) ? 1 : 0, gt[k$1] = ft(k$1);
function _t(e, t) {
	this.input = e, this.filename = t.filename || null, this.schema = t.schema || Qe, this.onWarning = t.onWarning || null, this.legacy = t.legacy || !1, this.json = t.json || !1, this.listener = t.listener || null, this.implicitTypes = this.schema.compiledImplicit, this.typeMap = this.schema.compiledTypeMap, this.length = e.length, this.position = 0, this.line = 0, this.lineStart = 0, this.lineIndent = 0, this.firstTabInLine = -1, this.documents = [];
}
function vt(e, t) {
	var n = {
		name: e.filename,
		buffer: e.input.slice(0, -1),
		position: e.position,
		line: e.line,
		column: e.position - e.lineStart
	};
	return n.snippet = p$3(n), new l$2(t, n);
}
function A$1(e, t) {
	throw vt(e, t);
}
function j$1(e, t) {
	e.onWarning && e.onWarning.call(null, vt(e, t));
}
var yt = {
	YAML: function(e, t, n) {
		var r, i, a;
		e.version !== null && A$1(e, `duplication of %YAML directive`), n.length !== 1 && A$1(e, `YAML directive accepts exactly one argument`), r = /^([0-9]+)\.([0-9]+)$/.exec(n[0]), r === null && A$1(e, `ill-formed argument of the YAML directive`), i = parseInt(r[1], 10), a = parseInt(r[2], 10), i !== 1 && A$1(e, `unacceptable YAML version of the document`), e.version = n[0], e.checkLineBreaks = a < 2, a !== 1 && a !== 2 && j$1(e, `unsupported YAML version of the document`);
	},
	TAG: function(e, t, n) {
		var r, i;
		n.length !== 2 && A$1(e, `TAG directive accepts exactly two arguments`), r = n[0], i = n[1], ot.test(r) || A$1(e, `ill-formed tag handle (first argument) of the TAG directive`), x$3.call(e.tagMap, r) && A$1(e, `there is a previously declared suffix for "` + r + `" tag handle`), st.test(i) || A$1(e, `ill-formed tag prefix (second argument) of the TAG directive`);
		try {
			i = decodeURIComponent(i);
		} catch {
			A$1(e, `tag prefix is malformed: ` + i);
		}
		e.tagMap[r] = i;
	}
};
function M$2(e, t, n, r) {
	var i, a, o, s;
	if (t < n) {
		if (s = e.input.slice(t, n), r) for (i = 0, a = s.length; i < a; i += 1) o = s.charCodeAt(i), o === 9 || 32 <= o && o <= 1114111 || A$1(e, `expected valid JSON character`);
		else rt.test(s) && A$1(e, `the stream contains non-printable characters`);
		e.result += s;
	}
}
function bt(e, t, n, r) {
	var i, a, s, c;
	for (o$2.isObject(n) || A$1(e, `cannot merge mappings; the provided source object is unacceptable`), i = Object.keys(n), s = 0, c = i.length; s < c; s += 1) a = i[s], x$3.call(t, a) || (mt(t, a, n[a]), r[a] = !0);
}
function N$1(e, t, n, r, i, a, o, s, c) {
	var l, u;
	if (Array.isArray(i)) for (i = Array.prototype.slice.call(i), l = 0, u = i.length; l < u; l += 1) Array.isArray(i[l]) && A$1(e, `nested arrays are not supported inside keys`), typeof i == `object` && ct(i[l]) === `[object Object]` && (i[l] = `[object Object]`);
	if (typeof i == `object` && ct(i) === `[object Object]` && (i = `[object Object]`), i = String(i), t === null && (t = {}), r === `tag:yaml.org,2002:merge`) if (Array.isArray(a)) for (l = 0, u = a.length; l < u; l += 1) bt(e, t, a[l], n);
	else bt(e, t, a, n);
	else !e.json && !x$3.call(n, i) && x$3.call(t, i) && (e.line = o || e.line, e.lineStart = s || e.lineStart, e.position = c || e.position, A$1(e, `duplicated mapping key`)), mt(t, i, a), delete n[i];
	return t;
}
function P$2(e) {
	var t = e.input.charCodeAt(e.position);
	t === 10 ? e.position++ : t === 13 ? (e.position++, e.input.charCodeAt(e.position) === 10 && e.position++) : A$1(e, `a line break is expected`), e.line += 1, e.lineStart = e.position, e.firstTabInLine = -1;
}
function F$1(e, t, n) {
	for (var r = 0, i = e.input.charCodeAt(e.position); i !== 0;) {
		for (; E$1(i);) i === 9 && e.firstTabInLine === -1 && (e.firstTabInLine = e.position), i = e.input.charCodeAt(++e.position);
		if (t && i === 35) do
			i = e.input.charCodeAt(++e.position);
		while (i !== 10 && i !== 13 && i !== 0);
		if (T$3(i)) for (P$2(e), i = e.input.charCodeAt(e.position), r++, e.lineIndent = 0; i === 32;) e.lineIndent++, i = e.input.charCodeAt(++e.position);
		else break;
	}
	return n !== -1 && r !== 0 && e.lineIndent < n && j$1(e, `deficient indentation`), r;
}
function I$2(e) {
	var t = e.position, n = e.input.charCodeAt(t);
	return !!((n === 45 || n === 46) && n === e.input.charCodeAt(t + 1) && n === e.input.charCodeAt(t + 2) && (t += 3, n = e.input.charCodeAt(t), n === 0 || D$2(n)));
}
function L(e, t) {
	t === 1 ? e.result += ` ` : t > 1 && (e.result += o$2.repeat(`
`, t - 1));
}
function xt(e, t, n) {
	var r, i, a, o, s, c, l, u, d = e.kind, f = e.result, p = e.input.charCodeAt(e.position);
	if (D$2(p) || O$2(p) || p === 35 || p === 38 || p === 42 || p === 33 || p === 124 || p === 62 || p === 39 || p === 34 || p === 37 || p === 64 || p === 96 || (p === 63 || p === 45) && (i = e.input.charCodeAt(e.position + 1), D$2(i) || n && O$2(i))) return !1;
	for (e.kind = `scalar`, e.result = ``, a = o = e.position, s = !1; p !== 0;) {
		if (p === 58) {
			if (i = e.input.charCodeAt(e.position + 1), D$2(i) || n && O$2(i)) break;
		} else if (p === 35) {
			if (r = e.input.charCodeAt(e.position - 1), D$2(r)) break;
		} else if (e.position === e.lineStart && I$2(e) || n && O$2(p)) break;
		else if (T$3(p)) if (c = e.line, l = e.lineStart, u = e.lineIndent, F$1(e, !1, -1), e.lineIndent >= t) {
			s = !0, p = e.input.charCodeAt(e.position);
			continue;
		} else {
			e.position = o, e.line = c, e.lineStart = l, e.lineIndent = u;
			break;
		}
		s &&= (M$2(e, a, o, !1), L(e, e.line - c), a = o = e.position, !1), E$1(p) || (o = e.position + 1), p = e.input.charCodeAt(++e.position);
	}
	return M$2(e, a, o, !1), e.result ? !0 : (e.kind = d, e.result = f, !1);
}
function St(e, t) {
	var n = e.input.charCodeAt(e.position), r, i;
	if (n !== 39) return !1;
	for (e.kind = `scalar`, e.result = ``, e.position++, r = i = e.position; (n = e.input.charCodeAt(e.position)) !== 0;) if (n === 39) if (M$2(e, r, e.position, !0), n = e.input.charCodeAt(++e.position), n === 39) r = e.position, e.position++, i = e.position;
	else return !0;
	else T$3(n) ? (M$2(e, r, i, !0), L(e, F$1(e, !1, t)), r = i = e.position) : e.position === e.lineStart && I$2(e) ? A$1(e, `unexpected end of the document within a single quoted scalar`) : (e.position++, i = e.position);
	A$1(e, `unexpected end of the stream within a single quoted scalar`);
}
function Ct(e, t) {
	var n, r, i, a, o, s = e.input.charCodeAt(e.position);
	if (s !== 34) return !1;
	for (e.kind = `scalar`, e.result = ``, e.position++, n = r = e.position; (s = e.input.charCodeAt(e.position)) !== 0;) if (s === 34) return M$2(e, n, e.position, !0), e.position++, !0;
	else if (s === 92) {
		if (M$2(e, n, e.position, !0), s = e.input.charCodeAt(++e.position), T$3(s)) F$1(e, !1, t);
		else if (s < 256 && ht[s]) e.result += gt[s], e.position++;
		else if ((o = ut(s)) > 0) {
			for (i = o, a = 0; i > 0; i--) s = e.input.charCodeAt(++e.position), (o = lt(s)) >= 0 ? a = (a << 4) + o : A$1(e, `expected hexadecimal character`);
			e.result += pt(a), e.position++;
		} else A$1(e, `unknown escape sequence`);
		n = r = e.position;
	} else T$3(s) ? (M$2(e, n, r, !0), L(e, F$1(e, !1, t)), n = r = e.position) : e.position === e.lineStart && I$2(e) ? A$1(e, `unexpected end of the document within a double quoted scalar`) : (e.position++, r = e.position);
	A$1(e, `unexpected end of the stream within a double quoted scalar`);
}
function wt(e, t) {
	var n = !0, r, i, a, o = e.tag, s, c = e.anchor, l, u, d, f, p, m = Object.create(null), h, g, _, v = e.input.charCodeAt(e.position);
	if (v === 91) u = 93, p = !1, s = [];
	else if (v === 123) u = 125, p = !0, s = {};
	else return !1;
	for (e.anchor !== null && (e.anchorMap[e.anchor] = s), v = e.input.charCodeAt(++e.position); v !== 0;) {
		if (F$1(e, !0, t), v = e.input.charCodeAt(e.position), v === u) return e.position++, e.tag = o, e.anchor = c, e.kind = p ? `mapping` : `sequence`, e.result = s, !0;
		n ? v === 44 && A$1(e, `expected the node content, but found ','`) : A$1(e, `missed comma between flow collection entries`), g = h = _ = null, d = f = !1, v === 63 && (l = e.input.charCodeAt(e.position + 1), D$2(l) && (d = f = !0, e.position++, F$1(e, !0, t))), r = e.line, i = e.lineStart, a = e.position, R$1(e, t, S$3, !1, !0), g = e.tag, h = e.result, F$1(e, !0, t), v = e.input.charCodeAt(e.position), (f || e.line === r) && v === 58 && (d = !0, v = e.input.charCodeAt(++e.position), F$1(e, !0, t), R$1(e, t, S$3, !1, !0), _ = e.result), p ? N$1(e, s, m, g, h, _, r, i, a) : d ? s.push(N$1(e, null, m, g, h, _, r, i, a)) : s.push(h), F$1(e, !0, t), v = e.input.charCodeAt(e.position), v === 44 ? (n = !0, v = e.input.charCodeAt(++e.position)) : n = !1;
	}
	A$1(e, `unexpected end of the stream within a flow collection`);
}
function Tt(e, t) {
	var n, r, i = w$2, a = !1, s = !1, c = t, l = 0, u = !1, d, f = e.input.charCodeAt(e.position);
	if (f === 124) r = !1;
	else if (f === 62) r = !0;
	else return !1;
	for (e.kind = `scalar`, e.result = ``; f !== 0;) if (f = e.input.charCodeAt(++e.position), f === 43 || f === 45) w$2 === i ? i = f === 43 ? nt : tt : A$1(e, `repeat of a chomping mode identifier`);
	else if ((d = dt(f)) >= 0) d === 0 ? A$1(e, `bad explicit indentation width of a block scalar; it cannot be less than one`) : s ? A$1(e, `repeat of an indentation width identifier`) : (c = t + d - 1, s = !0);
	else break;
	if (E$1(f)) {
		do
			f = e.input.charCodeAt(++e.position);
		while (E$1(f));
		if (f === 35) do
			f = e.input.charCodeAt(++e.position);
		while (!T$3(f) && f !== 0);
	}
	for (; f !== 0;) {
		for (P$2(e), e.lineIndent = 0, f = e.input.charCodeAt(e.position); (!s || e.lineIndent < c) && f === 32;) e.lineIndent++, f = e.input.charCodeAt(++e.position);
		if (!s && e.lineIndent > c && (c = e.lineIndent), T$3(f)) {
			l++;
			continue;
		}
		if (e.lineIndent < c) {
			i === nt ? e.result += o$2.repeat(`
`, a ? 1 + l : l) : i === w$2 && a && (e.result += `
`);
			break;
		}
		for (r ? E$1(f) ? (u = !0, e.result += o$2.repeat(`
`, a ? 1 + l : l)) : u ? (u = !1, e.result += o$2.repeat(`
`, l + 1)) : l === 0 ? a && (e.result += ` `) : e.result += o$2.repeat(`
`, l) : e.result += o$2.repeat(`
`, a ? 1 + l : l), a = !0, s = !0, l = 0, n = e.position; !T$3(f) && f !== 0;) f = e.input.charCodeAt(++e.position);
		M$2(e, n, e.position, !1);
	}
	return !0;
}
function Et(e, t) {
	var n, r = e.tag, i = e.anchor, a = [], o, s = !1, c;
	if (e.firstTabInLine !== -1) return !1;
	for (e.anchor !== null && (e.anchorMap[e.anchor] = a), c = e.input.charCodeAt(e.position); c !== 0 && (e.firstTabInLine !== -1 && (e.position = e.firstTabInLine, A$1(e, `tab characters must not be used in indentation`)), !(c !== 45 || (o = e.input.charCodeAt(e.position + 1), !D$2(o))));) {
		if (s = !0, e.position++, F$1(e, !0, -1) && e.lineIndent <= t) {
			a.push(null), c = e.input.charCodeAt(e.position);
			continue;
		}
		if (n = e.line, R$1(e, t, et, !1, !0), a.push(e.result), F$1(e, !0, -1), c = e.input.charCodeAt(e.position), (e.line === n || e.lineIndent > t) && c !== 0) A$1(e, `bad indentation of a sequence entry`);
		else if (e.lineIndent < t) break;
	}
	return s ? (e.tag = r, e.anchor = i, e.kind = `sequence`, e.result = a, !0) : !1;
}
function Dt(e, t, n) {
	var r, i, a, o, s, c, l = e.tag, u = e.anchor, d = {}, f = Object.create(null), p = null, m = null, h = null, g = !1, _ = !1, v;
	if (e.firstTabInLine !== -1) return !1;
	for (e.anchor !== null && (e.anchorMap[e.anchor] = d), v = e.input.charCodeAt(e.position); v !== 0;) {
		if (!g && e.firstTabInLine !== -1 && (e.position = e.firstTabInLine, A$1(e, `tab characters must not be used in indentation`)), r = e.input.charCodeAt(e.position + 1), a = e.line, (v === 63 || v === 58) && D$2(r)) v === 63 ? (g && (N$1(e, d, f, p, m, null, o, s, c), p = m = h = null), _ = !0, g = !0, i = !0) : g ? (g = !1, i = !0) : A$1(e, `incomplete explicit mapping pair; a key node is missed; or followed by a non-tabulated empty line`), e.position += 1, v = r;
		else {
			if (o = e.line, s = e.lineStart, c = e.position, !R$1(e, n, $e, !1, !0)) break;
			if (e.line === a) {
				for (v = e.input.charCodeAt(e.position); E$1(v);) v = e.input.charCodeAt(++e.position);
				if (v === 58) v = e.input.charCodeAt(++e.position), D$2(v) || A$1(e, `a whitespace character is expected after the key-value separator within a block mapping`), g && (N$1(e, d, f, p, m, null, o, s, c), p = m = h = null), _ = !0, g = !1, i = !1, p = e.tag, m = e.result;
				else if (_) A$1(e, `can not read an implicit mapping pair; a colon is missed`);
				else return e.tag = l, e.anchor = u, !0;
			} else if (_) A$1(e, `can not read a block mapping entry; a multiline key may not be an implicit key`);
			else return e.tag = l, e.anchor = u, !0;
		}
		if ((e.line === a || e.lineIndent > t) && (g && (o = e.line, s = e.lineStart, c = e.position), R$1(e, t, C$2, !0, i) && (g ? m = e.result : h = e.result), g || (N$1(e, d, f, p, m, h, o, s, c), p = m = h = null), F$1(e, !0, -1), v = e.input.charCodeAt(e.position)), (e.line === a || e.lineIndent > t) && v !== 0) A$1(e, `bad indentation of a mapping entry`);
		else if (e.lineIndent < t) break;
	}
	return g && N$1(e, d, f, p, m, null, o, s, c), _ && (e.tag = l, e.anchor = u, e.kind = `mapping`, e.result = d), _;
}
function Ot(e) {
	var t, n = !1, r = !1, i, a, o = e.input.charCodeAt(e.position);
	if (o !== 33) return !1;
	if (e.tag !== null && A$1(e, `duplication of a tag property`), o = e.input.charCodeAt(++e.position), o === 60 ? (n = !0, o = e.input.charCodeAt(++e.position)) : o === 33 ? (r = !0, i = `!!`, o = e.input.charCodeAt(++e.position)) : i = `!`, t = e.position, n) {
		do
			o = e.input.charCodeAt(++e.position);
		while (o !== 0 && o !== 62);
		e.position < e.length ? (a = e.input.slice(t, e.position), o = e.input.charCodeAt(++e.position)) : A$1(e, `unexpected end of the stream within a verbatim tag`);
	} else {
		for (; o !== 0 && !D$2(o);) o === 33 && (r ? A$1(e, `tag suffix cannot contain exclamation marks`) : (i = e.input.slice(t - 1, e.position + 1), ot.test(i) || A$1(e, `named tag handle cannot contain such characters`), r = !0, t = e.position + 1)), o = e.input.charCodeAt(++e.position);
		a = e.input.slice(t, e.position), at.test(a) && A$1(e, `tag suffix cannot contain flow indicator characters`);
	}
	a && !st.test(a) && A$1(e, `tag name cannot contain such characters: ` + a);
	try {
		a = decodeURIComponent(a);
	} catch {
		A$1(e, `tag name is malformed: ` + a);
	}
	return n ? e.tag = a : x$3.call(e.tagMap, i) ? e.tag = e.tagMap[i] + a : i === `!` ? e.tag = `!` + a : i === `!!` ? e.tag = `tag:yaml.org,2002:` + a : A$1(e, `undeclared tag handle "` + i + `"`), !0;
}
function kt(e) {
	var t, n = e.input.charCodeAt(e.position);
	if (n !== 38) return !1;
	for (e.anchor !== null && A$1(e, `duplication of an anchor property`), n = e.input.charCodeAt(++e.position), t = e.position; n !== 0 && !D$2(n) && !O$2(n);) n = e.input.charCodeAt(++e.position);
	return e.position === t && A$1(e, `name of an anchor node must contain at least one character`), e.anchor = e.input.slice(t, e.position), !0;
}
function At(e) {
	var t, n, r = e.input.charCodeAt(e.position);
	if (r !== 42) return !1;
	for (r = e.input.charCodeAt(++e.position), t = e.position; r !== 0 && !D$2(r) && !O$2(r);) r = e.input.charCodeAt(++e.position);
	return e.position === t && A$1(e, `name of an alias node must contain at least one character`), n = e.input.slice(t, e.position), x$3.call(e.anchorMap, n) || A$1(e, `unidentified alias "` + n + `"`), e.result = e.anchorMap[n], F$1(e, !0, -1), !0;
}
function R$1(e, t, n, r, i) {
	var a, o, s, c = 1, l = !1, u = !1, d, f, p, m, h, g;
	if (e.listener !== null && e.listener(`open`, e), e.tag = null, e.anchor = null, e.kind = null, e.result = null, a = o = s = C$2 === n || et === n, r && F$1(e, !0, -1) && (l = !0, e.lineIndent > t ? c = 1 : e.lineIndent === t ? c = 0 : e.lineIndent < t && (c = -1)), c === 1) for (; Ot(e) || kt(e);) F$1(e, !0, -1) ? (l = !0, s = a, e.lineIndent > t ? c = 1 : e.lineIndent === t ? c = 0 : e.lineIndent < t && (c = -1)) : s = !1;
	if (s &&= l || i, (c === 1 || C$2 === n) && (h = S$3 === n || $e === n ? t : t + 1, g = e.position - e.lineStart, c === 1 ? s && (Et(e, g) || Dt(e, g, h)) || wt(e, h) ? u = !0 : (o && Tt(e, h) || St(e, h) || Ct(e, h) ? u = !0 : At(e) ? (u = !0, (e.tag !== null || e.anchor !== null) && A$1(e, `alias node should not have any properties`)) : xt(e, h, S$3 === n) && (u = !0, e.tag === null && (e.tag = `?`)), e.anchor !== null && (e.anchorMap[e.anchor] = e.result)) : c === 0 && (u = s && Et(e, g))), e.tag === null) e.anchor !== null && (e.anchorMap[e.anchor] = e.result);
	else if (e.tag === `?`) {
		for (e.result !== null && e.kind !== `scalar` && A$1(e, `unacceptable node kind for !<?> tag; it should be "scalar", not "` + e.kind + `"`), d = 0, f = e.implicitTypes.length; d < f; d += 1) if (m = e.implicitTypes[d], m.resolve(e.result)) {
			e.result = m.construct(e.result), e.tag = m.tag, e.anchor !== null && (e.anchorMap[e.anchor] = e.result);
			break;
		}
	} else if (e.tag !== `!`) {
		if (x$3.call(e.typeMap[e.kind || `fallback`], e.tag)) m = e.typeMap[e.kind || `fallback`][e.tag];
		else for (m = null, p = e.typeMap.multi[e.kind || `fallback`], d = 0, f = p.length; d < f; d += 1) if (e.tag.slice(0, p[d].tag.length) === p[d].tag) {
			m = p[d];
			break;
		}
		m || A$1(e, `unknown tag !<` + e.tag + `>`), e.result !== null && m.kind !== e.kind && A$1(e, `unacceptable node kind for !<` + e.tag + `> tag; it should be "` + m.kind + `", not "` + e.kind + `"`), m.resolve(e.result, e.tag) ? (e.result = m.construct(e.result, e.tag), e.anchor !== null && (e.anchorMap[e.anchor] = e.result)) : A$1(e, `cannot resolve a node with !<` + e.tag + `> explicit tag`);
	}
	return e.listener !== null && e.listener(`close`, e), e.tag !== null || e.anchor !== null || u;
}
function jt(e) {
	var t = e.position, n, r, i, a = !1, o;
	for (e.version = null, e.checkLineBreaks = e.legacy, e.tagMap = Object.create(null), e.anchorMap = Object.create(null); (o = e.input.charCodeAt(e.position)) !== 0 && (F$1(e, !0, -1), o = e.input.charCodeAt(e.position), !(e.lineIndent > 0 || o !== 37));) {
		for (a = !0, o = e.input.charCodeAt(++e.position), n = e.position; o !== 0 && !D$2(o);) o = e.input.charCodeAt(++e.position);
		for (r = e.input.slice(n, e.position), i = [], r.length < 1 && A$1(e, `directive name must not be less than one character in length`); o !== 0;) {
			for (; E$1(o);) o = e.input.charCodeAt(++e.position);
			if (o === 35) {
				do
					o = e.input.charCodeAt(++e.position);
				while (o !== 0 && !T$3(o));
				break;
			}
			if (T$3(o)) break;
			for (n = e.position; o !== 0 && !D$2(o);) o = e.input.charCodeAt(++e.position);
			i.push(e.input.slice(n, e.position));
		}
		o !== 0 && P$2(e), x$3.call(yt, r) ? yt[r](e, r, i) : j$1(e, `unknown document directive "` + r + `"`);
	}
	if (F$1(e, !0, -1), e.lineIndent === 0 && e.input.charCodeAt(e.position) === 45 && e.input.charCodeAt(e.position + 1) === 45 && e.input.charCodeAt(e.position + 2) === 45 ? (e.position += 3, F$1(e, !0, -1)) : a && A$1(e, `directives end mark is expected`), R$1(e, e.lineIndent - 1, C$2, !1, !0), F$1(e, !0, -1), e.checkLineBreaks && it.test(e.input.slice(t, e.position)) && j$1(e, `non-ASCII line breaks are interpreted as content`), e.documents.push(e.result), e.position === e.lineStart && I$2(e)) {
		e.input.charCodeAt(e.position) === 46 && (e.position += 3, F$1(e, !0, -1));
		return;
	}
	if (e.position < e.length - 1) A$1(e, `end of the stream or a document separator is expected`);
	else return;
}
function Mt(e, t) {
	e = String(e), t ||= {}, e.length !== 0 && (e.charCodeAt(e.length - 1) !== 10 && e.charCodeAt(e.length - 1) !== 13 && (e += `
`), e.charCodeAt(0) === 65279 && (e = e.slice(1)));
	var n = new _t(e, t), r = e.indexOf(`\0`);
	for (r !== -1 && (n.position = r, A$1(n, `null byte is not allowed in input`)), n.input += `\0`; n.input.charCodeAt(n.position) === 32;) n.lineIndent += 1, n.position += 1;
	for (; n.position < n.length - 1;) jt(n);
	return n.documents;
}
function Nt(e, t, n) {
	typeof t == `object` && t && n === void 0 && (n = t, t = null);
	var r = Mt(e, n);
	if (typeof t != `function`) return r;
	for (var i = 0, a = r.length; i < a; i += 1) t(r[i]);
}
function Pt(e, t) {
	var n = Mt(e, t);
	if (n.length !== 0) {
		if (n.length === 1) return n[0];
		throw new l$2(`expected a single document in the stream, but found more`);
	}
}
var Ft = {
	loadAll: Nt,
	load: Pt
}, It = Object.prototype.toString, Lt = Object.prototype.hasOwnProperty, z$2 = 65279, Rt = 9, B$1 = 10, zt = 13, Bt = 32, Vt = 33, Ht = 34, V$1 = 35, Ut = 37, Wt = 38, Gt = 39, Kt = 42, qt = 44, Jt = 45, H$1 = 58, Yt = 61, Xt = 62, Zt = 63, Qt = 64, $t = 91, en = 93, tn = 96, nn = 123, rn = 124, an = 125, U$1 = {};
U$1[0] = `\\0`, U$1[7] = `\\a`, U$1[8] = `\\b`, U$1[9] = `\\t`, U$1[10] = `\\n`, U$1[11] = `\\v`, U$1[12] = `\\f`, U$1[13] = `\\r`, U$1[27] = `\\e`, U$1[34] = `\\"`, U$1[92] = `\\\\`, U$1[133] = `\\N`, U$1[160] = `\\_`, U$1[8232] = `\\L`, U$1[8233] = `\\P`;
var on = [
	`y`,
	`Y`,
	`yes`,
	`Yes`,
	`YES`,
	`on`,
	`On`,
	`ON`,
	`n`,
	`N`,
	`no`,
	`No`,
	`NO`,
	`off`,
	`Off`,
	`OFF`
], sn = /^[-+]?[0-9_]+(?::[0-9_]+)+(?:\.[0-9_]*)?$/;
function cn(e, t) {
	var n, r, i, a, o, s, c;
	if (t === null) return {};
	for (n = {}, r = Object.keys(t), i = 0, a = r.length; i < a; i += 1) o = r[i], s = String(t[o]), o.slice(0, 2) === `!!` && (o = `tag:yaml.org,2002:` + o.slice(2)), c = e.compiledTypeMap.fallback[o], c && Lt.call(c.styleAliases, s) && (s = c.styleAliases[s]), n[o] = s;
	return n;
}
function ln(e) {
	var t = e.toString(16).toUpperCase(), n, r;
	if (e <= 255) n = `x`, r = 2;
	else if (e <= 65535) n = `u`, r = 4;
	else if (e <= 4294967295) n = `U`, r = 8;
	else throw new l$2(`code point within a string may not be greater than 0xFFFFFFFF`);
	return `\\` + n + o$2.repeat(`0`, r - t.length) + t;
}
var un = 1, W$1 = 2;
function dn(e) {
	this.schema = e.schema || Qe, this.indent = Math.max(1, e.indent || 2), this.noArrayIndent = e.noArrayIndent || !1, this.skipInvalid = e.skipInvalid || !1, this.flowLevel = o$2.isNothing(e.flowLevel) ? -1 : e.flowLevel, this.styleMap = cn(this.schema, e.styles || null), this.sortKeys = e.sortKeys || !1, this.lineWidth = e.lineWidth || 80, this.noRefs = e.noRefs || !1, this.noCompatMode = e.noCompatMode || !1, this.condenseFlow = e.condenseFlow || !1, this.quotingType = e.quotingType === `"` ? W$1 : un, this.forceQuotes = e.forceQuotes || !1, this.replacer = typeof e.replacer == `function` ? e.replacer : null, this.implicitTypes = this.schema.compiledImplicit, this.explicitTypes = this.schema.compiledExplicit, this.tag = null, this.result = ``, this.duplicates = [], this.usedDuplicates = null;
}
function fn(e, t) {
	for (var n = o$2.repeat(` `, t), r = 0, i = -1, a = ``, s, c = e.length; r < c;) i = e.indexOf(`
`, r), i === -1 ? (s = e.slice(r), r = c) : (s = e.slice(r, i + 1), r = i + 1), s.length && s !== `
` && (a += n), a += s;
	return a;
}
function G$1(e, t) {
	return `
` + o$2.repeat(` `, e.indent * t);
}
function pn(e, t) {
	var n, r, i;
	for (n = 0, r = e.implicitTypes.length; n < r; n += 1) if (i = e.implicitTypes[n], i.resolve(t)) return !0;
	return !1;
}
function K$1(e) {
	return e === Bt || e === Rt;
}
function q$1(e) {
	return 32 <= e && e <= 126 || 161 <= e && e <= 55295 && e !== 8232 && e !== 8233 || 57344 <= e && e <= 65533 && e !== z$2 || 65536 <= e && e <= 1114111;
}
function mn(e) {
	return q$1(e) && e !== z$2 && e !== zt && e !== B$1;
}
function hn(e, t, n) {
	var r = mn(e), i = r && !K$1(e);
	return (n ? r : r && e !== qt && e !== $t && e !== en && e !== nn && e !== an) && e !== V$1 && !(t === H$1 && !i) || mn(t) && !K$1(t) && e === V$1 || t === H$1 && i;
}
function gn(e) {
	return q$1(e) && e !== z$2 && !K$1(e) && e !== Jt && e !== Zt && e !== H$1 && e !== qt && e !== $t && e !== en && e !== nn && e !== an && e !== V$1 && e !== Wt && e !== Kt && e !== Vt && e !== rn && e !== Yt && e !== Xt && e !== Gt && e !== Ht && e !== Ut && e !== Qt && e !== tn;
}
function _n(e) {
	return !K$1(e) && e !== H$1;
}
function J(e, t) {
	var n = e.charCodeAt(t), r;
	return n >= 55296 && n <= 56319 && t + 1 < e.length && (r = e.charCodeAt(t + 1), r >= 56320 && r <= 57343) ? (n - 55296) * 1024 + r - 56320 + 65536 : n;
}
function vn(e) {
	return /^\n* /.test(e);
}
var yn = 1, Y = 2, bn = 3, xn = 4, X = 5;
function Sn(e, t, n, r, i, a, o, s) {
	var c, l = 0, u = null, d = !1, f = !1, p = r !== -1, m = -1, h = gn(J(e, 0)) && _n(J(e, e.length - 1));
	if (t || o) for (c = 0; c < e.length; l >= 65536 ? c += 2 : c++) {
		if (l = J(e, c), !q$1(l)) return X;
		h &&= hn(l, u, s), u = l;
	}
	else {
		for (c = 0; c < e.length; l >= 65536 ? c += 2 : c++) {
			if (l = J(e, c), l === B$1) d = !0, p && (f ||= c - m - 1 > r && e[m + 1] !== ` `, m = c);
			else if (!q$1(l)) return X;
			h &&= hn(l, u, s), u = l;
		}
		f ||= p && c - m - 1 > r && e[m + 1] !== ` `;
	}
	return !d && !f ? h && !o && !i(e) ? yn : a === W$1 ? X : Y : n > 9 && vn(e) ? X : o ? a === W$1 ? X : Y : f ? xn : bn;
}
function Cn(e, t, n, r, i) {
	e.dump = function() {
		if (t.length === 0) return e.quotingType === W$1 ? `""` : `''`;
		if (!e.noCompatMode && (on.indexOf(t) !== -1 || sn.test(t))) return e.quotingType === W$1 ? `"` + t + `"` : `'` + t + `'`;
		var a = e.indent * Math.max(1, n), o = e.lineWidth === -1 ? -1 : Math.max(Math.min(e.lineWidth, 40), e.lineWidth - a), s = r || e.flowLevel > -1 && n >= e.flowLevel;
		function c(t) {
			return pn(e, t);
		}
		switch (Sn(t, s, e.indent, o, c, e.quotingType, e.forceQuotes && !r, i)) {
			case yn: return t;
			case Y: return `'` + t.replace(/'/g, `''`) + `'`;
			case bn: return `|` + wn(t, e.indent) + Tn(fn(t, a));
			case xn: return `>` + wn(t, e.indent) + Tn(fn(En(t, o), a));
			case X: return `"` + Dn(t) + `"`;
			default: throw new l$2(`impossible error: invalid scalar style`);
		}
	}();
}
function wn(e, t) {
	var n = vn(e) ? String(t) : ``, r = e[e.length - 1] === `
`;
	return n + (r && (e[e.length - 2] === `
` || e === `
`) ? `+` : r ? `` : `-`) + `
`;
}
function Tn(e) {
	return e[e.length - 1] === `
` ? e.slice(0, -1) : e;
}
function En(e, t) {
	for (var n = /(\n+)([^\n]*)/g, r = function() {
		var r = e.indexOf(`
`);
		return r = r === -1 ? e.length : r, n.lastIndex = r, Z(e.slice(0, r), t);
	}(), i = e[0] === `
` || e[0] === ` `, a, o; o = n.exec(e);) {
		var s = o[1], c = o[2];
		a = c[0] === ` `, r += s + (!i && !a && c !== `` ? `
` : ``) + Z(c, t), i = a;
	}
	return r;
}
function Z(e, t) {
	if (e === `` || e[0] === ` `) return e;
	for (var n = / [^ ]/g, r, i = 0, a, o = 0, s = 0, c = ``; r = n.exec(e);) s = r.index, s - i > t && (a = o > i ? o : s, c += `
` + e.slice(i, a), i = a + 1), o = s;
	return c += `
`, e.length - i > t && o > i ? c += e.slice(i, o) + `
` + e.slice(o + 1) : c += e.slice(i), c.slice(1);
}
function Dn(e) {
	for (var t = ``, n = 0, r, i = 0; i < e.length; n >= 65536 ? i += 2 : i++) n = J(e, i), r = U$1[n], !r && q$1(n) ? (t += e[i], n >= 65536 && (t += e[i + 1])) : t += r || ln(n);
	return t;
}
function On(e, t, n) {
	var r = ``, i = e.tag, a, o, s;
	for (a = 0, o = n.length; a < o; a += 1) s = n[a], e.replacer && (s = e.replacer.call(n, String(a), s)), (Q(e, t, s, !1, !1) || s === void 0 && Q(e, t, null, !1, !1)) && (r !== `` && (r += `,` + (e.condenseFlow ? `` : ` `)), r += e.dump);
	e.tag = i, e.dump = `[` + r + `]`;
}
function kn(e, t, n, r) {
	var i = ``, a = e.tag, o, s, c;
	for (o = 0, s = n.length; o < s; o += 1) c = n[o], e.replacer && (c = e.replacer.call(n, String(o), c)), (Q(e, t + 1, c, !0, !0, !1, !0) || c === void 0 && Q(e, t + 1, null, !0, !0, !1, !0)) && ((!r || i !== ``) && (i += G$1(e, t)), e.dump && B$1 === e.dump.charCodeAt(0) ? i += `-` : i += `- `, i += e.dump);
	e.tag = a, e.dump = i || `[]`;
}
function An(e, t, n) {
	var r = ``, i = e.tag, a = Object.keys(n), o, s, c, l, u;
	for (o = 0, s = a.length; o < s; o += 1) u = ``, r !== `` && (u += `, `), e.condenseFlow && (u += `"`), c = a[o], l = n[c], e.replacer && (l = e.replacer.call(n, c, l)), Q(e, t, c, !1, !1) && (e.dump.length > 1024 && (u += `? `), u += e.dump + (e.condenseFlow ? `"` : ``) + `:` + (e.condenseFlow ? `` : ` `), Q(e, t, l, !1, !1) && (u += e.dump, r += u));
	e.tag = i, e.dump = `{` + r + `}`;
}
function jn(e, t, n, r) {
	var i = ``, a = e.tag, o = Object.keys(n), s, c, u, d, f, p;
	if (e.sortKeys === !0) o.sort();
	else if (typeof e.sortKeys == `function`) o.sort(e.sortKeys);
	else if (e.sortKeys) throw new l$2(`sortKeys must be a boolean or a function`);
	for (s = 0, c = o.length; s < c; s += 1) p = ``, (!r || i !== ``) && (p += G$1(e, t)), u = o[s], d = n[u], e.replacer && (d = e.replacer.call(n, u, d)), Q(e, t + 1, u, !0, !0, !0) && (f = e.tag !== null && e.tag !== `?` || e.dump && e.dump.length > 1024, f && (e.dump && B$1 === e.dump.charCodeAt(0) ? p += `?` : p += `? `), p += e.dump, f && (p += G$1(e, t)), Q(e, t + 1, d, !0, f) && (e.dump && B$1 === e.dump.charCodeAt(0) ? p += `:` : p += `: `, p += e.dump, i += p));
	e.tag = a, e.dump = i || `{}`;
}
function Mn(e, t, n) {
	var r, i = n ? e.explicitTypes : e.implicitTypes, a, o, s, c;
	for (a = 0, o = i.length; a < o; a += 1) if (s = i[a], (s.instanceOf || s.predicate) && (!s.instanceOf || typeof t == `object` && t instanceof s.instanceOf) && (!s.predicate || s.predicate(t))) {
		if (n ? s.multi && s.representName ? e.tag = s.representName(t) : e.tag = s.tag : e.tag = `?`, s.represent) {
			if (c = e.styleMap[s.tag] || s.defaultStyle, It.call(s.represent) === `[object Function]`) r = s.represent(t, c);
			else if (Lt.call(s.represent, c)) r = s.represent[c](t, c);
			else throw new l$2(`!<` + s.tag + `> tag resolver accepts not "` + c + `" style`);
			e.dump = r;
		}
		return !0;
	}
	return !1;
}
function Q(e, t, n, r, i, a, o) {
	e.tag = null, e.dump = n, Mn(e, n, !1) || Mn(e, n, !0);
	var s = It.call(e.dump), c = r, u;
	r &&= e.flowLevel < 0 || e.flowLevel > t;
	var d = s === `[object Object]` || s === `[object Array]`, f, p;
	if (d && (f = e.duplicates.indexOf(n), p = f !== -1), (e.tag !== null && e.tag !== `?` || p || e.indent !== 2 && t > 0) && (i = !1), p && e.usedDuplicates[f]) e.dump = `*ref_` + f;
	else {
		if (d && p && !e.usedDuplicates[f] && (e.usedDuplicates[f] = !0), s === `[object Object]`) r && Object.keys(e.dump).length !== 0 ? (jn(e, t, e.dump, i), p && (e.dump = `&ref_` + f + e.dump)) : (An(e, t, e.dump), p && (e.dump = `&ref_` + f + ` ` + e.dump));
		else if (s === `[object Array]`) r && e.dump.length !== 0 ? (e.noArrayIndent && !o && t > 0 ? kn(e, t - 1, e.dump, i) : kn(e, t, e.dump, i), p && (e.dump = `&ref_` + f + e.dump)) : (On(e, t, e.dump), p && (e.dump = `&ref_` + f + ` ` + e.dump));
		else if (s === `[object String]`) e.tag !== `?` && Cn(e, e.dump, t, a, c);
		else if (s === `[object Undefined]`) return !1;
		else {
			if (e.skipInvalid) return !1;
			throw new l$2(`unacceptable kind of an object to dump ` + s);
		}
		e.tag !== null && e.tag !== `?` && (u = encodeURI(e.tag[0] === `!` ? e.tag.slice(1) : e.tag).replace(/!/g, `%21`), u = e.tag[0] === `!` ? `!` + u : u.slice(0, 18) === `tag:yaml.org,2002:` ? `!!` + u.slice(18) : `!<` + u + `>`, e.dump = u + ` ` + e.dump);
	}
	return !0;
}
function Nn(e, t) {
	var n = [], r = [], i, a;
	for ($(e, n, r), i = 0, a = r.length; i < a; i += 1) t.duplicates.push(n[r[i]]);
	t.usedDuplicates = Array(a);
}
function $(e, t, n) {
	var r, i, a;
	if (typeof e == `object` && e) if (i = t.indexOf(e), i !== -1) n.indexOf(i) === -1 && n.push(i);
	else if (t.push(e), Array.isArray(e)) for (i = 0, a = e.length; i < a; i += 1) $(e[i], t, n);
	else for (r = Object.keys(e), i = 0, a = r.length; i < a; i += 1) $(e[r[i]], t, n);
}
function Pn(e, t) {
	t ||= {};
	var n = new dn(t);
	n.noRefs || Nn(e, n);
	var r = e;
	return n.replacer && (r = n.replacer.call({ "": r }, ``, r)), Q(n, 0, r, !0, !0) ? n.dump + `
` : ``;
}
var Fn = { dump: Pn }, In = Ft.load;
Ft.loadAll;
var Ln = Fn.dump;
var yaml_exports = /* @__PURE__ */ __exportAll$1({
	parseYAML: () => i$2,
	stringifyYAML: () => a$1
});
function i$2(t, r) {
	let i = In(t, r);
	return a$4(t, i, r), i;
}
function a$1(e, n) {
	let i = o$5(e, { preserveIndentation: !1 }), a = Ln(e, {
		indent: typeof i.indent == `string` ? i.indent.length : i.indent,
		...n
	});
	return i.whitespace.start + a.trim() + i.whitespace.end;
}
/*!
* Copyright (c) Squirrel Chat et al., All rights reserved.
* SPDX-License-Identifier: BSD-3-Clause
*
* Redistribution and use in source and binary forms, with or without
* modification, are permitted provided that the following conditions are met:
*
* 1. Redistributions of source code must retain the above copyright notice, this
*    list of conditions and the following disclaimer.
* 2. Redistributions in binary form must reproduce the above copyright notice,
*    this list of conditions and the following disclaimer in the
*    documentation and/or other materials provided with the distribution.
* 3. Neither the name of the copyright holder nor the names of its contributors
*    may be used to endorse or promote products derived from this software without
*    specific prior written permission.
*
* THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND
* ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED
* WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE
* DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT HOLDER OR CONTRIBUTORS BE LIABLE
* FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL
* DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR
* SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER
* CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY,
* OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE
* OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
*/
function e$1(e, t) {
	let n = e.slice(0, t).split(/\r\n|\n|\r/g);
	return [n.length, n.pop().length + 1];
}
function t(e, t, n) {
	let r = e.split(/\r\n|\n|\r/g), i = ``, a = (Math.log10(t + 1) | 0) + 1;
	for (let e = t - 1; e <= t + 1; e++) {
		let o = r[e - 1];
		o && (i += e.toString().padEnd(a, ` `), i += `:  `, i += o, i += `
`, e === t && (i += ` `.repeat(a + n + 2), i += `^
`));
	}
	return i;
}
var n = class extends Error {
	line;
	column;
	codeblock;
	constructor(n, r) {
		let [i, a] = e$1(r.toml, r.ptr), o = t(r.toml, i, a);
		super(`Invalid TOML document: ${n}\n\n${o}`, r), this.line = i, this.column = a, this.codeblock = o;
	}
};
/*!
* Copyright (c) Squirrel Chat et al., All rights reserved.
* SPDX-License-Identifier: BSD-3-Clause
*
* Redistribution and use in source and binary forms, with or without
* modification, are permitted provided that the following conditions are met:
*
* 1. Redistributions of source code must retain the above copyright notice, this
*    list of conditions and the following disclaimer.
* 2. Redistributions in binary form must reproduce the above copyright notice,
*    this list of conditions and the following disclaimer in the
*    documentation and/or other materials provided with the distribution.
* 3. Neither the name of the copyright holder nor the names of its contributors
*    may be used to endorse or promote products derived from this software without
*    specific prior written permission.
*
* THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND
* ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED
* WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE
* DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT HOLDER OR CONTRIBUTORS BE LIABLE
* FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL
* DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR
* SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER
* CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY,
* OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE
* OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
*/
function r$1(e, t) {
	let n = 0;
	for (; e[t - ++n] === `\\`;);
	return --n && n % 2;
}
function i$1(e, t = 0, n = e.length) {
	let r = e.indexOf(`
`, t);
	return e[r - 1] === `\r` && r--, r <= n ? r : -1;
}
function a(e, t) {
	for (let r = t; r < e.length; r++) {
		let i = e[r];
		if (i === `
`) return r;
		if (i === `\r` && e[r + 1] === `
`) return r + 1;
		if (i < ` ` && i !== `	` || i === ``) throw new n(`control characters are not allowed in comments`, {
			toml: e,
			ptr: t
		});
	}
	return e.length;
}
function o$1(e, t, n, r) {
	let i;
	for (; (i = e[t]) === ` ` || i === `	` || !n && (i === `
` || i === `\r` && e[t + 1] === `
`);) t++;
	return r || i !== `#` ? t : o$1(e, a(e, t), n);
}
function s$1(e, t, r, a, o = !1) {
	if (!a) return t = i$1(e, t), t < 0 ? e.length : t;
	for (let n = t; n < e.length; n++) {
		let t = e[n];
		if (t === `#`) n = i$1(e, n);
		else if (t === r) return n + 1;
		else if (t === a || o && (t === `
` || t === `\r` && e[n + 1] === `
`)) return n;
	}
	throw new n(`cannot find end of structure`, {
		toml: e,
		ptr: t
	});
}
function c$2(e, t) {
	let n = e[t], i = n === e[t + 1] && e[t + 1] === e[t + 2] ? e.slice(t, t + 3) : n;
	t += i.length - 1;
	do
		t = e.indexOf(i, ++t);
	while (t > -1 && n !== `'` && r$1(e, t));
	return t > -1 && (t += i.length, i.length > 1 && (e[t] === n && t++, e[t] === n && t++)), t;
}
/*!
* Copyright (c) Squirrel Chat et al., All rights reserved.
* SPDX-License-Identifier: BSD-3-Clause
*
* Redistribution and use in source and binary forms, with or without
* modification, are permitted provided that the following conditions are met:
*
* 1. Redistributions of source code must retain the above copyright notice, this
*    list of conditions and the following disclaimer.
* 2. Redistributions in binary form must reproduce the above copyright notice,
*    this list of conditions and the following disclaimer in the
*    documentation and/or other materials provided with the distribution.
* 3. Neither the name of the copyright holder nor the names of its contributors
*    may be used to endorse or promote products derived from this software without
*    specific prior written permission.
*
* THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND
* ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED
* WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE
* DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT HOLDER OR CONTRIBUTORS BE LIABLE
* FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL
* DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR
* SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER
* CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY,
* OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE
* OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
*/
let l$1 = /^(\d{4}-\d{2}-\d{2})?[T ]?(?:(\d{2}):\d{2}(?::\d{2}(?:\.\d+)?)?)?(Z|[-+]\d{2}:\d{2})?$/i;
var u$1 = class e extends Date {
	#e = !1;
	#t = !1;
	#n = null;
	constructor(e) {
		let t = !0, n = !0, r = `Z`;
		if (typeof e == `string`) {
			let i = e.match(l$1);
			i ? (i[1] || (t = !1, e = `0000-01-01T${e}`), n = !!i[2], n && e[10] === ` ` && (e = e.replace(` `, `T`)), i[2] && +i[2] > 23 ? e = `` : (r = i[3] || null, e = e.toUpperCase(), !r && n && (e += `Z`))) : e = ``;
		}
		super(e), isNaN(this.getTime()) || (this.#e = t, this.#t = n, this.#n = r);
	}
	isDateTime() {
		return this.#e && this.#t;
	}
	isLocal() {
		return !this.#e || !this.#t || !this.#n;
	}
	isDate() {
		return this.#e && !this.#t;
	}
	isTime() {
		return this.#t && !this.#e;
	}
	isValid() {
		return this.#e || this.#t;
	}
	toISOString() {
		let e = super.toISOString();
		if (this.isDate()) return e.slice(0, 10);
		if (this.isTime()) return e.slice(11, 23);
		if (this.#n === null) return e.slice(0, -1);
		if (this.#n === `Z`) return e;
		let t = this.#n.slice(1, 3) * 60 + +this.#n.slice(4, 6);
		return t = this.#n[0] === `-` ? t : -t, (/* @__PURE__ */ new Date(this.getTime() - t * 6e4)).toISOString().slice(0, -1) + this.#n;
	}
	static wrapAsOffsetDateTime(t, n = `Z`) {
		let r = new e(t);
		return r.#n = n, r;
	}
	static wrapAsLocalDateTime(t) {
		let n = new e(t);
		return n.#n = null, n;
	}
	static wrapAsLocalDate(t) {
		let n = new e(t);
		return n.#t = !1, n.#n = null, n;
	}
	static wrapAsLocalTime(t) {
		let n = new e(t);
		return n.#e = !1, n.#n = null, n;
	}
};
/*!
* Copyright (c) Squirrel Chat et al., All rights reserved.
* SPDX-License-Identifier: BSD-3-Clause
*
* Redistribution and use in source and binary forms, with or without
* modification, are permitted provided that the following conditions are met:
*
* 1. Redistributions of source code must retain the above copyright notice, this
*    list of conditions and the following disclaimer.
* 2. Redistributions in binary form must reproduce the above copyright notice,
*    this list of conditions and the following disclaimer in the
*    documentation and/or other materials provided with the distribution.
* 3. Neither the name of the copyright holder nor the names of its contributors
*    may be used to endorse or promote products derived from this software without
*    specific prior written permission.
*
* THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND
* ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED
* WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE
* DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT HOLDER OR CONTRIBUTORS BE LIABLE
* FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL
* DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR
* SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER
* CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY,
* OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE
* OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
*/
let d$1 = /^((0x[0-9a-fA-F](_?[0-9a-fA-F])*)|(([+-]|0[ob])?\d(_?\d)*))$/, f$2 = /^[+-]?\d(_?\d)*(\.\d(_?\d)*)?([eE][+-]?\d(_?\d)*)?$/, p$2 = /^[+-]?0[0-9_]/, m$1 = /^[0-9a-f]{2,8}$/i, h$1 = {
	b: `\b`,
	t: `	`,
	n: `
`,
	f: `\f`,
	r: `\r`,
	e: `\x1B`,
	"\"": `"`,
	"\\": `\\`
};
function g$1(e, t = 0, r = e.length) {
	let i = e[t] === `'`, a = e[t++] === e[t] && e[t] === e[t + 1];
	a && (r -= 2, e[t += 2] === `\r` && t++, e[t] === `
` && t++);
	let s = 0, c, l = ``, u = t;
	for (; t < r - 1;) {
		let r = e[t++];
		if (r === `
` || r === `\r` && e[t] === `
`) {
			if (!a) throw new n(`newlines are not allowed in strings`, {
				toml: e,
				ptr: t - 1
			});
		} else if (r < ` ` && r !== `	` || r === ``) throw new n(`control characters are not allowed in strings`, {
			toml: e,
			ptr: t - 1
		});
		if (c) {
			if (c = !1, r === `x` || r === `u` || r === `U`) {
				let i = e.slice(t, t += r === `x` ? 2 : r === `u` ? 4 : 8);
				if (!m$1.test(i)) throw new n(`invalid unicode escape`, {
					toml: e,
					ptr: s
				});
				try {
					l += String.fromCodePoint(parseInt(i, 16));
				} catch {
					throw new n(`invalid unicode escape`, {
						toml: e,
						ptr: s
					});
				}
			} else if (a && (r === `
` || r === ` ` || r === `	` || r === `\r`)) {
				if (t = o$1(e, t - 1, !0), e[t] !== `
` && e[t] !== `\r`) throw new n(`invalid escape: only line-ending whitespace may be escaped`, {
					toml: e,
					ptr: s
				});
				t = o$1(e, t);
			} else if (r in h$1) l += h$1[r];
			else throw new n(`unrecognized escape sequence`, {
				toml: e,
				ptr: s
			});
			u = t;
		} else !i && r === `\\` && (s = t - 1, c = !0, l += e.slice(u, s));
	}
	return l + e.slice(u, r - 1);
}
function _$1(e, t, r, i) {
	if (e === `true`) return !0;
	if (e === `false`) return !1;
	if (e === `-inf`) return -Infinity;
	if (e === `inf` || e === `+inf`) return Infinity;
	if (e === `nan` || e === `+nan` || e === `-nan`) return NaN;
	if (e === `-0`) return i ? 0n : 0;
	let a = d$1.test(e);
	if (a || f$2.test(e)) {
		if (p$2.test(e)) throw new n(`leading zeroes are not allowed`, {
			toml: t,
			ptr: r
		});
		e = e.replace(/_/g, ``);
		let o = +e;
		if (isNaN(o)) throw new n(`invalid number`, {
			toml: t,
			ptr: r
		});
		if (a) {
			if ((a = !Number.isSafeInteger(o)) && !i) throw new n(`integer value cannot be represented losslessly`, {
				toml: t,
				ptr: r
			});
			(a || i === !0) && (o = BigInt(e));
		}
		return o;
	}
	let o = new u$1(e);
	if (!o.isValid()) throw new n(`invalid value`, {
		toml: t,
		ptr: r
	});
	return o;
}
/*!
* Copyright (c) Squirrel Chat et al., All rights reserved.
* SPDX-License-Identifier: BSD-3-Clause
*
* Redistribution and use in source and binary forms, with or without
* modification, are permitted provided that the following conditions are met:
*
* 1. Redistributions of source code must retain the above copyright notice, this
*    list of conditions and the following disclaimer.
* 2. Redistributions in binary form must reproduce the above copyright notice,
*    this list of conditions and the following disclaimer in the
*    documentation and/or other materials provided with the distribution.
* 3. Neither the name of the copyright holder nor the names of its contributors
*    may be used to endorse or promote products derived from this software without
*    specific prior written permission.
*
* THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND
* ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED
* WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE
* DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT HOLDER OR CONTRIBUTORS BE LIABLE
* FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL
* DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR
* SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER
* CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY,
* OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE
* OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
*/
function v$1(e, t, n) {
	let r = e.slice(t, n), i = r.indexOf(`#`);
	return i > -1 && (a(e, i), r = r.slice(0, i)), [r.trimEnd(), i];
}
function y$1(e, t, r, i, a) {
	if (i === 0) throw new n(`document contains excessively nested structures. aborting.`, {
		toml: e,
		ptr: t
	});
	let l = e[t];
	if (l === `[` || l === `{`) {
		let [s, c] = l === `[` ? C$1(e, t, i, a) : S$2(e, t, i, a);
		if (r) {
			if (c = o$1(e, c), e[c] === `,`) c++;
			else if (e[c] !== r) throw new n(`expected comma or end of structure`, {
				toml: e,
				ptr: c
			});
		}
		return [s, c];
	}
	let u;
	if (l === `"` || l === `'`) {
		u = c$2(e, t);
		let i = g$1(e, t, u);
		if (r) {
			if (u = o$1(e, u), e[u] && e[u] !== `,` && e[u] !== r && e[u] !== `
` && e[u] !== `\r`) throw new n(`unexpected character encountered`, {
				toml: e,
				ptr: u
			});
			u += +(e[u] === `,`);
		}
		return [i, u];
	}
	u = s$1(e, t, `,`, r);
	let d = v$1(e, t, u - +(e[u - 1] === `,`));
	if (!d[0]) throw new n(`incomplete key-value declaration: no value specified`, {
		toml: e,
		ptr: t
	});
	return r && d[1] > -1 && (u = o$1(e, t + d[1]), u += +(e[u] === `,`)), [_$1(d[0], e, t, a), u];
}
/*!
* Copyright (c) Squirrel Chat et al., All rights reserved.
* SPDX-License-Identifier: BSD-3-Clause
*
* Redistribution and use in source and binary forms, with or without
* modification, are permitted provided that the following conditions are met:
*
* 1. Redistributions of source code must retain the above copyright notice, this
*    list of conditions and the following disclaimer.
* 2. Redistributions in binary form must reproduce the above copyright notice,
*    this list of conditions and the following disclaimer in the
*    documentation and/or other materials provided with the distribution.
* 3. Neither the name of the copyright holder nor the names of its contributors
*    may be used to endorse or promote products derived from this software without
*    specific prior written permission.
*
* THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND
* ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED
* WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE
* DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT HOLDER OR CONTRIBUTORS BE LIABLE
* FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL
* DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR
* SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER
* CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY,
* OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE
* OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
*/
let b$2 = /^[a-zA-Z0-9-_]+[ \t]*$/;
function x$2(e, t, r = `=`) {
	let a = t - 1, s = [], l = e.indexOf(r, t);
	if (l < 0) throw new n(`incomplete key-value: cannot find end of key`, {
		toml: e,
		ptr: t
	});
	do {
		let o = e[t = ++a];
		if (o !== ` ` && o !== `	`) if (o === `"` || o === `'`) {
			if (o === e[t + 1] && o === e[t + 2]) throw new n(`multiline strings are not allowed in keys`, {
				toml: e,
				ptr: t
			});
			let u = c$2(e, t);
			if (u < 0) throw new n(`unfinished string encountered`, {
				toml: e,
				ptr: t
			});
			a = e.indexOf(`.`, u);
			let d = e.slice(u, a < 0 || a > l ? l : a), f = i$1(d);
			if (f > -1) throw new n(`newlines are not allowed in keys`, {
				toml: e,
				ptr: t + a + f
			});
			if (d.trimStart()) throw new n(`found extra tokens after the string part`, {
				toml: e,
				ptr: u
			});
			if (l < u && (l = e.indexOf(r, u), l < 0)) throw new n(`incomplete key-value: cannot find end of key`, {
				toml: e,
				ptr: t
			});
			s.push(g$1(e, t, u));
		} else {
			a = e.indexOf(`.`, t);
			let r = e.slice(t, a < 0 || a > l ? l : a);
			if (!b$2.test(r)) throw new n(`only letter, numbers, dashes and underscores are allowed in keys`, {
				toml: e,
				ptr: t
			});
			s.push(r.trimEnd());
		}
	} while (a + 1 && a < l);
	return [s, o$1(e, l + 1, !0, !0)];
}
function S$2(e, t, r, i) {
	let o = {}, s = /* @__PURE__ */ new Set(), c;
	for (t++; (c = e[t++]) !== `}` && c;) if (c === `,`) throw new n(`expected value, found comma`, {
		toml: e,
		ptr: t - 1
	});
	else if (c === `#`) t = a(e, t);
	else if (c !== ` ` && c !== `	` && c !== `
` && c !== `\r`) {
		let a, c = o, l = !1, [u, d] = x$2(e, t - 1);
		for (let r = 0; r < u.length; r++) {
			if (r && (c = l ? c[a] : c[a] = {}), a = u[r], (l = Object.hasOwn(c, a)) && (typeof c[a] != `object` || s.has(c[a]))) throw new n(`trying to redefine an already defined value`, {
				toml: e,
				ptr: t
			});
			!l && a === `__proto__` && Object.defineProperty(c, a, {
				enumerable: !0,
				configurable: !0,
				writable: !0
			});
		}
		if (l) throw new n(`trying to redefine an already defined value`, {
			toml: e,
			ptr: t
		});
		let [f, p] = y$1(e, d, `}`, r - 1, i);
		s.add(f), c[a] = f, t = p;
	}
	if (!c) throw new n(`unfinished table encountered`, {
		toml: e,
		ptr: t
	});
	return [o, t];
}
function C$1(e, t, r, i) {
	let o = [], s;
	for (t++; (s = e[t++]) !== `]` && s;) if (s === `,`) throw new n(`expected value, found comma`, {
		toml: e,
		ptr: t - 1
	});
	else if (s === `#`) t = a(e, t);
	else if (s !== ` ` && s !== `	` && s !== `
` && s !== `\r`) {
		let n = y$1(e, t - 1, `]`, r - 1, i);
		o.push(n[0]), t = n[1];
	}
	if (!s) throw new n(`unfinished array encountered`, {
		toml: e,
		ptr: t
	});
	return [o, t];
}
/*!
* Copyright (c) Squirrel Chat et al., All rights reserved.
* SPDX-License-Identifier: BSD-3-Clause
*
* Redistribution and use in source and binary forms, with or without
* modification, are permitted provided that the following conditions are met:
*
* 1. Redistributions of source code must retain the above copyright notice, this
*    list of conditions and the following disclaimer.
* 2. Redistributions in binary form must reproduce the above copyright notice,
*    this list of conditions and the following disclaimer in the
*    documentation and/or other materials provided with the distribution.
* 3. Neither the name of the copyright holder nor the names of its contributors
*    may be used to endorse or promote products derived from this software without
*    specific prior written permission.
*
* THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND
* ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED
* WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE
* DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT HOLDER OR CONTRIBUTORS BE LIABLE
* FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL
* DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR
* SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER
* CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY,
* OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE
* OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
*/
function w$1(e, t, n, r) {
	let i = t, a = n, o, s = !1, c;
	for (let t = 0; t < e.length; t++) {
		if (t) {
			if (i = s ? i[o] : i[o] = {}, a = (c = a[o]).c, r === 0 && (c.t === 1 || c.t === 2)) return null;
			if (c.t === 2) {
				let e = i.length - 1;
				i = i[e], a = a[e].c;
			}
		}
		if (o = e[t], (s = Object.hasOwn(i, o)) && a[o]?.t === 0 && a[o]?.d) return null;
		s || (o === `__proto__` && (Object.defineProperty(i, o, {
			enumerable: !0,
			configurable: !0,
			writable: !0
		}), Object.defineProperty(a, o, {
			enumerable: !0,
			configurable: !0,
			writable: !0
		})), a[o] = {
			t: t < e.length - 1 && r === 2 ? 3 : r,
			d: !1,
			i: 0,
			c: {}
		});
	}
	if (c = a[o], c.t !== r && !(r === 1 && c.t === 3) || (r === 2 && (c.d || (c.d = !0, i[o] = []), i[o].push(i = {}), c.c[c.i++] = c = {
		t: 1,
		d: !1,
		i: 0,
		c: {}
	}), c.d)) return null;
	if (c.d = !0, r === 1) i = s ? i[o] : i[o] = {};
	else if (r === 0 && s) return null;
	return [
		o,
		i,
		c.c
	];
}
function T$2(e, { maxDepth: t = 1e3, integersAsBigInt: r } = {}) {
	let i = {}, a = {}, s = i, c = a;
	for (let l = o$1(e, 0); l < e.length;) {
		if (e[l] === `[`) {
			let t = e[++l] === `[`, r = x$2(e, l += +t, `]`);
			if (t) {
				if (e[r[1] - 1] !== `]`) throw new n(`expected end of table declaration`, {
					toml: e,
					ptr: r[1] - 1
				});
				r[1]++;
			}
			let o = w$1(r[0], i, a, t ? 2 : 1);
			if (!o) throw new n(`trying to redefine an already defined table or value`, {
				toml: e,
				ptr: l
			});
			c = o[2], s = o[1], l = r[1];
		} else {
			let i = x$2(e, l), a = w$1(i[0], s, c, 0);
			if (!a) throw new n(`trying to redefine an already defined table or value`, {
				toml: e,
				ptr: l
			});
			let o = y$1(e, i[1], void 0, t, r);
			a[1][a[0]] = o[0], l = o[1];
		}
		if (l = o$1(e, l, !0), e[l] && e[l] !== `
` && e[l] !== `\r`) throw new n(`each key-value declaration must be followed by an end-of-line`, {
			toml: e,
			ptr: l
		});
		l = o$1(e, l);
	}
	return i;
}
var toml_exports = /* @__PURE__ */ __exportAll$1({ parseTOML: () => i });
function i(t) {
	let r = T$2(t);
	return a$4(t, r, { preserveIndentation: !1 }), r;
}
var dist_exports$4 = /* @__PURE__ */ __exportAll$1({
	SUPPORTED_EXTENSIONS: () => SUPPORTED_EXTENSIONS,
	loadConfig: () => loadConfig,
	loadDotenv: () => loadDotenv,
	setupDotenv: () => setupDotenv,
	watchConfig: () => watchConfig
});
async function setupDotenv(options) {
	const targetEnvironment = options.env ?? process.env;
	const environment = await loadDotenv({
		cwd: options.cwd,
		fileName: options.fileName ?? ".env",
		env: targetEnvironment,
		interpolate: options.interpolate ?? true,
		expandFileReferences: options.expandFileReferences ?? true
	});
	const dotenvVars = getDotEnvVars(targetEnvironment);
	for (const key in environment) {
		if (key.startsWith("_")) continue;
		if (targetEnvironment[key] === void 0 || dotenvVars.has(key)) targetEnvironment[key] = environment[key];
	}
	return environment;
}
async function loadDotenv(options) {
	const environment = Object.create(null);
	const cwd = resolve$3(options.cwd || ".");
	const _fileName = options.fileName || ".env";
	const dotenvFiles = typeof _fileName === "string" ? [_fileName] : _fileName;
	const dotenvVars = getDotEnvVars(options.env || {});
	Object.assign(environment, options.env);
	for (const file of dotenvFiles) {
		const dotenvFile = resolve$3(cwd, file);
		if (!statSync(dotenvFile, { throwIfNoEntry: false })?.isFile()) continue;
		const parsed = await readEnvFile(dotenvFile);
		for (const key in parsed) {
			if (key in environment && !dotenvVars.has(key)) continue;
			environment[key] = parsed[key];
			dotenvVars.add(key);
		}
	}
	if (options.expandFileReferences !== false) {
		for (const key in environment) if (key.endsWith("_FILE")) {
			const targetKey = key.slice(0, -5);
			if (environment[targetKey] === void 0) {
				const filePath = environment[key];
				if (filePath && statSync(filePath, { throwIfNoEntry: false })?.isFile()) {
					environment[targetKey] = readFileSync(filePath, "utf8").trim();
					dotenvVars.add(targetKey);
				}
			}
		}
	}
	if (options.interpolate) interpolate(environment);
	return environment;
}
let _parseEnv = nodeUtil.parseEnv;
async function readEnvFile(path) {
	const src = readFileSync(path, "utf8");
	if (!_parseEnv) try {
		const dotenv = await import("dotenv");
		_parseEnv = (src) => dotenv.parse(src);
	} catch {
		throw new Error("Failed to parse .env file: `node:util.parseEnv` is not available and `dotenv` package is not installed. Please upgrade your runtime or install `dotenv` as a dependency.");
	}
	return _parseEnv(src);
}
function interpolate(target, source = {}, parse = (v) => v) {
	function getValue(key) {
		return source[key] === void 0 ? target[key] : source[key];
	}
	function interpolate(value, parents = []) {
		if (typeof value !== "string") return value;
		return parse((value.match(/(.?\${?(?:[\w:]+)?}?)/g) || []).reduce((newValue, match) => {
			const parts = /(.?)\${?([\w:]+)?}?/g.exec(match) || [];
			const prefix = parts[1];
			let value, replacePart;
			if (prefix === "\\") {
				replacePart = parts[0] || "";
				value = replacePart.replace(String.raw`\$`, "$");
			} else {
				const key = parts[2];
				replacePart = (parts[0] || "").slice(prefix.length);
				if (parents.includes(key)) {
					console.warn(`Please avoid recursive environment variables ( loop: ${parents.join(" > ")} > ${key} )`);
					return "";
				}
				value = getValue(key);
				value = interpolate(value, [...parents, key]);
			}
			return value === void 0 ? newValue : newValue.replace(replacePart, value);
		}, value));
	}
	for (const key in target) target[key] = interpolate(getValue(key));
}
function getDotEnvVars(targetEnvironment) {
	const globalRegistry = globalThis.__c12_dotenv_vars__ ||= /* @__PURE__ */ new Map();
	if (!globalRegistry.has(targetEnvironment)) globalRegistry.set(targetEnvironment, /* @__PURE__ */ new Set());
	return globalRegistry.get(targetEnvironment);
}
const _normalize = (p) => p?.replace(/\\/g, "/");
const ASYNC_LOADERS = {
	".yaml": () => Promise.resolve().then(() => yaml_exports).then((r) => r.parseYAML),
	".yml": () => Promise.resolve().then(() => yaml_exports).then((r) => r.parseYAML),
	".jsonc": () => import("../_build/common.mjs").then((n) => n.X).then((r) => r.parseJSONC),
	".json5": () => Promise.resolve().then(() => json5_exports).then((r) => r.parseJSON5),
	".toml": () => Promise.resolve().then(() => toml_exports).then((r) => r.parseTOML)
};
const SUPPORTED_EXTENSIONS = Object.freeze([
	".js",
	".ts",
	".mjs",
	".cjs",
	".mts",
	".cts",
	".json",
	".jsonc",
	".json5",
	".yaml",
	".yml",
	".toml"
]);
async function loadConfig(options) {
	options.cwd = resolve$3(process.cwd(), options.cwd || ".");
	options.name = options.name || "config";
	options.envName = options.envName ?? process.env.NODE_ENV;
	options.configFile = options.configFile ?? (options.name === "config" ? "config" : `${options.name}.config`);
	options.rcFile = options.rcFile ?? `.${options.name}rc`;
	if (options.extend !== false) options.extend = {
		extendKey: "extends",
		...options.extend
	};
	const _merger = options.merger || defu;
	const r = {
		config: {},
		cwd: options.cwd,
		configFile: resolve$3(options.cwd, options.configFile),
		layers: [],
		_configFile: void 0
	};
	const rawConfigs = {
		overrides: options.overrides,
		main: void 0,
		rc: void 0,
		packageJson: void 0,
		defaultConfig: options.defaultConfig
	};
	if (options.dotenv) await setupDotenv({
		cwd: options.cwd,
		...options.dotenv === true ? {} : options.dotenv
	});
	const _mainConfig = await resolveConfig(".", options);
	if (_mainConfig.configFile) {
		rawConfigs.main = _mainConfig.config;
		r.configFile = _mainConfig.configFile;
		r._configFile = _mainConfig._configFile;
	}
	if (_mainConfig.meta) r.meta = _mainConfig.meta;
	if (options.rcFile) {
		const rcSources = [];
		rcSources.push(read({
			name: options.rcFile,
			dir: options.cwd
		}));
		if (options.globalRc) {
			const workspaceDir = await findWorkspaceDir(options.cwd).catch(() => {});
			if (workspaceDir) rcSources.push(read({
				name: options.rcFile,
				dir: workspaceDir
			}));
			rcSources.push(readUser({
				name: options.rcFile,
				dir: options.cwd
			}));
		}
		rawConfigs.rc = _merger({}, ...rcSources);
	}
	if (options.packageJson) {
		const keys = (Array.isArray(options.packageJson) ? options.packageJson : [typeof options.packageJson === "string" ? options.packageJson : options.name]).filter((t) => t && typeof t === "string");
		const pkgJsonFile = await readPackageJSON$1(options.cwd).catch(() => {});
		rawConfigs.packageJson = _merger({}, ...keys.map((key) => pkgJsonFile?.[key]));
	}
	const configs = {};
	for (const key in rawConfigs) {
		const value = rawConfigs[key];
		configs[key] = await (typeof value === "function" ? value({
			configs,
			rawConfigs
		}) : value);
	}
	if (Array.isArray(configs.main)) r.config = configs.main;
	else {
		r.config = _merger(configs.overrides, configs.main, configs.rc, configs.packageJson, configs.defaultConfig);
		if (options.extend) {
			await extendConfig(r.config, options);
			r.layers = r.config._layers;
			delete r.config._layers;
			r.config = _merger(r.config, ...r.layers.map((e) => e.config));
		}
	}
	r.layers = [...[
		configs.overrides && {
			config: configs.overrides,
			configFile: void 0,
			cwd: void 0
		},
		{
			config: configs.main,
			configFile: options.configFile,
			cwd: options.cwd
		},
		configs.rc && {
			config: configs.rc,
			configFile: options.rcFile
		},
		configs.packageJson && {
			config: configs.packageJson,
			configFile: "package.json"
		}
	].filter((l) => l && l.config), ...r.layers];
	if (options.defaults) r.config = _merger(r.config, options.defaults);
	if (options.omit$Keys) {
		for (const key in r.config) if (key.startsWith("$")) delete r.config[key];
	}
	if (options.configFileRequired && !r._configFile) throw new Error(`Required config (${r.configFile}) cannot be resolved.`);
	return r;
}
async function extendConfig(config, options) {
	config._layers = config._layers || [];
	if (!options.extend) return;
	let keys = options.extend.extendKey;
	if (typeof keys === "string") keys = [keys];
	const extendSources = [];
	for (const key of keys) {
		extendSources.push(...(Array.isArray(config[key]) ? config[key] : [config[key]]).filter(Boolean));
		delete config[key];
	}
	for (let extendSource of extendSources) {
		const originalExtendSource = extendSource;
		let sourceOptions = {};
		if (extendSource.source) {
			sourceOptions = extendSource.options || {};
			extendSource = extendSource.source;
		}
		if (Array.isArray(extendSource)) {
			sourceOptions = extendSource[1] || {};
			extendSource = extendSource[0];
		}
		if (typeof extendSource !== "string") {
			console.warn(`Cannot extend config from \`${JSON.stringify(originalExtendSource)}\` in ${options.cwd}`);
			continue;
		}
		const _config = await resolveConfig(extendSource, options, sourceOptions);
		if (!_config.config) {
			console.warn(`Cannot extend config from \`${extendSource}\` in ${options.cwd}`);
			continue;
		}
		await extendConfig(_config.config, {
			...options,
			cwd: _config.cwd
		});
		config._layers.push(_config);
		if (_config.config._layers) {
			config._layers.push(..._config.config._layers);
			delete _config.config._layers;
		}
	}
}
const GIGET_PREFIXES = [
	"gh:",
	"github:",
	"gitlab:",
	"bitbucket:",
	"https://",
	"http://"
];
const NPM_PACKAGE_RE = /^(@[\da-z~-][\d._a-z~-]*\/)?[\da-z~-][\d._a-z~-]*($|\/.*)/;
async function resolveConfig(source, options, sourceOptions = {}) {
	if (options.resolve) {
		const res = await options.resolve(source, options);
		if (res) return res;
	}
	const _merger = options.merger || defu;
	const customProviderKeys = Object.keys(sourceOptions.giget?.providers || {}).map((key) => `${key}:`);
	const gigetPrefixes = customProviderKeys.length > 0 ? [...new Set([...customProviderKeys, ...GIGET_PREFIXES])] : GIGET_PREFIXES;
	if (options.giget !== false && gigetPrefixes.some((prefix) => source.startsWith(prefix))) {
		const { downloadTemplate } = await import("giget").catch((error) => {
			throw new Error(`Extending config from \`${source}\` requires \`giget\` peer dependency to be installed.\n\nInstall it with: \`npx nypm i giget\``, { cause: error });
		});
		const { digest } = await Promise.resolve().then(() => ohash_exports).then((n) => n.n);
		const cloneName = source.replace(/\W+/g, "_").split("_").splice(0, 3).join("_") + "_" + digest(source).slice(0, 10).replace(/[-_]/g, "");
		let cloneDir;
		const localNodeModules = resolve$3(options.cwd, "node_modules");
		const parentDir = dirname$2(options.cwd);
		if (basename$2(parentDir) === ".c12") cloneDir = join$2(parentDir, cloneName);
		else if (existsSync(localNodeModules)) cloneDir = join$2(localNodeModules, ".c12", cloneName);
		else cloneDir = process.env.XDG_CACHE_HOME ? resolve$3(process.env.XDG_CACHE_HOME, "c12", cloneName) : resolve$3(homedir(), ".cache/c12", cloneName);
		if (existsSync(cloneDir) && !sourceOptions.install) await rm(cloneDir, { recursive: true });
		source = (await downloadTemplate(source, {
			dir: cloneDir,
			install: sourceOptions.install,
			force: sourceOptions.install,
			auth: sourceOptions.auth,
			...options.giget,
			...sourceOptions.giget
		})).dir;
	}
	if (NPM_PACKAGE_RE.test(source)) source = tryResolve(source, options) || source;
	const ext = extname$2(source);
	const isDir = !ext || ext === basename$2(source);
	const cwd = resolve$3(options.cwd, isDir ? source : dirname$2(source));
	if (isDir) source = options.configFile;
	const res = {
		config: void 0,
		configFile: void 0,
		cwd,
		source,
		sourceOptions
	};
	res.configFile = tryResolve(resolve$3(cwd, source), options) || tryResolve(resolve$3(cwd, ".config", source.replace(/\.config$/, "")), options) || tryResolve(resolve$3(cwd, ".config", source), options) || source;
	if (!existsSync(res.configFile)) return res;
	res._configFile = res.configFile;
	const configFileExt = extname$2(res.configFile) || "";
	if (configFileExt in ASYNC_LOADERS) res.config = (await ASYNC_LOADERS[configFileExt]())(await readFile(res.configFile, "utf8"));
	else {
		const _resolveModule = options.resolveModule || ((mod) => mod.default || mod);
		if (options.import) res.config = _resolveModule(await options.import(res.configFile));
		else res.config = await import(res.configFile).then(_resolveModule, async (error) => {
			const { createJiti } = await import("jiti").catch(() => {
				throw new Error(`Failed to load config file \`${res.configFile}\`: ${error?.message}.  Hint install \`jiti\` for compatibility.`, { cause: error });
			});
			const jiti = createJiti(join$2(options.cwd || ".", options.configFile || "/"), {
				interopDefault: true,
				moduleCache: false,
				extensions: [...SUPPORTED_EXTENSIONS]
			});
			options.import = (id) => jiti.import(id);
			return _resolveModule(await options.import(res.configFile));
		});
	}
	if (typeof res.config === "function") res.config = await res.config(options.context);
	if (options.envName) {
		const envConfig = {
			...res.config["$" + options.envName],
			...res.config.$env?.[options.envName]
		};
		if (Object.keys(envConfig).length > 0) res.config = _merger(envConfig, res.config);
	}
	res.meta = defu(res.sourceOptions.meta, res.config.$meta);
	delete res.config.$meta;
	if (res.sourceOptions.overrides) res.config = _merger(res.sourceOptions.overrides, res.config);
	res.configFile = _normalize(res.configFile);
	res.source = _normalize(res.source);
	return res;
}
function tryResolve(id, options) {
	const res = resolveModulePath(id, {
		try: true,
		from: pathToFileURL(join$2(options.cwd || ".", options.configFile || "/")),
		suffixes: ["", "/index"],
		extensions: SUPPORTED_EXTENSIONS,
		cache: false
	});
	return res ? normalize$2(res) : void 0;
}
const eventMap = {
	add: "created",
	change: "updated",
	unlink: "removed"
};
async function watchConfig(options) {
	let config = await loadConfig(options);
	const configName = options.name || "config";
	const configFileName = options.configFile ?? (options.name === "config" ? "config" : `${options.name}.config`);
	const watchingFiles = [...new Set((config.layers || []).filter((l) => l.cwd).flatMap((l) => [
		...SUPPORTED_EXTENSIONS.flatMap((ext) => [
			resolve$3(l.cwd, configFileName + ext),
			resolve$3(l.cwd, ".config", configFileName + ext),
			resolve$3(l.cwd, ".config", configFileName.replace(/\.config$/, "") + ext)
		]),
		l.source && resolve$3(l.cwd, l.source),
		options.rcFile && resolve$3(l.cwd, typeof options.rcFile === "string" ? options.rcFile : `.${configName}rc`),
		options.packageJson && resolve$3(l.cwd, "package.json")
	]).filter(Boolean))];
	const watch = await Promise.resolve().then(() => chokidar_exports).then((r) => r.watch || r.default || r);
	const { diff } = await Promise.resolve().then(() => ohash_exports).then((n) => n.t);
	const _fswatcher = watch(watchingFiles, {
		ignoreInitial: true,
		...options.chokidarOptions
	});
	const onChange = async (event, path) => {
		const type = eventMap[event];
		if (!type) return;
		if (options.onWatch) await options.onWatch({
			type,
			path
		});
		const oldConfig = config;
		try {
			config = await loadConfig(options);
		} catch (error) {
			console.warn(`Failed to load config ${path}\n${error}`);
			return;
		}
		const changeCtx = {
			newConfig: config,
			oldConfig,
			getDiff: () => diff(oldConfig.config, config.config)
		};
		if (options.acceptHMR) {
			if (await options.acceptHMR(changeCtx)) return;
		}
		if (options.onUpdate) await options.onUpdate(changeCtx);
	};
	if (options.debounce === false) _fswatcher.on("all", onChange);
	else _fswatcher.on("all", debounce$1(onChange, options.debounce ?? 100));
	const utils = {
		watchingFiles,
		unwatch: async () => {
			await _fswatcher.close();
		}
	};
	return new Proxy(utils, { get(_, prop) {
		if (prop in utils) return utils[prop];
		return config[prop];
	} });
}
const platforms = [
	"aws",
	"azure",
	"cloudflare",
	"deno",
	"firebase",
	"netlify",
	"vercel"
];
function resolveCompatibilityDates(input, defaults) {
	const dates = { default: "" };
	const _defaults = typeof defaults === "string" ? { default: defaults } : defaults || {};
	for (const [key, value] of Object.entries(_defaults)) if (value) dates[key] = formatDate(value);
	const _input = typeof input === "string" ? { default: input } : input || {};
	for (const [key, value] of Object.entries(_input)) if (value) dates[key] = formatDate(value);
	dates.default = formatDate(dates.default || "") || Object.values(dates).sort().pop() || "";
	return dates;
}
function resolveCompatibilityDatesFromEnv(overridesInput) {
	const defaults = { default: process.env.COMPATIBILITY_DATE ? formatDate(process.env.COMPATIBILITY_DATE) : void 0 };
	for (const platform of platforms) {
		const envName = `COMPATIBILITY_DATE_${platform.toUpperCase()}`;
		const env = process.env[envName];
		if (env) defaults[platform] = formatDate(env);
	}
	return resolveCompatibilityDates(overridesInput, defaults);
}
function formatCompatibilityDate(input) {
	const dates = resolveCompatibilityDates(input);
	if (Object.entries(dates).length === 0) return "-";
	return [`${dates["default"]}`, ...Object.entries(dates).filter(([key, value]) => key !== "default" && value && value !== dates["default"]).map(([key, value]) => `${key}: ${value}`)].join(", ");
}
function formatDate(date) {
	const d = normalizeDate(date);
	if (Number.isNaN(d.getDate())) return "";
	return `${d.getFullYear().toString()}-${(d.getMonth() + 1).toString().padStart(2, "0")}-${d.getDate().toString().padStart(2, "0")}`;
}
function normalizeDate(date) {
	if (date instanceof Date) return date;
	if (date === "latest") return /* @__PURE__ */ new Date();
	return new Date(date);
}
function set(obj, key, val) {
	if (typeof val.value === "object") val.value = klona(val.value);
	if (!val.enumerable || val.get || val.set || !val.configurable || !val.writable || key === "__proto__") Object.defineProperty(obj, key, val);
	else obj[key] = val.value;
}
function klona(x) {
	if (typeof x !== "object") return x;
	var i = 0, k, list, tmp, str = Object.prototype.toString.call(x);
	if (str === "[object Object]") tmp = Object.create(x.__proto__ || null);
	else if (str === "[object Array]") tmp = Array(x.length);
	else if (str === "[object Set]") {
		tmp = /* @__PURE__ */ new Set();
		x.forEach(function(val) {
			tmp.add(klona(val));
		});
	} else if (str === "[object Map]") {
		tmp = /* @__PURE__ */ new Map();
		x.forEach(function(val, key) {
			tmp.set(klona(key), klona(val));
		});
	} else if (str === "[object Date]") tmp = /* @__PURE__ */ new Date(+x);
	else if (str === "[object RegExp]") tmp = new RegExp(x.source, x.flags);
	else if (str === "[object DataView]") tmp = new x.constructor(klona(x.buffer));
	else if (str === "[object ArrayBuffer]") tmp = x.slice(0);
	else if (str.slice(-6) === "Array]") tmp = new x.constructor(x);
	if (tmp) {
		for (list = Object.getOwnPropertySymbols(x); i < list.length; i++) set(tmp, list[i], Object.getOwnPropertyDescriptor(x, list[i]));
		for (i = 0, list = Object.getOwnPropertyNames(x); i < list.length; i++) {
			if (Object.hasOwnProperty.call(tmp, k = list[i]) && tmp[k] === x[k]) continue;
			set(tmp, k, Object.getOwnPropertyDescriptor(x, k));
		}
	}
	return tmp || x;
}
function escapeStringRegexp(string) {
	if (typeof string !== "string") throw new TypeError("Expected a string");
	return string.replace(/[|\\{}()[\]^$+*?.]/g, "\\$&").replace(/-/g, "\\x2d");
}
const POSIX_SEP_RE = new RegExp("\\" + path.posix.sep, "g");
const NATIVE_SEP_RE = new RegExp("\\" + path.sep, "g");
const PATTERN_REGEX_CACHE = /* @__PURE__ */ new Map();
const GLOB_ALL_PATTERN = `**/*`;
const TS_EXTENSIONS = [
	".ts",
	".tsx",
	".mts",
	".cts"
];
const TSJS_EXTENSIONS = TS_EXTENSIONS.concat([
	".js",
	".jsx",
	".mjs",
	".cjs"
]);
const TS_EXTENSIONS_RE_GROUP = `\\.(?:${TS_EXTENSIONS.map((ext) => ext.substring(1)).join("|")})`;
const TSJS_EXTENSIONS_RE_GROUP = `\\.(?:${TSJS_EXTENSIONS.map((ext) => ext.substring(1)).join("|")})`;
const IS_POSIX = path.posix.sep === path.sep;
function makePromise() {
	let resolve, reject;
	return {
		promise: new Promise((res, rej) => {
			resolve = res;
			reject = rej;
		}),
		resolve,
		reject
	};
}
async function resolveTSConfigJson(filename, cache) {
	if (path.extname(filename) !== ".json") return;
	const tsconfig = path.resolve(filename);
	if (cache && (cache.hasParseResult(tsconfig) || cache.hasParseResult(filename))) return tsconfig;
	return promises.stat(tsconfig).then((stat) => {
		if (stat.isFile() || stat.isFIFO()) return tsconfig;
		else throw new Error(`${filename} exists but is not a regular file.`);
	});
}
const isInNodeModules = IS_POSIX ? (dir) => dir.includes("/node_modules/") : (dir) => dir.match(/[/\\]node_modules[/\\]/);
const posix2native = IS_POSIX ? (filename) => filename : (filename) => filename.replace(POSIX_SEP_RE, path.sep);
const native2posix = IS_POSIX ? (filename) => filename : (filename) => filename.replace(NATIVE_SEP_RE, path.posix.sep);
const resolve2posix = IS_POSIX ? (dir, filename) => dir ? path.resolve(dir, filename) : path.resolve(filename) : (dir, filename) => native2posix(dir ? path.resolve(posix2native(dir), posix2native(filename)) : path.resolve(posix2native(filename)));
function resolveReferencedTSConfigFiles(result, options) {
	const dir = path.dirname(result.tsconfigFile);
	return result.tsconfig.references.map((ref) => {
		return resolve2posix(dir, ref.path.endsWith(".json") ? ref.path : path.join(ref.path, options?.configName ?? "tsconfig.json"));
	});
}
function resolveSolutionTSConfig(filename, result) {
	const extensions = result.tsconfig.compilerOptions?.allowJs ? TSJS_EXTENSIONS : TS_EXTENSIONS;
	if (result.referenced && extensions.some((ext) => filename.endsWith(ext)) && !isIncluded(filename, result)) {
		const solutionTSConfig = result.referenced.find((referenced) => isIncluded(filename, referenced));
		if (solutionTSConfig) return solutionTSConfig;
	}
	return result;
}
function isIncluded(filename, result) {
	const dir = native2posix(path.dirname(result.tsconfigFile));
	const files = (result.tsconfig.files || []).map((file) => resolve2posix(dir, file));
	const absoluteFilename = resolve2posix(null, filename);
	if (files.includes(filename)) return true;
	const allowJs = result.tsconfig.compilerOptions?.allowJs;
	if (isGlobMatch(absoluteFilename, dir, result.tsconfig.include || (result.tsconfig.files ? [] : [GLOB_ALL_PATTERN]), allowJs)) return !isGlobMatch(absoluteFilename, dir, result.tsconfig.exclude || [], allowJs);
	return false;
}
function isGlobMatch(filename, dir, patterns, allowJs) {
	const extensions = allowJs ? TSJS_EXTENSIONS : TS_EXTENSIONS;
	return patterns.some((pattern) => {
		let lastWildcardIndex = pattern.length;
		let hasWildcard = false;
		let hasExtension = false;
		let hasSlash = false;
		let lastSlashIndex = -1;
		for (let i = pattern.length - 1; i > -1; i--) {
			const c = pattern[i];
			if (!hasWildcard) {
				if (c === "*" || c === "?") {
					lastWildcardIndex = i;
					hasWildcard = true;
				}
			}
			if (!hasSlash) {
				if (c === ".") hasExtension = true;
				else if (c === "/") {
					lastSlashIndex = i;
					hasSlash = true;
				}
			}
			if (hasWildcard && hasSlash) break;
		}
		if (!hasExtension && (!hasWildcard || lastWildcardIndex < lastSlashIndex)) {
			pattern += `${pattern.endsWith("/") ? "" : "/"}${GLOB_ALL_PATTERN}`;
			lastWildcardIndex = pattern.length - 1;
			hasWildcard = true;
		}
		if (lastWildcardIndex < pattern.length - 1 && !filename.endsWith(pattern.slice(lastWildcardIndex + 1))) return false;
		if (pattern.endsWith("*") && !extensions.some((ext) => filename.endsWith(ext))) return false;
		if (pattern === GLOB_ALL_PATTERN) return filename.startsWith(`${dir}/`);
		const resolvedPattern = resolve2posix(dir, pattern);
		let firstWildcardIndex = -1;
		for (let i = 0; i < resolvedPattern.length; i++) if (resolvedPattern[i] === "*" || resolvedPattern[i] === "?") {
			firstWildcardIndex = i;
			hasWildcard = true;
			break;
		}
		if (firstWildcardIndex > 1 && !filename.startsWith(resolvedPattern.slice(0, firstWildcardIndex - 1))) return false;
		if (!hasWildcard) return filename === resolvedPattern;
		else if (firstWildcardIndex + GLOB_ALL_PATTERN.length === resolvedPattern.length - (pattern.length - 1 - lastWildcardIndex) && resolvedPattern.slice(firstWildcardIndex, firstWildcardIndex + GLOB_ALL_PATTERN.length) === GLOB_ALL_PATTERN) return true;
		if (PATTERN_REGEX_CACHE.has(resolvedPattern)) return PATTERN_REGEX_CACHE.get(resolvedPattern).test(filename);
		const regex = pattern2regex(resolvedPattern, allowJs);
		PATTERN_REGEX_CACHE.set(resolvedPattern, regex);
		return regex.test(filename);
	});
}
function pattern2regex(resolvedPattern, allowJs) {
	let regexStr = "^";
	for (let i = 0; i < resolvedPattern.length; i++) {
		const char = resolvedPattern[i];
		if (char === "?") {
			regexStr += "[^\\/]";
			continue;
		}
		if (char === "*") {
			if (resolvedPattern[i + 1] === "*" && resolvedPattern[i + 2] === "/") {
				i += 2;
				regexStr += "(?:[^\\/]*\\/)*";
				continue;
			}
			regexStr += "[^\\/]*";
			continue;
		}
		if ("/.+^${}()|[]\\".includes(char)) regexStr += `\\`;
		regexStr += char;
	}
	if (resolvedPattern.endsWith("*")) regexStr += allowJs ? TSJS_EXTENSIONS_RE_GROUP : TS_EXTENSIONS_RE_GROUP;
	regexStr += "$";
	return new RegExp(regexStr);
}
function replaceTokens(result) {
	if (result.tsconfig) result.tsconfig = JSON.parse(JSON.stringify(result.tsconfig).replaceAll(/"\${configDir}/g, `"${native2posix(path.dirname(result.tsconfigFile))}`));
}
async function find(filename, options) {
	let dir = path.dirname(path.resolve(filename));
	if (options?.ignoreNodeModules && isInNodeModules(dir)) return null;
	const cache = options?.cache;
	const configName = options?.configName ?? "tsconfig.json";
	if (cache?.hasConfigPath(dir, configName)) return cache.getConfigPath(dir, configName);
	const { promise, resolve, reject } = makePromise();
	if (options?.root && !path.isAbsolute(options.root)) options.root = path.resolve(options.root);
	findUp(dir, {
		promise,
		resolve,
		reject
	}, options);
	return promise;
}
function findUp(dir, { resolve, reject, promise }, options) {
	const { cache, root, configName } = options ?? {};
	if (cache) if (cache.hasConfigPath(dir, configName)) {
		let cached;
		try {
			cached = cache.getConfigPath(dir, configName);
		} catch (e) {
			reject(e);
			return;
		}
		if (cached?.then) cached.then(resolve).catch(reject);
		else resolve(cached);
	} else cache.setConfigPath(dir, promise, configName);
	const tsconfig = path.join(dir, options?.configName ?? "tsconfig.json");
	fs.stat(tsconfig, (err, stats) => {
		if (stats && (stats.isFile() || stats.isFIFO())) resolve(tsconfig);
		else if (err?.code !== "ENOENT") reject(err);
		else {
			let parent;
			if (root === dir || (parent = path.dirname(dir)) === dir) resolve(null);
			else findUp(parent, {
				promise,
				resolve,
				reject
			}, options);
		}
	});
}
path.sep;
function toJson(tsconfigJson) {
	const stripped = stripDanglingComma(stripJsonComments(stripBom(tsconfigJson)));
	if (stripped.trim() === "") return "{}";
	else return stripped;
}
function stripDanglingComma(pseudoJson) {
	let insideString = false;
	let offset = 0;
	let result = "";
	let danglingCommaPos = null;
	for (let i = 0; i < pseudoJson.length; i++) {
		const currentCharacter = pseudoJson[i];
		if (currentCharacter === "\"") {
			if (!isEscaped(pseudoJson, i)) insideString = !insideString;
		}
		if (insideString) {
			danglingCommaPos = null;
			continue;
		}
		if (currentCharacter === ",") {
			danglingCommaPos = i;
			continue;
		}
		if (danglingCommaPos) {
			if (currentCharacter === "}" || currentCharacter === "]") {
				result += pseudoJson.slice(offset, danglingCommaPos) + " ";
				offset = danglingCommaPos + 1;
				danglingCommaPos = null;
			} else if (!currentCharacter.match(/\s/)) danglingCommaPos = null;
		}
	}
	return result + pseudoJson.substring(offset);
}
function isEscaped(jsonString, quotePosition) {
	let index = quotePosition - 1;
	let backslashCount = 0;
	while (jsonString[index] === "\\") {
		index -= 1;
		backslashCount += 1;
	}
	return Boolean(backslashCount % 2);
}
function strip(string, start, end) {
	return string.slice(start, end).replace(/\S/g, " ");
}
const singleComment = Symbol("singleComment");
const multiComment = Symbol("multiComment");
function stripJsonComments(jsonString) {
	let isInsideString = false;
	let isInsideComment = false;
	let offset = 0;
	let result = "";
	for (let index = 0; index < jsonString.length; index++) {
		const currentCharacter = jsonString[index];
		const nextCharacter = jsonString[index + 1];
		if (!isInsideComment && currentCharacter === "\"") {
			if (!isEscaped(jsonString, index)) isInsideString = !isInsideString;
		}
		if (isInsideString) continue;
		if (!isInsideComment && currentCharacter + nextCharacter === "//") {
			result += jsonString.slice(offset, index);
			offset = index;
			isInsideComment = singleComment;
			index++;
		} else if (isInsideComment === singleComment && currentCharacter + nextCharacter === "\r\n") {
			index++;
			isInsideComment = false;
			result += strip(jsonString, offset, index);
			offset = index;
		} else if (isInsideComment === singleComment && currentCharacter === "\n") {
			isInsideComment = false;
			result += strip(jsonString, offset, index);
			offset = index;
		} else if (!isInsideComment && currentCharacter + nextCharacter === "/*") {
			result += jsonString.slice(offset, index);
			offset = index;
			isInsideComment = multiComment;
			index++;
		} else if (isInsideComment === multiComment && currentCharacter + nextCharacter === "*/") {
			index++;
			isInsideComment = false;
			result += strip(jsonString, offset, index + 1);
			offset = index + 1;
		}
	}
	return result + (isInsideComment ? strip(jsonString.slice(offset)) : jsonString.slice(offset));
}
function stripBom(string) {
	if (string.charCodeAt(0) === 65279) return string.slice(1);
	return string;
}
const not_found_result = {
	tsconfigFile: null,
	tsconfig: {}
};
async function parse$2(filename, options) {
	const cache = options?.cache;
	if (cache?.hasParseResult(filename)) return getParsedDeep(filename, cache, options);
	const { resolve, reject, promise } = makePromise();
	cache?.setParseResult(filename, promise, true);
	try {
		let tsconfigFile = await resolveTSConfigJson(filename, cache) || await find(filename, options);
		if (!tsconfigFile) {
			resolve(not_found_result);
			return promise;
		}
		let result;
		if (filename !== tsconfigFile && cache?.hasParseResult(tsconfigFile)) result = await getParsedDeep(tsconfigFile, cache, options);
		else {
			result = await parseFile(tsconfigFile, cache, filename === tsconfigFile);
			await Promise.all([parseExtends(result, cache), parseReferences(result, options)]);
		}
		replaceTokens(result);
		resolve(resolveSolutionTSConfig(filename, result));
	} catch (e) {
		reject(e);
	}
	return promise;
}
async function getParsedDeep(filename, cache, options) {
	const result = await cache.getParseResult(filename);
	if (result.tsconfig.extends && !result.extended || result.tsconfig.references && !result.referenced) {
		const promise = Promise.all([parseExtends(result, cache), parseReferences(result, options)]).then(() => result);
		cache.setParseResult(filename, promise, true);
		return promise;
	}
	return result;
}
async function parseFile(tsconfigFile, cache, skipCache) {
	if (!skipCache && cache?.hasParseResult(tsconfigFile) && !cache.getParseResult(tsconfigFile)._isRootFile_) return cache.getParseResult(tsconfigFile);
	const promise = promises.readFile(tsconfigFile, "utf-8").then(toJson).then((json) => {
		const parsed = JSON.parse(json);
		applyDefaults(parsed, tsconfigFile);
		return {
			tsconfigFile,
			tsconfig: normalizeTSConfig(parsed, path.dirname(tsconfigFile))
		};
	}).catch((e) => {
		throw new TSConfckParseError(`parsing ${tsconfigFile} failed: ${e}`, "PARSE_FILE", tsconfigFile, e);
	});
	if (!skipCache && (!cache?.hasParseResult(tsconfigFile) || !cache.getParseResult(tsconfigFile)._isRootFile_)) cache?.setParseResult(tsconfigFile, promise);
	return promise;
}
function normalizeTSConfig(tsconfig, dir) {
	const baseUrl = tsconfig.compilerOptions?.baseUrl;
	if (baseUrl && !baseUrl.startsWith("${") && !path.isAbsolute(baseUrl)) tsconfig.compilerOptions.baseUrl = resolve2posix(dir, baseUrl);
	return tsconfig;
}
async function parseReferences(result, options) {
	if (!result.tsconfig.references) return;
	const referencedFiles = resolveReferencedTSConfigFiles(result, options);
	const referenced = await Promise.all(referencedFiles.map((file) => parseFile(file, options?.cache)));
	await Promise.all(referenced.map((ref) => parseExtends(ref, options?.cache)));
	referenced.forEach((ref) => {
		ref.solution = result;
		replaceTokens(ref);
	});
	result.referenced = referenced;
}
async function parseExtends(result, cache) {
	if (!result.tsconfig.extends) return;
	const extended = [{
		tsconfigFile: result.tsconfigFile,
		tsconfig: JSON.parse(JSON.stringify(result.tsconfig))
	}];
	let pos = 0;
	const extendsPath = [];
	let currentBranchDepth = 0;
	while (pos < extended.length) {
		const extending = extended[pos];
		extendsPath.push(extending.tsconfigFile);
		if (extending.tsconfig.extends) {
			currentBranchDepth += 1;
			let resolvedExtends;
			if (!Array.isArray(extending.tsconfig.extends)) resolvedExtends = [resolveExtends(extending.tsconfig.extends, extending.tsconfigFile)];
			else resolvedExtends = extending.tsconfig.extends.reverse().map((ex) => resolveExtends(ex, extending.tsconfigFile));
			const circularExtends = resolvedExtends.find((tsconfigFile) => extendsPath.includes(tsconfigFile));
			if (circularExtends) throw new TSConfckParseError(`Circular dependency in "extends": ${extendsPath.concat([circularExtends]).join(" -> ")}`, "EXTENDS_CIRCULAR", result.tsconfigFile);
			extended.splice(pos + 1, 0, ...await Promise.all(resolvedExtends.map((file) => parseFile(file, cache))));
		} else {
			extendsPath.splice(-currentBranchDepth);
			currentBranchDepth = 0;
		}
		pos = pos + 1;
	}
	result.extended = extended;
	for (const ext of result.extended.slice(1)) extendTSConfig(result, ext);
}
function resolveExtends(extended, from) {
	if ([".", ".."].includes(extended)) extended = extended + "/tsconfig.json";
	const req = createRequire$1(from);
	let error;
	try {
		return req.resolve(extended);
	} catch (e) {
		error = e;
	}
	if (extended[0] !== "." && !path.isAbsolute(extended)) try {
		return req.resolve(`${extended}/tsconfig.json`);
	} catch (e) {
		error = e;
	}
	throw new TSConfckParseError(`failed to resolve "extends":"${extended}" in ${from}`, "EXTENDS_RESOLVE", from, error);
}
const EXTENDABLE_KEYS = [
	"compilerOptions",
	"files",
	"include",
	"exclude",
	"watchOptions",
	"compileOnSave",
	"typeAcquisition",
	"buildOptions"
];
function extendTSConfig(extending, extended) {
	const extendingConfig = extending.tsconfig;
	const extendedConfig = extended.tsconfig;
	const relativePath = native2posix(path.relative(path.dirname(extending.tsconfigFile), path.dirname(extended.tsconfigFile)));
	for (const key of Object.keys(extendedConfig).filter((key) => EXTENDABLE_KEYS.includes(key))) if (key === "compilerOptions") {
		if (!extendingConfig.compilerOptions) extendingConfig.compilerOptions = {};
		for (const option of Object.keys(extendedConfig.compilerOptions)) {
			if (Object.prototype.hasOwnProperty.call(extendingConfig.compilerOptions, option)) continue;
			extendingConfig.compilerOptions[option] = rebaseRelative(option, extendedConfig.compilerOptions[option], relativePath);
		}
	} else if (extendingConfig[key] === void 0) if (key === "watchOptions") {
		extendingConfig.watchOptions = {};
		for (const option of Object.keys(extendedConfig.watchOptions)) extendingConfig.watchOptions[option] = rebaseRelative(option, extendedConfig.watchOptions[option], relativePath);
	} else extendingConfig[key] = rebaseRelative(key, extendedConfig[key], relativePath);
}
const REBASE_KEYS = [
	"files",
	"include",
	"exclude",
	"baseUrl",
	"rootDir",
	"rootDirs",
	"typeRoots",
	"outDir",
	"outFile",
	"declarationDir",
	"excludeDirectories",
	"excludeFiles"
];
function rebaseRelative(key, value, prependPath) {
	if (!REBASE_KEYS.includes(key)) return value;
	if (Array.isArray(value)) return value.map((x) => rebasePath(x, prependPath));
	else return rebasePath(value, prependPath);
}
function rebasePath(value, prependPath) {
	if (path.isAbsolute(value) || value.startsWith("${configDir}")) return value;
	else return path.posix.normalize(path.posix.join(prependPath, value));
}
var TSConfckParseError = class TSConfckParseError extends Error {
	code;
	cause;
	tsconfigFile;
	constructor(message, code, tsconfigFile, cause) {
		super(message);
		Object.setPrototypeOf(this, TSConfckParseError.prototype);
		this.name = TSConfckParseError.name;
		this.code = code;
		this.cause = cause;
		this.tsconfigFile = tsconfigFile;
	}
};
function applyDefaults(tsconfig, tsconfigFile) {
	if (isJSConfig(tsconfigFile)) tsconfig.compilerOptions = {
		...DEFAULT_JSCONFIG_COMPILER_OPTIONS,
		...tsconfig.compilerOptions
	};
}
const DEFAULT_JSCONFIG_COMPILER_OPTIONS = {
	allowJs: true,
	maxNodeModuleJsDepth: 2,
	allowSyntheticDefaultImports: true,
	skipLibCheck: true,
	noEmit: true
};
function isJSConfig(configFileName) {
	return path.basename(configFileName) === "jsconfig.json";
}
var TSConfckCache = class {
	clear() {
		this.#configPaths.clear();
		this.#parsed.clear();
	}
	hasConfigPath(dir, configName = "tsconfig.json") {
		return this.#configPaths.has(`${dir}/${configName}`);
	}
	getConfigPath(dir, configName = "tsconfig.json") {
		const key = `${dir}/${configName}`;
		const value = this.#configPaths.get(key);
		if (value == null || value.length || value.then) return value;
		else throw value;
	}
	hasParseResult(file) {
		return this.#parsed.has(file);
	}
	getParseResult(file) {
		const value = this.#parsed.get(file);
		if (value.then || value.tsconfig) return value;
		else throw value;
	}
	setParseResult(file, result, isRootFile = false) {
		Object.defineProperty(result, "_isRootFile_", {
			value: isRootFile,
			writable: false,
			enumerable: false,
			configurable: false
		});
		this.#parsed.set(file, result);
		result.then((parsed) => {
			if (this.#parsed.get(file) === result) this.#parsed.set(file, parsed);
		}).catch((e) => {
			if (this.#parsed.get(file) === result) this.#parsed.set(file, e);
		});
	}
	setConfigPath(dir, configPath, configName = "tsconfig.json") {
		const key = `${dir}/${configName}`;
		this.#configPaths.set(key, configPath);
		configPath.then((path) => {
			if (this.#configPaths.get(key) === configPath) this.#configPaths.set(key, path);
		}).catch((e) => {
			if (this.#configPaths.get(key) === configPath) this.#configPaths.set(key, e);
		});
	}
	#configPaths = /* @__PURE__ */ new Map();
	#parsed = /* @__PURE__ */ new Map();
};
const NullProtoObj = /* @__PURE__ */ (() => {
	const e = function() {};
	return e.prototype = Object.create(null), Object.freeze(e.prototype), e;
})();
function createRouter() {
	return {
		root: { key: "" },
		static: new NullProtoObj()
	};
}
function splitPath(path) {
	const [_, ...s] = path.split("/");
	return s[s.length - 1] === "" ? s.slice(0, -1) : s;
}
function getMatchParams(segments, paramsMap) {
	const params = new NullProtoObj();
	for (const [index, name] of paramsMap) {
		const segment = index < 0 ? segments.slice(-(index + 1)).join("/") : segments[index];
		if (typeof name === "string") params[name] = segment;
		else {
			const match = segment.match(name);
			if (match) for (const key in match.groups) params[key] = match.groups[key];
		}
	}
	return params;
}
function addRoute(ctx, method = "", path, data) {
	method = method.toUpperCase();
	if (path.charCodeAt(0) !== 47) path = `/${path}`;
	path = path.replace(/\\:/g, "%3A");
	const segments = splitPath(path);
	let node = ctx.root;
	let _unnamedParamIndex = 0;
	const paramsMap = [];
	const paramsRegexp = [];
	for (let i = 0; i < segments.length; i++) {
		let segment = segments[i];
		if (segment.startsWith("**")) {
			if (!node.wildcard) node.wildcard = { key: "**" };
			node = node.wildcard;
			paramsMap.push([
				-(i + 1),
				segment.split(":")[1] || "_",
				segment.length === 2
			]);
			break;
		}
		if (segment === "*" || segment.includes(":")) {
			if (!node.param) node.param = { key: "*" };
			node = node.param;
			if (segment === "*") paramsMap.push([
				i,
				`_${_unnamedParamIndex++}`,
				true
			]);
			else if (segment.includes(":", 1)) {
				const regexp = getParamRegexp(segment);
				paramsRegexp[i] = regexp;
				node.hasRegexParam = true;
				paramsMap.push([
					i,
					regexp,
					false
				]);
			} else paramsMap.push([
				i,
				segment.slice(1),
				false
			]);
			continue;
		}
		if (segment === "\\*") segment = segments[i] = "*";
		else if (segment === "\\*\\*") segment = segments[i] = "**";
		const child = node.static?.[segment];
		if (child) node = child;
		else {
			const staticNode = { key: segment };
			if (!node.static) node.static = new NullProtoObj();
			node.static[segment] = staticNode;
			node = staticNode;
		}
	}
	const hasParams = paramsMap.length > 0;
	if (!node.methods) node.methods = new NullProtoObj();
	node.methods[method] ??= [];
	node.methods[method].push({
		data: data || null,
		paramsRegexp,
		paramsMap: hasParams ? paramsMap : void 0
	});
	if (!hasParams) ctx.static["/" + segments.join("/")] = node;
}
function getParamRegexp(segment) {
	const regex = segment.replace(/:(\w+)/g, (_, id) => `(?<${id}>[^/]+)`).replace(/\./g, "\\.");
	return /* @__PURE__ */ new RegExp(`^${regex}$`);
}
function findRoute(ctx, method = "", path, opts) {
	if (path.charCodeAt(path.length - 1) === 47) path = path.slice(0, -1);
	const staticNode = ctx.static[path];
	if (staticNode && staticNode.methods) {
		const staticMatch = staticNode.methods[method] || staticNode.methods[""];
		if (staticMatch !== void 0) return staticMatch[0];
	}
	const segments = splitPath(path);
	const match = _lookupTree(ctx, ctx.root, method, segments, 0)?.[0];
	if (match === void 0) return;
	if (opts?.params === false) return match;
	return {
		data: match.data,
		params: match.paramsMap ? getMatchParams(segments, match.paramsMap) : void 0
	};
}
function _lookupTree(ctx, node, method, segments, index) {
	if (index === segments.length) {
		if (node.methods) {
			const match = node.methods[method] || node.methods[""];
			if (match) return match;
		}
		if (node.param && node.param.methods) {
			const match = node.param.methods[method] || node.param.methods[""];
			if (match) {
				const pMap = match[0].paramsMap;
				if (pMap?.[pMap?.length - 1]?.[2]) return match;
			}
		}
		if (node.wildcard && node.wildcard.methods) {
			const match = node.wildcard.methods[method] || node.wildcard.methods[""];
			if (match) {
				const pMap = match[0].paramsMap;
				if (pMap?.[pMap?.length - 1]?.[2]) return match;
			}
		}
		return;
	}
	const segment = segments[index];
	if (node.static) {
		const staticChild = node.static[segment];
		if (staticChild) {
			const match = _lookupTree(ctx, staticChild, method, segments, index + 1);
			if (match) return match;
		}
	}
	if (node.param) {
		const match = _lookupTree(ctx, node.param, method, segments, index + 1);
		if (match) {
			if (node.param.hasRegexParam) {
				const exactMatch = match.find((m) => m.paramsRegexp[index]?.test(segment)) || match.find((m) => !m.paramsRegexp[index]);
				return exactMatch ? [exactMatch] : void 0;
			}
			return match;
		}
	}
	if (node.wildcard && node.wildcard.methods) return node.wildcard.methods[method] || node.wildcard.methods[""];
}
function findAllRoutes(ctx, method = "", path, opts) {
	if (path.charCodeAt(path.length - 1) === 47) path = path.slice(0, -1);
	const segments = splitPath(path);
	const matches = _findAll(ctx, ctx.root, method, segments, 0);
	if (opts?.params === false) return matches;
	return matches.map((m) => {
		return {
			data: m.data,
			params: m.paramsMap ? getMatchParams(segments, m.paramsMap) : void 0
		};
	});
}
function _findAll(ctx, node, method, segments, index, matches = []) {
	const segment = segments[index];
	if (node.wildcard && node.wildcard.methods) {
		const match = node.wildcard.methods[method] || node.wildcard.methods[""];
		if (match) matches.push(...match);
	}
	if (node.param) {
		_findAll(ctx, node.param, method, segments, index + 1, matches);
		if (index === segments.length && node.param.methods) {
			const match = node.param.methods[method] || node.param.methods[""];
			if (match) {
				const pMap = match[0].paramsMap;
				if (pMap?.[pMap?.length - 1]?.[2]) matches.push(...match);
			}
		}
	}
	const staticChild = node.static?.[segment];
	if (staticChild) _findAll(ctx, staticChild, method, segments, index + 1, matches);
	if (index === segments.length && node.methods) {
		const match = node.methods[method] || node.methods[""];
		if (match) matches.push(...match);
	}
	return matches;
}
function compileRouterToString(router, functionName, opts) {
	const ctx = {
		opts: opts || {},
		router,
		data: [],
		compileToString: true
	};
	let compiled = `(m,p)=>{${compileRouteMatch(ctx)}}`;
	if (ctx.data.length > 0) compiled = `/* @__PURE__ */ (() => { ${`const ${ctx.data.map((v, i) => `$${i}=${v}`).join(",")};`}; return ${compiled}})()`;
	return functionName ? `const ${functionName}=${compiled};` : compiled;
}
function compileRouteMatch(ctx) {
	let code = "";
	const staticNodes = /* @__PURE__ */ new Set();
	for (const key in ctx.router.static) {
		const node = ctx.router.static[key];
		if (node?.methods) {
			staticNodes.add(node);
			code += `if(p===${JSON.stringify(key.replace(/\/$/, "") || "/")}){${compileMethodMatch(ctx, node.methods, [], -1)}}`;
		}
	}
	const match = compileNode(ctx, ctx.router.root, [], 0, staticNodes);
	if (match) code += `let s=p.split("/"),l=s.length-1;${match}`;
	if (!code) return ctx.opts?.matchAll ? `return [];` : "";
	return `${ctx.opts?.matchAll ? `let r=[];` : ""}if(p.charCodeAt(p.length-1)===47)p=p.slice(0,-1)||"/";${code}${ctx.opts?.matchAll ? "return r;" : ""}`;
}
function compileMethodMatch(ctx, methods, params, currentIdx) {
	let code = "";
	for (const key in methods) {
		const matchers = methods[key];
		if (matchers && matchers?.length > 0) {
			if (key !== "") code += `if(m==="${key}")${matchers.length > 1 ? "{" : ""}`;
			const _matchers = matchers.map((m) => compileFinalMatch(ctx, m, currentIdx, params)).sort((a, b) => b.weight - a.weight);
			for (const matcher of _matchers) code += matcher.code;
			if (key !== "") code += matchers.length > 1 ? "}" : "";
		}
	}
	return code;
}
function compileFinalMatch(ctx, data, currentIdx, params) {
	let ret = `{data:${serializeData(ctx, data.data)}`;
	const conditions = [];
	const { paramsMap, paramsRegexp } = data;
	if (paramsMap && paramsMap.length > 0) {
		if (!paramsMap[paramsMap.length - 1][2] && currentIdx !== -1) conditions.push(`l>=${currentIdx}`);
		for (let i = 0; i < paramsRegexp.length; i++) {
			const regexp = paramsRegexp[i];
			if (!regexp) continue;
			conditions.push(`${regexp.toString()}.test(s[${i + 1}])`);
		}
		ret += ",params:{";
		for (let i = 0; i < paramsMap.length; i++) {
			const map = paramsMap[i];
			ret += typeof map[1] === "string" ? `${JSON.stringify(map[1])}:${params[i]},` : `...(${map[1].toString()}.exec(${params[i]}))?.groups,`;
		}
		ret += "}";
	}
	return {
		code: (conditions.length > 0 ? `if(${conditions.join("&&")})` : "") + (ctx.opts?.matchAll ? `r.unshift(${ret}});` : `return ${ret}};`),
		weight: conditions.length
	};
}
function compileNode(ctx, node, params, startIdx, staticNodes) {
	let code = "";
	if (node.methods && !staticNodes.has(node)) {
		const match = compileMethodMatch(ctx, node.methods, params, node.key === "*" ? startIdx : -1);
		if (match) {
			const hasLastOptionalParam = node.key === "*";
			code += `if(l===${startIdx}${hasLastOptionalParam ? `||l===${startIdx - 1}` : ""}){${match}}`;
		}
	}
	if (node.static) for (const key in node.static) {
		const match = compileNode(ctx, node.static[key], params, startIdx + 1, staticNodes);
		if (match) code += `if(s[${startIdx + 1}]===${JSON.stringify(key)}){${match}}`;
	}
	if (node.param) {
		const match = compileNode(ctx, node.param, [...params, `s[${startIdx + 1}]`], startIdx + 1, staticNodes);
		if (match) code += match;
	}
	if (node.wildcard) {
		const { wildcard } = node;
		if (wildcard.static || wildcard.param || wildcard.wildcard) throw new Error("Compiler mode does not support patterns after wildcard");
		if (wildcard.methods) {
			const match = compileMethodMatch(ctx, wildcard.methods, [...params, `s.slice(${startIdx + 1}).join('/')`], startIdx);
			if (match) code += match;
		}
	}
	return code;
}
function serializeData(ctx, value) {
	if (ctx.compileToString) if (ctx.opts?.serialize) value = ctx.opts.serialize(value);
	else if (typeof value?.toJSON === "function") value = value.toJSON();
	else value = JSON.stringify(value);
	let index = ctx.data.indexOf(value);
	if (index === -1) {
		ctx.data.push(value);
		index = ctx.data.length - 1;
	}
	return `$${index}`;
}
var dist_exports$3 = /* @__PURE__ */ __exportAll$1({
	ProxyServer: () => ProxyServer,
	createProxyServer: () => createProxyServer
});
const upgradeHeader = /(^|,)\s*upgrade\s*($|,)/i;
const isSSL = /^https|wss/;
function setupOutgoing(outgoing, options, req, forward) {
	outgoing.port = options[forward || "target"].port || (isSSL.test(options[forward || "target"].protocol ?? "http") ? 443 : 80);
	for (const e of [
		"host",
		"hostname",
		"socketPath",
		"pfx",
		"key",
		"passphrase",
		"cert",
		"ca",
		"ciphers",
		"secureProtocol"
	]) outgoing[e] = options[forward || "target"][e];
	outgoing.method = options.method || req.method;
	outgoing.headers = { ...req.headers };
	if (options.headers) outgoing.headers = {
		...outgoing.headers,
		...options.headers
	};
	if (options.auth) outgoing.auth = options.auth;
	if (options.ca) outgoing.ca = options.ca;
	if (isSSL.test(options[forward || "target"].protocol ?? "http")) outgoing.rejectUnauthorized = options.secure === void 0 ? true : options.secure;
	outgoing.agent = options.agent || false;
	outgoing.localAddress = options.localAddress;
	if (!outgoing.agent) {
		outgoing.headers = outgoing.headers || {};
		if (typeof outgoing.headers.connection !== "string" || !upgradeHeader.test(outgoing.headers.connection)) outgoing.headers.connection = "close";
	}
	const target = options[forward || "target"];
	const targetPath = target && options.prependPath !== false ? target.pathname || target.path || "" : "";
	const parsed = new URL(req.url, "http://localhost");
	let outgoingPath = options.toProxy ? req.url : parsed.pathname + parsed.search || "";
	outgoingPath = options.ignorePath ? "" : outgoingPath;
	outgoing.path = joinURL(targetPath, outgoingPath);
	if (options.changeOrigin) outgoing.headers.host = requiresPort(outgoing.port, options[forward || "target"].protocol) && !hasPort(outgoing.host) ? outgoing.host + ":" + outgoing.port : outgoing.host ?? void 0;
	return outgoing;
}
function joinURL(base, path) {
	if (!base || base === "/") return path || "/";
	if (!path || path === "/") return base || "/";
	const baseHasTrailing = base[base.length - 1] === "/";
	const pathHasLeading = path[0] === "/";
	if (baseHasTrailing && pathHasLeading) return base + path.slice(1);
	if (!baseHasTrailing && !pathHasLeading) return base + "/" + path;
	return base + path;
}
function setupSocket(socket) {
	socket.setTimeout(0);
	socket.setNoDelay(true);
	socket.setKeepAlive(true, 0);
	return socket;
}
function getPort(req) {
	const res = req.headers.host ? req.headers.host.match(/:(\d+)/) : "";
	if (res) return res[1];
	return hasEncryptedConnection(req) ? "443" : "80";
}
function hasEncryptedConnection(req) {
	return Boolean(req.connection.encrypted || req.connection.pair);
}
function rewriteCookieProperty(header, config, property) {
	if (Array.isArray(header)) return header.map(function(headerElement) {
		return rewriteCookieProperty(headerElement, config, property);
	});
	return header.replace(new RegExp(String.raw`(;\s*` + property + "=)([^;]+)", "i"), function(match, prefix, previousValue) {
		let newValue;
		if (previousValue in config) newValue = config[previousValue];
		else if ("*" in config) newValue = config["*"];
		else return match;
		return newValue ? prefix + newValue : "";
	});
}
function hasPort(host) {
	return host ? !!~host.indexOf(":") : false;
}
function requiresPort(_port, _protocol) {
	const protocol = _protocol?.split(":")[0];
	const port = +_port;
	if (!port) return false;
	switch (protocol) {
		case "http":
		case "ws": return port !== 80;
		case "https":
		case "wss": return port !== 443;
		case "ftp": return port !== 21;
		case "gopher": return port !== 70;
		case "file": return false;
	}
	return port !== 0;
}
function defineProxyMiddleware(m) {
	return m;
}
function defineProxyOutgoingMiddleware(m) {
	return m;
}
const redirectRegex = /^201|30([1278])$/;
const webOutgoingMiddleware = [
	defineProxyOutgoingMiddleware((req, res, proxyRes) => {
		if (req.httpVersion === "1.0") delete proxyRes.headers["transfer-encoding"];
	}),
	defineProxyOutgoingMiddleware((req, res, proxyRes) => {
		if (req.httpVersion === "1.0") proxyRes.headers.connection = req.headers.connection || "close";
		else if (req.httpVersion !== "2.0" && !proxyRes.headers.connection) proxyRes.headers.connection = req.headers.connection || "keep-alive";
	}),
	defineProxyOutgoingMiddleware((req, res, proxyRes, options) => {
		if ((options.hostRewrite || options.autoRewrite || options.protocolRewrite) && proxyRes.headers.location && redirectRegex.test(String(proxyRes.statusCode))) {
			const target = options.target instanceof URL ? options.target : new URL(options.target);
			const u = new URL(proxyRes.headers.location);
			if (target.host !== u.host) return;
			if (options.hostRewrite) u.host = options.hostRewrite;
			else if (options.autoRewrite && req.headers.host) u.host = req.headers.host;
			if (options.protocolRewrite) u.protocol = options.protocolRewrite;
			proxyRes.headers.location = u.toString();
		}
	}),
	defineProxyOutgoingMiddleware((req, res, proxyRes, options) => {
		const rewriteCookieDomainConfig = typeof options.cookieDomainRewrite === "string" ? { "*": options.cookieDomainRewrite } : options.cookieDomainRewrite;
		const rewriteCookiePathConfig = typeof options.cookiePathRewrite === "string" ? { "*": options.cookiePathRewrite } : options.cookiePathRewrite;
		const preserveHeaderKeyCase = options.preserveHeaderKeyCase;
		let rawHeaderKeyMap;
		const setHeader = function(key, header) {
			if (header === void 0) return;
			if (rewriteCookieDomainConfig && key.toLowerCase() === "set-cookie") header = rewriteCookieProperty(header, rewriteCookieDomainConfig, "domain");
			if (rewriteCookiePathConfig && key.toLowerCase() === "set-cookie") header = rewriteCookieProperty(header, rewriteCookiePathConfig, "path");
			res.setHeader(String(key).trim(), header);
		};
		if (preserveHeaderKeyCase && proxyRes.rawHeaders !== void 0) {
			rawHeaderKeyMap = {};
			for (let i = 0; i < proxyRes.rawHeaders.length; i += 2) {
				const key = proxyRes.rawHeaders[i];
				rawHeaderKeyMap[key.toLowerCase()] = key;
			}
		}
		for (let key of Object.keys(proxyRes.headers)) {
			const header = proxyRes.headers[key];
			if (preserveHeaderKeyCase && rawHeaderKeyMap) key = rawHeaderKeyMap[key] || key;
			setHeader(key, header);
		}
	}),
	defineProxyOutgoingMiddleware((req, res, proxyRes) => {
		if (proxyRes.statusMessage) {
			res.statusCode = proxyRes.statusCode;
			res.statusMessage = proxyRes.statusMessage;
		} else res.statusCode = proxyRes.statusCode;
	})
];
const nativeAgents = {
	http,
	https: nodeHTTPS
};
const webIncomingMiddleware = [
	defineProxyMiddleware((req) => {
		if ((req.method === "DELETE" || req.method === "OPTIONS") && !req.headers["content-length"]) {
			req.headers["content-length"] = "0";
			delete req.headers["transfer-encoding"];
		}
	}),
	defineProxyMiddleware((req, res, options) => {
		if (options.timeout) req.socket.setTimeout(options.timeout);
	}),
	defineProxyMiddleware((req, res, options) => {
		if (!options.xfwd) return;
		const encrypted = req.isSpdy || hasEncryptedConnection(req);
		const values = {
			for: req.connection.remoteAddress || req.socket.remoteAddress,
			port: getPort(req),
			proto: encrypted ? "https" : "http"
		};
		for (const header of [
			"for",
			"port",
			"proto"
		]) req.headers["x-forwarded-" + header] = (req.headers["x-forwarded-" + header] || "") + (req.headers["x-forwarded-" + header] ? "," : "") + values[header];
		req.headers["x-forwarded-host"] = req.headers["x-forwarded-host"] || req.headers.host || "";
	}),
	defineProxyMiddleware((req, res, options, server, head, callback) => {
		server.emit("start", req, res, options.target || options.forward);
		const agents = nativeAgents;
		const http = agents.http;
		const https = agents.https;
		if (options.forward) {
			const forwardReq = (options.forward.protocol === "https:" ? https : http).request(setupOutgoing(options.ssl || {}, options, req, "forward"));
			const forwardError = createErrorHandler(forwardReq, options.forward);
			req.on("error", forwardError);
			forwardReq.on("error", forwardError);
			(options.buffer || req).pipe(forwardReq);
			if (!options.target) {
				res.end();
				return;
			}
		}
		const proxyReq = (options.target.protocol === "https:" ? https : http).request(setupOutgoing(options.ssl || {}, options, req));
		proxyReq.on("socket", (_socket) => {
			if (server && !proxyReq.getHeader("expect")) server.emit("proxyReq", proxyReq, req, res, options);
		});
		if (options.proxyTimeout) proxyReq.setTimeout(options.proxyTimeout, function() {
			proxyReq.abort();
		});
		req.on("aborted", function() {
			proxyReq.abort();
		});
		const proxyError = createErrorHandler(proxyReq, options.target);
		req.on("error", proxyError);
		proxyReq.on("error", proxyError);
		function createErrorHandler(proxyReq2, url) {
			return function proxyError2(err) {
				if (req.socket.destroyed && err.code === "ECONNRESET") {
					server.emit("econnreset", err, req, res, url);
					return proxyReq2.abort();
				}
				if (callback) callback(err, req, res, url);
				else server.emit("error", err, req, res, url);
			};
		}
		(options.buffer || req).pipe(proxyReq);
		proxyReq.on("response", function(proxyRes) {
			if (server) server.emit("proxyRes", proxyRes, req, res);
			if (!res.headersSent && !options.selfHandleResponse) {
				for (const pass of webOutgoingMiddleware) if (pass(req, res, proxyRes, options)) break;
			}
			if (res.finished) {
				if (server) server.emit("end", req, res, proxyRes);
			} else {
				res.on("close", function() {
					proxyRes.destroy();
				});
				proxyRes.on("end", function() {
					if (server) server.emit("end", req, res, proxyRes);
				});
				if (!options.selfHandleResponse) proxyRes.pipe(res);
			}
		});
	})
];
const websocketIncomingMiddleware = [
	defineProxyMiddleware((req, socket) => {
		if (req.method !== "GET" || !req.headers.upgrade) {
			socket.destroy();
			return true;
		}
		if (req.headers.upgrade.toLowerCase() !== "websocket") {
			socket.destroy();
			return true;
		}
	}),
	defineProxyMiddleware((req, socket, options) => {
		if (!options.xfwd) return;
		const values = {
			for: req.connection.remoteAddress || req.socket.remoteAddress,
			port: getPort(req),
			proto: hasEncryptedConnection(req) ? "wss" : "ws"
		};
		for (const header of [
			"for",
			"port",
			"proto"
		]) req.headers["x-forwarded-" + header] = (req.headers["x-forwarded-" + header] || "") + (req.headers["x-forwarded-" + header] ? "," : "") + values[header];
	}),
	defineProxyMiddleware((req, socket, options, server, head, callback) => {
		const createHttpHeader = function(line, headers) {
			return Object.keys(headers).reduce(function(head2, key) {
				const value = headers[key];
				if (!Array.isArray(value)) {
					head2.push(key + ": " + value);
					return head2;
				}
				for (const element of value) head2.push(key + ": " + element);
				return head2;
			}, [line]).join("\r\n") + "\r\n\r\n";
		};
		setupSocket(socket);
		if (head && head.length > 0) socket.unshift(head);
		const proxyReq = (isSSL.test(options.target.protocol || "http") ? nodeHTTPS : http).request(setupOutgoing(options.ssl || {}, options, req));
		if (server) server.emit("proxyReqWs", proxyReq, req, socket, options, head);
		proxyReq.on("error", onOutgoingError);
		proxyReq.on("response", function(res) {
			if (!res.upgrade) {
				socket.write(createHttpHeader("HTTP/" + res.httpVersion + " " + res.statusCode + " " + res.statusMessage, res.headers));
				res.pipe(socket);
			}
		});
		proxyReq.on("upgrade", function(proxyRes, proxySocket, proxyHead) {
			proxySocket.on("error", onOutgoingError);
			proxySocket.on("end", function() {
				server.emit("close", proxyRes, proxySocket, proxyHead);
			});
			socket.on("error", function() {
				proxySocket.end();
			});
			setupSocket(proxySocket);
			if (proxyHead && proxyHead.length > 0) proxySocket.unshift(proxyHead);
			socket.write(createHttpHeader("HTTP/1.1 101 Switching Protocols", proxyRes.headers));
			proxySocket.pipe(socket).pipe(proxySocket);
			server.emit("open", proxySocket);
			server.emit("proxySocket", proxySocket);
		});
		proxyReq.end();
		function onOutgoingError(err) {
			if (callback) callback(err, req, socket);
			else server.emit("error", err, req, socket);
			socket.end();
		}
	})
];
var ProxyServer = class extends EventEmitter {
	_server;
	_webPasses = [...webIncomingMiddleware];
	_wsPasses = [...websocketIncomingMiddleware];
	options;
	web;
	ws;
	constructor(options = {}) {
		super();
		this.options = options || {};
		this.options.prependPath = options.prependPath !== false;
		this.web = _createProxyFn("web", this);
		this.ws = _createProxyFn("ws", this);
	}
	listen(port, hostname) {
		const closure = (req, res) => {
			this.web(req, res);
		};
		this._server = this.options.ssl ? nodeHTTPS.createServer(this.options.ssl, closure) : http.createServer(closure);
		if (this.options.ws) this._server.on("upgrade", (req, socket, head) => {
			this.ws(req, socket, head);
		});
		this._server.listen(port, hostname);
		return this;
	}
	close(callback) {
		if (this._server) this._server.close((...args) => {
			this._server = void 0;
			if (callback) Reflect.apply(callback, void 0, args);
		});
	}
	before(type, passName, pass) {
		if (type !== "ws" && type !== "web") throw new Error("type must be `web` or `ws`");
		const passes = this._getPasses(type);
		let i = false;
		for (const [idx, v] of passes.entries()) if (v.name === passName) i = idx;
		if (i === false) throw new Error("No such pass");
		passes.splice(i, 0, pass);
	}
	after(type, passName, pass) {
		if (type !== "ws" && type !== "web") throw new Error("type must be `web` or `ws`");
		const passes = this._getPasses(type);
		let i = false;
		for (const [idx, v] of passes.entries()) if (v.name === passName) i = idx;
		if (i === false) throw new Error("No such pass");
		passes.splice(i++, 0, pass);
	}
	_getPasses(type) {
		return type === "ws" ? this._wsPasses : this._webPasses;
	}
};
function createProxyServer(options = {}) {
	return new ProxyServer(options);
}
function _createProxyFn(type, server) {
	return function(req, res, opts, head) {
		const requestOptions = {
			...opts,
			...server.options
		};
		for (const key of ["target", "forward"]) if (typeof requestOptions[key] === "string") requestOptions[key] = new URL(requestOptions[key]);
		if (!requestOptions.target && !requestOptions.forward) {
			this.emit("error", /* @__PURE__ */ new Error("Must provide a proper URL as target"));
			return Promise.resolve();
		}
		let _resolve;
		let _reject;
		const callbackPromise = new Promise((resolve, reject) => {
			_resolve = resolve;
			_reject = reject;
		});
		res.on("close", () => {
			_resolve();
		});
		res.on("error", (error) => {
			_reject(error);
		});
		for (const pass of server._getPasses(type)) if (pass(req, res, requestOptions, server, head, (error) => {
			_reject(error);
		})) {
			_resolve();
			break;
		}
		return callbackPromise;
	};
}
const EntryTypes = {
	FILE_TYPE: "files",
	DIR_TYPE: "directories",
	FILE_DIR_TYPE: "files_directories",
	EVERYTHING_TYPE: "all"
};
const defaultOptions = {
	root: ".",
	fileFilter: (_entryInfo) => true,
	directoryFilter: (_entryInfo) => true,
	type: EntryTypes.FILE_TYPE,
	lstat: false,
	depth: 2147483648,
	alwaysStat: false,
	highWaterMark: 4096
};
Object.freeze(defaultOptions);
const RECURSIVE_ERROR_CODE = "READDIRP_RECURSIVE_ERROR";
const NORMAL_FLOW_ERRORS = new Set([
	"ENOENT",
	"EPERM",
	"EACCES",
	"ELOOP",
	RECURSIVE_ERROR_CODE
]);
const ALL_TYPES = [
	EntryTypes.DIR_TYPE,
	EntryTypes.EVERYTHING_TYPE,
	EntryTypes.FILE_DIR_TYPE,
	EntryTypes.FILE_TYPE
];
const DIR_TYPES = new Set([
	EntryTypes.DIR_TYPE,
	EntryTypes.EVERYTHING_TYPE,
	EntryTypes.FILE_DIR_TYPE
]);
const FILE_TYPES = new Set([
	EntryTypes.EVERYTHING_TYPE,
	EntryTypes.FILE_DIR_TYPE,
	EntryTypes.FILE_TYPE
]);
const isNormalFlowError = (error) => NORMAL_FLOW_ERRORS.has(error.code);
const wantBigintFsStats = process.platform === "win32";
const emptyFn = (_entryInfo) => true;
const normalizeFilter$1 = (filter) => {
	if (filter === void 0) return emptyFn;
	if (typeof filter === "function") return filter;
	if (typeof filter === "string") {
		const fl = filter.trim();
		return (entry) => entry.basename === fl;
	}
	if (Array.isArray(filter)) {
		const trItems = filter.map((item) => item.trim());
		return (entry) => trItems.some((f) => entry.basename === f);
	}
	return emptyFn;
};
var ReaddirpStream = class extends Readable {
	parents;
	reading;
	parent;
	_stat;
	_maxDepth;
	_wantsDir;
	_wantsFile;
	_wantsEverything;
	_root;
	_isDirent;
	_statsProp;
	_rdOptions;
	_fileFilter;
	_directoryFilter;
	constructor(options = {}) {
		super({
			objectMode: true,
			autoDestroy: true,
			highWaterMark: options.highWaterMark
		});
		const opts = {
			...defaultOptions,
			...options
		};
		const { root, type } = opts;
		this._fileFilter = normalizeFilter$1(opts.fileFilter);
		this._directoryFilter = normalizeFilter$1(opts.directoryFilter);
		const statMethod = opts.lstat ? lstat : stat$1;
		if (wantBigintFsStats) this._stat = (path) => statMethod(path, { bigint: true });
		else this._stat = statMethod;
		this._maxDepth = opts.depth != null && Number.isSafeInteger(opts.depth) ? opts.depth : defaultOptions.depth;
		this._wantsDir = type ? DIR_TYPES.has(type) : false;
		this._wantsFile = type ? FILE_TYPES.has(type) : false;
		this._wantsEverything = type === EntryTypes.EVERYTHING_TYPE;
		this._root = resolve(root);
		this._isDirent = !opts.alwaysStat;
		this._statsProp = this._isDirent ? "dirent" : "stats";
		this._rdOptions = {
			encoding: "utf8",
			withFileTypes: this._isDirent
		};
		this.parents = [this._exploreDir(root, 1)];
		this.reading = false;
		this.parent = void 0;
	}
	async _read(batch) {
		if (this.reading) return;
		this.reading = true;
		try {
			while (!this.destroyed && batch > 0) {
				const par = this.parent;
				const fil = par && par.files;
				if (fil && fil.length > 0) {
					const { path, depth } = par;
					const slice = fil.splice(0, batch).map((dirent) => this._formatEntry(dirent, path));
					const awaited = await Promise.all(slice);
					for (const entry of awaited) {
						if (!entry) continue;
						if (this.destroyed) return;
						const entryType = await this._getEntryType(entry);
						if (entryType === "directory" && this._directoryFilter(entry)) {
							if (depth <= this._maxDepth) this.parents.push(this._exploreDir(entry.fullPath, depth + 1));
							if (this._wantsDir) {
								this.push(entry);
								batch--;
							}
						} else if ((entryType === "file" || this._includeAsFile(entry)) && this._fileFilter(entry)) {
							if (this._wantsFile) {
								this.push(entry);
								batch--;
							}
						}
					}
				} else {
					const parent = this.parents.pop();
					if (!parent) {
						this.push(null);
						break;
					}
					this.parent = await parent;
					if (this.destroyed) return;
				}
			}
		} catch (error) {
			this.destroy(error);
		} finally {
			this.reading = false;
		}
	}
	async _exploreDir(path, depth) {
		let files;
		try {
			files = await readdir(path, this._rdOptions);
		} catch (error) {
			this._onError(error);
		}
		return {
			files,
			depth,
			path
		};
	}
	async _formatEntry(dirent, path) {
		let entry;
		const basename = this._isDirent ? dirent.name : dirent;
		try {
			const fullPath = resolve(join(path, basename));
			entry = {
				path: relative(this._root, fullPath),
				fullPath,
				basename
			};
			entry[this._statsProp] = this._isDirent ? dirent : await this._stat(fullPath);
		} catch (err) {
			this._onError(err);
			return;
		}
		return entry;
	}
	_onError(err) {
		if (isNormalFlowError(err) && !this.destroyed) this.emit("warn", err);
		else this.destroy(err);
	}
	async _getEntryType(entry) {
		if (!entry && this._statsProp in entry) return "";
		const stats = entry[this._statsProp];
		if (stats.isFile()) return "file";
		if (stats.isDirectory()) return "directory";
		if (stats && stats.isSymbolicLink()) {
			const full = entry.fullPath;
			try {
				const entryRealPath = await realpath(full);
				const entryRealPathStats = await lstat(entryRealPath);
				if (entryRealPathStats.isFile()) return "file";
				if (entryRealPathStats.isDirectory()) {
					const len = entryRealPath.length;
					if (full.startsWith(entryRealPath) && full.substr(len, 1) === sep) {
						const recursiveError = /* @__PURE__ */ new Error(`Circular symlink detected: "${full}" points to "${entryRealPath}"`);
						recursiveError.code = RECURSIVE_ERROR_CODE;
						return this._onError(recursiveError);
					}
					return "directory";
				}
			} catch (error) {
				this._onError(error);
				return "";
			}
		}
	}
	_includeAsFile(entry) {
		const stats = entry && entry[this._statsProp];
		return stats && this._wantsEverything && !stats.isDirectory();
	}
};
function readdirp(root, options = {}) {
	let type = options.entryType || options.type;
	if (type === "both") type = EntryTypes.FILE_DIR_TYPE;
	if (type) options.type = type;
	if (!root) throw new Error("readdirp: root argument is required. Usage: readdirp(root, options)");
	else if (typeof root !== "string") throw new TypeError("readdirp: root argument must be a string. Usage: readdirp(root, options)");
	else if (type && !ALL_TYPES.includes(type)) throw new Error(`readdirp: Invalid type passed. Use one of ${ALL_TYPES.join(", ")}`);
	options.root = root;
	return new ReaddirpStream(options);
}
const STR_DATA = "data";
const STR_END = "end";
const STR_CLOSE = "close";
const EMPTY_FN = () => {};
const pl = process.platform;
const isWindows$1 = pl === "win32";
const isMacos = pl === "darwin";
const isLinux = pl === "linux";
const isFreeBSD = pl === "freebsd";
const isIBMi = type() === "OS400";
const EVENTS = {
	ALL: "all",
	READY: "ready",
	ADD: "add",
	CHANGE: "change",
	ADD_DIR: "addDir",
	UNLINK: "unlink",
	UNLINK_DIR: "unlinkDir",
	RAW: "raw",
	ERROR: "error"
};
const EV = EVENTS;
const THROTTLE_MODE_WATCH = "watch";
const statMethods = {
	lstat,
	stat: stat$1
};
const KEY_LISTENERS = "listeners";
const KEY_ERR = "errHandlers";
const KEY_RAW = "rawEmitters";
const HANDLER_KEYS = [
	KEY_LISTENERS,
	KEY_ERR,
	KEY_RAW
];
const binaryExtensions = new Set([
	"3dm",
	"3ds",
	"3g2",
	"3gp",
	"7z",
	"a",
	"aac",
	"adp",
	"afdesign",
	"afphoto",
	"afpub",
	"ai",
	"aif",
	"aiff",
	"alz",
	"ape",
	"apk",
	"appimage",
	"ar",
	"arj",
	"asf",
	"au",
	"avi",
	"bak",
	"baml",
	"bh",
	"bin",
	"bk",
	"bmp",
	"btif",
	"bz2",
	"bzip2",
	"cab",
	"caf",
	"cgm",
	"class",
	"cmx",
	"cpio",
	"cr2",
	"cur",
	"dat",
	"dcm",
	"deb",
	"dex",
	"djvu",
	"dll",
	"dmg",
	"dng",
	"doc",
	"docm",
	"docx",
	"dot",
	"dotm",
	"dra",
	"DS_Store",
	"dsk",
	"dts",
	"dtshd",
	"dvb",
	"dwg",
	"dxf",
	"ecelp4800",
	"ecelp7470",
	"ecelp9600",
	"egg",
	"eol",
	"eot",
	"epub",
	"exe",
	"f4v",
	"fbs",
	"fh",
	"fla",
	"flac",
	"flatpak",
	"fli",
	"flv",
	"fpx",
	"fst",
	"fvt",
	"g3",
	"gh",
	"gif",
	"graffle",
	"gz",
	"gzip",
	"h261",
	"h263",
	"h264",
	"icns",
	"ico",
	"ief",
	"img",
	"ipa",
	"iso",
	"jar",
	"jpeg",
	"jpg",
	"jpgv",
	"jpm",
	"jxr",
	"key",
	"ktx",
	"lha",
	"lib",
	"lvp",
	"lz",
	"lzh",
	"lzma",
	"lzo",
	"m3u",
	"m4a",
	"m4v",
	"mar",
	"mdi",
	"mht",
	"mid",
	"midi",
	"mj2",
	"mka",
	"mkv",
	"mmr",
	"mng",
	"mobi",
	"mov",
	"movie",
	"mp3",
	"mp4",
	"mp4a",
	"mpeg",
	"mpg",
	"mpga",
	"mxu",
	"nef",
	"npx",
	"numbers",
	"nupkg",
	"o",
	"odp",
	"ods",
	"odt",
	"oga",
	"ogg",
	"ogv",
	"otf",
	"ott",
	"pages",
	"pbm",
	"pcx",
	"pdb",
	"pdf",
	"pea",
	"pgm",
	"pic",
	"png",
	"pnm",
	"pot",
	"potm",
	"potx",
	"ppa",
	"ppam",
	"ppm",
	"pps",
	"ppsm",
	"ppsx",
	"ppt",
	"pptm",
	"pptx",
	"psd",
	"pya",
	"pyc",
	"pyo",
	"pyv",
	"qt",
	"rar",
	"ras",
	"raw",
	"resources",
	"rgb",
	"rip",
	"rlc",
	"rmf",
	"rmvb",
	"rpm",
	"rtf",
	"rz",
	"s3m",
	"s7z",
	"scpt",
	"sgi",
	"shar",
	"snap",
	"sil",
	"sketch",
	"slk",
	"smv",
	"snk",
	"so",
	"stl",
	"suo",
	"sub",
	"swf",
	"tar",
	"tbz",
	"tbz2",
	"tga",
	"tgz",
	"thmx",
	"tif",
	"tiff",
	"tlz",
	"ttc",
	"ttf",
	"txz",
	"udf",
	"uvh",
	"uvi",
	"uvm",
	"uvp",
	"uvs",
	"uvu",
	"viv",
	"vob",
	"war",
	"wav",
	"wax",
	"wbmp",
	"wdp",
	"weba",
	"webm",
	"webp",
	"whl",
	"wim",
	"wm",
	"wma",
	"wmv",
	"wmx",
	"woff",
	"woff2",
	"wrm",
	"wvx",
	"xbm",
	"xif",
	"xla",
	"xlam",
	"xls",
	"xlsb",
	"xlsm",
	"xlsx",
	"xlt",
	"xltm",
	"xltx",
	"xm",
	"xmind",
	"xpi",
	"xpm",
	"xwd",
	"xz",
	"z",
	"zip",
	"zipx"
]);
const isBinaryPath = (filePath) => binaryExtensions.has(sp.extname(filePath).slice(1).toLowerCase());
const foreach = (val, fn) => {
	if (val instanceof Set) val.forEach(fn);
	else fn(val);
};
const addAndConvert = (main, prop, item) => {
	let container = main[prop];
	if (!(container instanceof Set)) main[prop] = container = new Set([container]);
	container.add(item);
};
const clearItem = (cont) => (key) => {
	const set = cont[key];
	if (set instanceof Set) set.clear();
	else delete cont[key];
};
const delFromSet = (main, prop, item) => {
	const container = main[prop];
	if (container instanceof Set) container.delete(item);
	else if (container === item) delete main[prop];
};
const isEmptySet = (val) => val instanceof Set ? val.size === 0 : !val;
const FsWatchInstances = /* @__PURE__ */ new Map();
function createFsWatchInstance(path, options, listener, errHandler, emitRaw) {
	const handleEvent = (rawEvent, evPath) => {
		listener(path);
		emitRaw(rawEvent, evPath, { watchedPath: path });
		if (evPath && path !== evPath) fsWatchBroadcast(sp.resolve(path, evPath), KEY_LISTENERS, sp.join(path, evPath));
	};
	try {
		return watch(path, { persistent: options.persistent }, handleEvent);
	} catch (error) {
		errHandler(error);
		return;
	}
}
const fsWatchBroadcast = (fullPath, listenerType, val1, val2, val3) => {
	const cont = FsWatchInstances.get(fullPath);
	if (!cont) return;
	foreach(cont[listenerType], (listener) => {
		listener(val1, val2, val3);
	});
};
const setFsWatchListener = (path, fullPath, options, handlers) => {
	const { listener, errHandler, rawEmitter } = handlers;
	let cont = FsWatchInstances.get(fullPath);
	let watcher;
	if (!options.persistent) {
		watcher = createFsWatchInstance(path, options, listener, errHandler, rawEmitter);
		if (!watcher) return;
		return watcher.close.bind(watcher);
	}
	if (cont) {
		addAndConvert(cont, KEY_LISTENERS, listener);
		addAndConvert(cont, KEY_ERR, errHandler);
		addAndConvert(cont, KEY_RAW, rawEmitter);
	} else {
		watcher = createFsWatchInstance(path, options, fsWatchBroadcast.bind(null, fullPath, KEY_LISTENERS), errHandler, fsWatchBroadcast.bind(null, fullPath, KEY_RAW));
		if (!watcher) return;
		watcher.on(EV.ERROR, async (error) => {
			const broadcastErr = fsWatchBroadcast.bind(null, fullPath, KEY_ERR);
			if (cont) cont.watcherUnusable = true;
			if (isWindows$1 && error.code === "EPERM") try {
				await (await open(path, "r")).close();
				broadcastErr(error);
			} catch (err) {}
			else broadcastErr(error);
		});
		cont = {
			listeners: listener,
			errHandlers: errHandler,
			rawEmitters: rawEmitter,
			watcher
		};
		FsWatchInstances.set(fullPath, cont);
	}
	return () => {
		delFromSet(cont, KEY_LISTENERS, listener);
		delFromSet(cont, KEY_ERR, errHandler);
		delFromSet(cont, KEY_RAW, rawEmitter);
		if (isEmptySet(cont.listeners)) {
			cont.watcher.close();
			FsWatchInstances.delete(fullPath);
			HANDLER_KEYS.forEach(clearItem(cont));
			cont.watcher = void 0;
			Object.freeze(cont);
		}
	};
};
const FsWatchFileInstances = /* @__PURE__ */ new Map();
const setFsWatchFileListener = (path, fullPath, options, handlers) => {
	const { listener, rawEmitter } = handlers;
	let cont = FsWatchFileInstances.get(fullPath);
	const copts = cont && cont.options;
	if (copts && (copts.persistent < options.persistent || copts.interval > options.interval)) {
		unwatchFile(fullPath);
		cont = void 0;
	}
	if (cont) {
		addAndConvert(cont, KEY_LISTENERS, listener);
		addAndConvert(cont, KEY_RAW, rawEmitter);
	} else {
		cont = {
			listeners: listener,
			rawEmitters: rawEmitter,
			options,
			watcher: watchFile(fullPath, options, (curr, prev) => {
				foreach(cont.rawEmitters, (rawEmitter) => {
					rawEmitter(EV.CHANGE, fullPath, {
						curr,
						prev
					});
				});
				const currmtime = curr.mtimeMs;
				if (curr.size !== prev.size || currmtime > prev.mtimeMs || currmtime === 0) foreach(cont.listeners, (listener) => listener(path, curr));
			})
		};
		FsWatchFileInstances.set(fullPath, cont);
	}
	return () => {
		delFromSet(cont, KEY_LISTENERS, listener);
		delFromSet(cont, KEY_RAW, rawEmitter);
		if (isEmptySet(cont.listeners)) {
			FsWatchFileInstances.delete(fullPath);
			unwatchFile(fullPath);
			cont.options = cont.watcher = void 0;
			Object.freeze(cont);
		}
	};
};
var NodeFsHandler = class {
	fsw;
	_boundHandleError;
	constructor(fsW) {
		this.fsw = fsW;
		this._boundHandleError = (error) => fsW._handleError(error);
	}
	_watchWithNodeFs(path, listener) {
		const opts = this.fsw.options;
		const directory = sp.dirname(path);
		const basename = sp.basename(path);
		this.fsw._getWatchedDir(directory).add(basename);
		const absolutePath = sp.resolve(path);
		const options = { persistent: opts.persistent };
		if (!listener) listener = EMPTY_FN;
		let closer;
		if (opts.usePolling) {
			options.interval = opts.interval !== opts.binaryInterval && isBinaryPath(basename) ? opts.binaryInterval : opts.interval;
			closer = setFsWatchFileListener(path, absolutePath, options, {
				listener,
				rawEmitter: this.fsw._emitRaw
			});
		} else closer = setFsWatchListener(path, absolutePath, options, {
			listener,
			errHandler: this._boundHandleError,
			rawEmitter: this.fsw._emitRaw
		});
		return closer;
	}
	_handleFile(file, stats, initialAdd) {
		if (this.fsw.closed) return;
		const dirname = sp.dirname(file);
		const basename = sp.basename(file);
		const parent = this.fsw._getWatchedDir(dirname);
		let prevStats = stats;
		if (parent.has(basename)) return;
		const listener = async (path, newStats) => {
			if (!this.fsw._throttle(THROTTLE_MODE_WATCH, file, 5)) return;
			if (!newStats || newStats.mtimeMs === 0) try {
				const newStats = await stat$1(file);
				if (this.fsw.closed) return;
				const at = newStats.atimeMs;
				const mt = newStats.mtimeMs;
				if (!at || at <= mt || mt !== prevStats.mtimeMs) this.fsw._emit(EV.CHANGE, file, newStats);
				if ((isMacos || isLinux || isFreeBSD) && prevStats.ino !== newStats.ino) {
					this.fsw._closeFile(path);
					prevStats = newStats;
					const closer = this._watchWithNodeFs(file, listener);
					if (closer) this.fsw._addPathCloser(path, closer);
				} else prevStats = newStats;
			} catch (error) {
				this.fsw._remove(dirname, basename);
			}
			else if (parent.has(basename)) {
				const at = newStats.atimeMs;
				const mt = newStats.mtimeMs;
				if (!at || at <= mt || mt !== prevStats.mtimeMs) this.fsw._emit(EV.CHANGE, file, newStats);
				prevStats = newStats;
			}
		};
		const closer = this._watchWithNodeFs(file, listener);
		if (!(initialAdd && this.fsw.options.ignoreInitial) && this.fsw._isntIgnored(file)) {
			if (!this.fsw._throttle(EV.ADD, file, 0)) return;
			this.fsw._emit(EV.ADD, file, stats);
		}
		return closer;
	}
	async _handleSymlink(entry, directory, path, item) {
		if (this.fsw.closed) return;
		const full = entry.fullPath;
		const dir = this.fsw._getWatchedDir(directory);
		if (!this.fsw.options.followSymlinks) {
			this.fsw._incrReadyCount();
			let linkPath;
			try {
				linkPath = await realpath(path);
			} catch (e) {
				this.fsw._emitReady();
				return true;
			}
			if (this.fsw.closed) return;
			if (dir.has(item)) {
				if (this.fsw._symlinkPaths.get(full) !== linkPath) {
					this.fsw._symlinkPaths.set(full, linkPath);
					this.fsw._emit(EV.CHANGE, path, entry.stats);
				}
			} else {
				dir.add(item);
				this.fsw._symlinkPaths.set(full, linkPath);
				this.fsw._emit(EV.ADD, path, entry.stats);
			}
			this.fsw._emitReady();
			return true;
		}
		if (this.fsw._symlinkPaths.has(full)) return true;
		this.fsw._symlinkPaths.set(full, true);
	}
	_handleRead(directory, initialAdd, wh, target, dir, depth, throttler) {
		directory = sp.join(directory, "");
		const throttleKey = target ? `${directory}:${target}` : directory;
		throttler = this.fsw._throttle("readdir", throttleKey, 1e3);
		if (!throttler) return;
		const previous = this.fsw._getWatchedDir(wh.path);
		const current = /* @__PURE__ */ new Set();
		let stream = this.fsw._readdirp(directory, {
			fileFilter: (entry) => wh.filterPath(entry),
			directoryFilter: (entry) => wh.filterDir(entry)
		});
		if (!stream) return;
		stream.on(STR_DATA, async (entry) => {
			if (this.fsw.closed) {
				stream = void 0;
				return;
			}
			const item = entry.path;
			let path = sp.join(directory, item);
			current.add(item);
			if (entry.stats.isSymbolicLink() && await this._handleSymlink(entry, directory, path, item)) return;
			if (this.fsw.closed) {
				stream = void 0;
				return;
			}
			if (item === target || !target && !previous.has(item)) {
				this.fsw._incrReadyCount();
				path = sp.join(dir, sp.relative(dir, path));
				this._addToNodeFs(path, initialAdd, wh, depth + 1);
			}
		}).on(EV.ERROR, this._boundHandleError);
		return new Promise((resolve, reject) => {
			if (!stream) return reject();
			stream.once(STR_END, () => {
				if (this.fsw.closed) {
					stream = void 0;
					return;
				}
				const wasThrottled = throttler ? throttler.clear() : false;
				resolve(void 0);
				previous.getChildren().filter((item) => {
					return item !== directory && !current.has(item);
				}).forEach((item) => {
					this.fsw._remove(directory, item);
				});
				stream = void 0;
				if (wasThrottled) this._handleRead(directory, false, wh, target, dir, depth, throttler);
			});
		});
	}
	async _handleDir(dir, stats, initialAdd, depth, target, wh, realpath) {
		const parentDir = this.fsw._getWatchedDir(sp.dirname(dir));
		const tracked = parentDir.has(sp.basename(dir));
		if (!(initialAdd && this.fsw.options.ignoreInitial) && !target && !tracked) this.fsw._emit(EV.ADD_DIR, dir, stats);
		parentDir.add(sp.basename(dir));
		this.fsw._getWatchedDir(dir);
		let throttler;
		let closer;
		const oDepth = this.fsw.options.depth;
		if ((oDepth == null || depth <= oDepth) && !this.fsw._symlinkPaths.has(realpath)) {
			if (!target) {
				await this._handleRead(dir, initialAdd, wh, target, dir, depth, throttler);
				if (this.fsw.closed) return;
			}
			closer = this._watchWithNodeFs(dir, (dirPath, stats) => {
				if (stats && stats.mtimeMs === 0) return;
				this._handleRead(dirPath, false, wh, target, dir, depth, throttler);
			});
		}
		return closer;
	}
	async _addToNodeFs(path, initialAdd, priorWh, depth, target) {
		const ready = this.fsw._emitReady;
		if (this.fsw._isIgnored(path) || this.fsw.closed) {
			ready();
			return false;
		}
		const wh = this.fsw._getWatchHelpers(path);
		if (priorWh) {
			wh.filterPath = (entry) => priorWh.filterPath(entry);
			wh.filterDir = (entry) => priorWh.filterDir(entry);
		}
		try {
			const stats = await statMethods[wh.statMethod](wh.watchPath);
			if (this.fsw.closed) return;
			if (this.fsw._isIgnored(wh.watchPath, stats)) {
				ready();
				return false;
			}
			const follow = this.fsw.options.followSymlinks;
			let closer;
			if (stats.isDirectory()) {
				const absPath = sp.resolve(path);
				const targetPath = follow ? await realpath(path) : path;
				if (this.fsw.closed) return;
				closer = await this._handleDir(wh.watchPath, stats, initialAdd, depth, target, wh, targetPath);
				if (this.fsw.closed) return;
				if (absPath !== targetPath && targetPath !== void 0) this.fsw._symlinkPaths.set(absPath, targetPath);
			} else if (stats.isSymbolicLink()) {
				const targetPath = follow ? await realpath(path) : path;
				if (this.fsw.closed) return;
				const parent = sp.dirname(wh.watchPath);
				this.fsw._getWatchedDir(parent).add(wh.watchPath);
				this.fsw._emit(EV.ADD, wh.watchPath, stats);
				closer = await this._handleDir(parent, stats, initialAdd, depth, path, wh, targetPath);
				if (this.fsw.closed) return;
				if (targetPath !== void 0) this.fsw._symlinkPaths.set(sp.resolve(path), targetPath);
			} else closer = this._handleFile(wh.watchPath, stats, initialAdd);
			ready();
			if (closer) this.fsw._addPathCloser(path, closer);
			return false;
		} catch (error) {
			if (this.fsw._handleError(error)) {
				ready();
				return path;
			}
		}
	}
};
/*! chokidar - MIT License (c) 2012 Paul Miller (paulmillr.com) */
var chokidar_exports = /* @__PURE__ */ __exportAll$1({
	FSWatcher: () => FSWatcher,
	WatchHelper: () => WatchHelper,
	default: () => chokidar_default,
	watch: () => watch$1
});
const SLASH = "/";
const SLASH_SLASH = "//";
const ONE_DOT = ".";
const TWO_DOTS = "..";
const STRING_TYPE = "string";
const BACK_SLASH_RE = /\\/g;
const DOUBLE_SLASH_RE = /\/\//g;
const DOT_RE = /\..*\.(sw[px])$|~$|\.subl.*\.tmp/;
const REPLACER_RE = /^\.[/\\]/;
function arrify(item) {
	return Array.isArray(item) ? item : [item];
}
const isMatcherObject = (matcher) => typeof matcher === "object" && matcher !== null && !(matcher instanceof RegExp);
function createPattern(matcher) {
	if (typeof matcher === "function") return matcher;
	if (typeof matcher === "string") return (string) => matcher === string;
	if (matcher instanceof RegExp) return (string) => matcher.test(string);
	if (typeof matcher === "object" && matcher !== null) return (string) => {
		if (matcher.path === string) return true;
		if (matcher.recursive) {
			const relative = sp.relative(matcher.path, string);
			if (!relative) return false;
			return !relative.startsWith("..") && !sp.isAbsolute(relative);
		}
		return false;
	};
	return () => false;
}
function normalizePath$3(path) {
	if (typeof path !== "string") throw new Error("string expected");
	path = sp.normalize(path);
	path = path.replace(/\\/g, "/");
	let prepend = false;
	if (path.startsWith("//")) prepend = true;
	path = path.replace(DOUBLE_SLASH_RE, "/");
	if (prepend) path = "/" + path;
	return path;
}
function matchPatterns(patterns, testString, stats) {
	const path = normalizePath$3(testString);
	for (let index = 0; index < patterns.length; index++) {
		const pattern = patterns[index];
		if (pattern(path, stats)) return true;
	}
	return false;
}
function anymatch(matchers, testString) {
	if (matchers == null) throw new TypeError("anymatch: specify first argument");
	const patterns = arrify(matchers).map((matcher) => createPattern(matcher));
	if (testString == null) return (testString, stats) => {
		return matchPatterns(patterns, testString, stats);
	};
	return matchPatterns(patterns, testString);
}
const unifyPaths = (paths_) => {
	const paths = arrify(paths_).flat();
	if (!paths.every((p) => typeof p === STRING_TYPE)) throw new TypeError(`Non-string provided as watch path: ${paths}`);
	return paths.map(normalizePathToUnix);
};
const toUnix = (string) => {
	let str = string.replace(BACK_SLASH_RE, SLASH);
	let prepend = false;
	if (str.startsWith(SLASH_SLASH)) prepend = true;
	str = str.replace(DOUBLE_SLASH_RE, SLASH);
	if (prepend) str = SLASH + str;
	return str;
};
const normalizePathToUnix = (path) => toUnix(sp.normalize(toUnix(path)));
const normalizeIgnored = (cwd = "") => (path) => {
	if (typeof path === "string") return normalizePathToUnix(sp.isAbsolute(path) ? path : sp.join(cwd, path));
	else return path;
};
const getAbsolutePath = (path, cwd) => {
	if (sp.isAbsolute(path)) return path;
	return sp.join(cwd, path);
};
const EMPTY_SET = Object.freeze(/* @__PURE__ */ new Set());
var DirEntry = class {
	path;
	_removeWatcher;
	items;
	constructor(dir, removeWatcher) {
		this.path = dir;
		this._removeWatcher = removeWatcher;
		this.items = /* @__PURE__ */ new Set();
	}
	add(item) {
		const { items } = this;
		if (!items) return;
		if (item !== ONE_DOT && item !== TWO_DOTS) items.add(item);
	}
	async remove(item) {
		const { items } = this;
		if (!items) return;
		items.delete(item);
		if (items.size > 0) return;
		const dir = this.path;
		try {
			await readdir(dir);
		} catch (err) {
			if (this._removeWatcher) this._removeWatcher(sp.dirname(dir), sp.basename(dir));
		}
	}
	has(item) {
		const { items } = this;
		if (!items) return;
		return items.has(item);
	}
	getChildren() {
		const { items } = this;
		if (!items) return [];
		return [...items.values()];
	}
	dispose() {
		this.items.clear();
		this.path = "";
		this._removeWatcher = EMPTY_FN;
		this.items = EMPTY_SET;
		Object.freeze(this);
	}
};
const STAT_METHOD_F = "stat";
const STAT_METHOD_L = "lstat";
var WatchHelper = class {
	fsw;
	path;
	watchPath;
	fullWatchPath;
	dirParts;
	followSymlinks;
	statMethod;
	constructor(path, follow, fsw) {
		this.fsw = fsw;
		const watchPath = path;
		this.path = path = path.replace(REPLACER_RE, "");
		this.watchPath = watchPath;
		this.fullWatchPath = sp.resolve(watchPath);
		this.dirParts = [];
		this.dirParts.forEach((parts) => {
			if (parts.length > 1) parts.pop();
		});
		this.followSymlinks = follow;
		this.statMethod = follow ? STAT_METHOD_F : STAT_METHOD_L;
	}
	entryPath(entry) {
		return sp.join(this.watchPath, sp.relative(this.watchPath, entry.fullPath));
	}
	filterPath(entry) {
		const { stats } = entry;
		if (stats && stats.isSymbolicLink()) return this.filterDir(entry);
		const resolvedPath = this.entryPath(entry);
		return this.fsw._isntIgnored(resolvedPath, stats) && this.fsw._hasReadPermissions(stats);
	}
	filterDir(entry) {
		return this.fsw._isntIgnored(this.entryPath(entry), entry.stats);
	}
};
var FSWatcher = class extends EventEmitter {
	closed;
	options;
	_closers;
	_ignoredPaths;
	_throttled;
	_streams;
	_symlinkPaths;
	_watched;
	_pendingWrites;
	_pendingUnlinks;
	_readyCount;
	_emitReady;
	_closePromise;
	_userIgnored;
	_readyEmitted;
	_emitRaw;
	_boundRemove;
	_nodeFsHandler;
	constructor(_opts = {}) {
		super();
		this.closed = false;
		this._closers = /* @__PURE__ */ new Map();
		this._ignoredPaths = /* @__PURE__ */ new Set();
		this._throttled = /* @__PURE__ */ new Map();
		this._streams = /* @__PURE__ */ new Set();
		this._symlinkPaths = /* @__PURE__ */ new Map();
		this._watched = /* @__PURE__ */ new Map();
		this._pendingWrites = /* @__PURE__ */ new Map();
		this._pendingUnlinks = /* @__PURE__ */ new Map();
		this._readyCount = 0;
		this._readyEmitted = false;
		const awf = _opts.awaitWriteFinish;
		const DEF_AWF = {
			stabilityThreshold: 2e3,
			pollInterval: 100
		};
		const opts = {
			persistent: true,
			ignoreInitial: false,
			ignorePermissionErrors: false,
			interval: 100,
			binaryInterval: 300,
			followSymlinks: true,
			usePolling: false,
			atomic: true,
			..._opts,
			ignored: _opts.ignored ? arrify(_opts.ignored) : arrify([]),
			awaitWriteFinish: awf === true ? DEF_AWF : typeof awf === "object" ? {
				...DEF_AWF,
				...awf
			} : false
		};
		if (isIBMi) opts.usePolling = true;
		if (opts.atomic === void 0) opts.atomic = !opts.usePolling;
		const envPoll = process.env.CHOKIDAR_USEPOLLING;
		if (envPoll !== void 0) {
			const envLower = envPoll.toLowerCase();
			if (envLower === "false" || envLower === "0") opts.usePolling = false;
			else if (envLower === "true" || envLower === "1") opts.usePolling = true;
			else opts.usePolling = !!envLower;
		}
		const envInterval = process.env.CHOKIDAR_INTERVAL;
		if (envInterval) opts.interval = Number.parseInt(envInterval, 10);
		let readyCalls = 0;
		this._emitReady = () => {
			readyCalls++;
			if (readyCalls >= this._readyCount) {
				this._emitReady = EMPTY_FN;
				this._readyEmitted = true;
				process.nextTick(() => this.emit(EVENTS.READY));
			}
		};
		this._emitRaw = (...args) => this.emit(EVENTS.RAW, ...args);
		this._boundRemove = this._remove.bind(this);
		this.options = opts;
		this._nodeFsHandler = new NodeFsHandler(this);
		Object.freeze(opts);
	}
	_addIgnoredPath(matcher) {
		if (isMatcherObject(matcher)) {
			for (const ignored of this._ignoredPaths) if (isMatcherObject(ignored) && ignored.path === matcher.path && ignored.recursive === matcher.recursive) return;
		}
		this._ignoredPaths.add(matcher);
	}
	_removeIgnoredPath(matcher) {
		this._ignoredPaths.delete(matcher);
		if (typeof matcher === "string") {
			for (const ignored of this._ignoredPaths) if (isMatcherObject(ignored) && ignored.path === matcher) this._ignoredPaths.delete(ignored);
		}
	}
	add(paths_, _origAdd, _internal) {
		const { cwd } = this.options;
		this.closed = false;
		this._closePromise = void 0;
		let paths = unifyPaths(paths_);
		if (cwd) paths = paths.map((path) => {
			return getAbsolutePath(path, cwd);
		});
		paths.forEach((path) => {
			this._removeIgnoredPath(path);
		});
		this._userIgnored = void 0;
		if (!this._readyCount) this._readyCount = 0;
		this._readyCount += paths.length;
		Promise.all(paths.map(async (path) => {
			const res = await this._nodeFsHandler._addToNodeFs(path, !_internal, void 0, 0, _origAdd);
			if (res) this._emitReady();
			return res;
		})).then((results) => {
			if (this.closed) return;
			results.forEach((item) => {
				if (item) this.add(sp.dirname(item), sp.basename(_origAdd || item));
			});
		});
		return this;
	}
	unwatch(paths_) {
		if (this.closed) return this;
		const paths = unifyPaths(paths_);
		const { cwd } = this.options;
		paths.forEach((path) => {
			if (!sp.isAbsolute(path) && !this._closers.has(path)) {
				if (cwd) path = sp.join(cwd, path);
				path = sp.resolve(path);
			}
			this._closePath(path);
			this._addIgnoredPath(path);
			if (this._watched.has(path)) this._addIgnoredPath({
				path,
				recursive: true
			});
			this._userIgnored = void 0;
		});
		return this;
	}
	close() {
		if (this._closePromise) return this._closePromise;
		this.closed = true;
		this.removeAllListeners();
		const closers = [];
		this._closers.forEach((closerList) => closerList.forEach((closer) => {
			const promise = closer();
			if (promise instanceof Promise) closers.push(promise);
		}));
		this._streams.forEach((stream) => stream.destroy());
		this._userIgnored = void 0;
		this._readyCount = 0;
		this._readyEmitted = false;
		this._watched.forEach((dirent) => dirent.dispose());
		this._closers.clear();
		this._watched.clear();
		this._streams.clear();
		this._symlinkPaths.clear();
		this._throttled.clear();
		this._closePromise = closers.length ? Promise.all(closers).then(() => void 0) : Promise.resolve();
		return this._closePromise;
	}
	getWatched() {
		const watchList = {};
		this._watched.forEach((entry, dir) => {
			const index = (this.options.cwd ? sp.relative(this.options.cwd, dir) : dir) || ONE_DOT;
			watchList[index] = entry.getChildren().sort();
		});
		return watchList;
	}
	emitWithAll(event, args) {
		this.emit(event, ...args);
		if (event !== EVENTS.ERROR) this.emit(EVENTS.ALL, event, ...args);
	}
	async _emit(event, path, stats) {
		if (this.closed) return;
		const opts = this.options;
		if (isWindows$1) path = sp.normalize(path);
		if (opts.cwd) path = sp.relative(opts.cwd, path);
		const args = [path];
		if (stats != null) args.push(stats);
		const awf = opts.awaitWriteFinish;
		let pw;
		if (awf && (pw = this._pendingWrites.get(path))) {
			pw.lastChange = /* @__PURE__ */ new Date();
			return this;
		}
		if (opts.atomic) {
			if (event === EVENTS.UNLINK) {
				this._pendingUnlinks.set(path, [event, ...args]);
				setTimeout(() => {
					this._pendingUnlinks.forEach((entry, path) => {
						this.emit(...entry);
						this.emit(EVENTS.ALL, ...entry);
						this._pendingUnlinks.delete(path);
					});
				}, typeof opts.atomic === "number" ? opts.atomic : 100);
				return this;
			}
			if (event === EVENTS.ADD && this._pendingUnlinks.has(path)) {
				event = EVENTS.CHANGE;
				this._pendingUnlinks.delete(path);
			}
		}
		if (awf && (event === EVENTS.ADD || event === EVENTS.CHANGE) && this._readyEmitted) {
			const awfEmit = (err, stats) => {
				if (err) {
					event = EVENTS.ERROR;
					args[0] = err;
					this.emitWithAll(event, args);
				} else if (stats) {
					if (args.length > 1) args[1] = stats;
					else args.push(stats);
					this.emitWithAll(event, args);
				}
			};
			this._awaitWriteFinish(path, awf.stabilityThreshold, event, awfEmit);
			return this;
		}
		if (event === EVENTS.CHANGE) {
			if (!this._throttle(EVENTS.CHANGE, path, 50)) return this;
		}
		if (opts.alwaysStat && stats === void 0 && (event === EVENTS.ADD || event === EVENTS.ADD_DIR || event === EVENTS.CHANGE)) {
			const fullPath = opts.cwd ? sp.join(opts.cwd, path) : path;
			let stats;
			try {
				stats = await stat$1(fullPath);
			} catch (err) {}
			if (!stats || this.closed) return;
			args.push(stats);
		}
		this.emitWithAll(event, args);
		return this;
	}
	_handleError(error) {
		const code = error && error.code;
		if (error && code !== "ENOENT" && code !== "ENOTDIR" && (!this.options.ignorePermissionErrors || code !== "EPERM" && code !== "EACCES")) this.emit(EVENTS.ERROR, error);
		return error || this.closed;
	}
	_throttle(actionType, path, timeout) {
		if (!this._throttled.has(actionType)) this._throttled.set(actionType, /* @__PURE__ */ new Map());
		const action = this._throttled.get(actionType);
		if (!action) throw new Error("invalid throttle");
		const actionPath = action.get(path);
		if (actionPath) {
			actionPath.count++;
			return false;
		}
		let timeoutObject;
		const clear = () => {
			const item = action.get(path);
			const count = item ? item.count : 0;
			action.delete(path);
			clearTimeout(timeoutObject);
			if (item) clearTimeout(item.timeoutObject);
			return count;
		};
		timeoutObject = setTimeout(clear, timeout);
		const thr = {
			timeoutObject,
			clear,
			count: 0
		};
		action.set(path, thr);
		return thr;
	}
	_incrReadyCount() {
		return this._readyCount++;
	}
	_awaitWriteFinish(path, threshold, event, awfEmit) {
		const awf = this.options.awaitWriteFinish;
		if (typeof awf !== "object") return;
		const pollInterval = awf.pollInterval;
		let timeoutHandler;
		let fullPath = path;
		if (this.options.cwd && !sp.isAbsolute(path)) fullPath = sp.join(this.options.cwd, path);
		const now = /* @__PURE__ */ new Date();
		const writes = this._pendingWrites;
		function awaitWriteFinishFn(prevStat) {
			stat(fullPath, (err, curStat) => {
				if (err || !writes.has(path)) {
					if (err && err.code !== "ENOENT") awfEmit(err);
					return;
				}
				const now = Number(/* @__PURE__ */ new Date());
				if (prevStat && curStat.size !== prevStat.size) writes.get(path).lastChange = now;
				if (now - writes.get(path).lastChange >= threshold) {
					writes.delete(path);
					awfEmit(void 0, curStat);
				} else timeoutHandler = setTimeout(awaitWriteFinishFn, pollInterval, curStat);
			});
		}
		if (!writes.has(path)) {
			writes.set(path, {
				lastChange: now,
				cancelWait: () => {
					writes.delete(path);
					clearTimeout(timeoutHandler);
					return event;
				}
			});
			timeoutHandler = setTimeout(awaitWriteFinishFn, pollInterval);
		}
	}
	_isIgnored(path, stats) {
		if (this.options.atomic && DOT_RE.test(path)) return true;
		if (!this._userIgnored) {
			const { cwd } = this.options;
			const ignored = (this.options.ignored || []).map(normalizeIgnored(cwd));
			this._userIgnored = anymatch([...[...this._ignoredPaths].map(normalizeIgnored(cwd)), ...ignored], void 0);
		}
		return this._userIgnored(path, stats);
	}
	_isntIgnored(path, stat) {
		return !this._isIgnored(path, stat);
	}
	_getWatchHelpers(path) {
		return new WatchHelper(path, this.options.followSymlinks, this);
	}
	_getWatchedDir(directory) {
		const dir = sp.resolve(directory);
		if (!this._watched.has(dir)) this._watched.set(dir, new DirEntry(dir, this._boundRemove));
		return this._watched.get(dir);
	}
	_hasReadPermissions(stats) {
		if (this.options.ignorePermissionErrors) return true;
		return Boolean(Number(stats.mode) & 256);
	}
	_remove(directory, item, isDirectory) {
		const path = sp.join(directory, item);
		const fullPath = sp.resolve(path);
		isDirectory = isDirectory != null ? isDirectory : this._watched.has(path) || this._watched.has(fullPath);
		if (!this._throttle("remove", path, 100)) return;
		if (!isDirectory && this._watched.size === 1) this.add(directory, item, true);
		this._getWatchedDir(path).getChildren().forEach((nested) => this._remove(path, nested));
		const parent = this._getWatchedDir(directory);
		const wasTracked = parent.has(item);
		parent.remove(item);
		if (this._symlinkPaths.has(fullPath)) this._symlinkPaths.delete(fullPath);
		let relPath = path;
		if (this.options.cwd) relPath = sp.relative(this.options.cwd, path);
		if (this.options.awaitWriteFinish && this._pendingWrites.has(relPath)) {
			if (this._pendingWrites.get(relPath).cancelWait() === EVENTS.ADD) return;
		}
		this._watched.delete(path);
		this._watched.delete(fullPath);
		const eventName = isDirectory ? EVENTS.UNLINK_DIR : EVENTS.UNLINK;
		if (wasTracked && !this._isIgnored(path)) this._emit(eventName, path);
		this._closePath(path);
	}
	_closePath(path) {
		this._closeFile(path);
		const dir = sp.dirname(path);
		this._getWatchedDir(dir).remove(sp.basename(path));
	}
	_closeFile(path) {
		const closers = this._closers.get(path);
		if (!closers) return;
		closers.forEach((closer) => closer());
		this._closers.delete(path);
	}
	_addPathCloser(path, closer) {
		if (!closer) return;
		let list = this._closers.get(path);
		if (!list) {
			list = [];
			this._closers.set(path, list);
		}
		list.push(closer);
	}
	_readdirp(root, opts) {
		if (this.closed) return;
		let stream = readdirp(root, {
			type: EVENTS.ALL,
			alwaysStat: true,
			lstat: true,
			...opts,
			depth: 0
		});
		this._streams.add(stream);
		stream.once(STR_CLOSE, () => {
			stream = void 0;
		});
		stream.once(STR_END, () => {
			if (stream) {
				this._streams.delete(stream);
				stream = void 0;
			}
		});
		return stream;
	}
};
function watch$1(paths, options = {}) {
	const watcher = new FSWatcher(options);
	watcher.add(paths);
	return watcher;
}
var chokidar_default = {
	watch: watch$1,
	FSWatcher
};
const DEBOUNCE_DEFAULTS = { trailing: true };
function debounce(fn, wait = 25, options = {}) {
	options = {
		...DEBOUNCE_DEFAULTS,
		...options
	};
	if (!Number.isFinite(wait)) throw new TypeError("Expected `wait` to be a finite number");
	let leadingValue;
	let timeout;
	let resolveList = [];
	let currentPromise;
	let trailingArgs;
	const applyFn = (_this, args) => {
		currentPromise = _applyPromised(fn, _this, args);
		currentPromise.finally(() => {
			currentPromise = null;
			if (options.trailing && trailingArgs && !timeout) {
				const promise = applyFn(_this, trailingArgs);
				trailingArgs = null;
				return promise;
			}
		});
		return currentPromise;
	};
	const debounced = function(...args) {
		if (options.trailing) trailingArgs = args;
		if (currentPromise) return currentPromise;
		return new Promise((resolve) => {
			const shouldCallNow = !timeout && options.leading;
			clearTimeout(timeout);
			timeout = setTimeout(() => {
				timeout = null;
				const promise = options.leading ? leadingValue : applyFn(this, args);
				trailingArgs = null;
				for (const _resolve of resolveList) _resolve(promise);
				resolveList = [];
			}, wait);
			if (shouldCallNow) {
				leadingValue = applyFn(this, args);
				resolve(leadingValue);
			} else resolveList.push(resolve);
		});
	};
	const _clearTimeout = (timer) => {
		if (timer) {
			clearTimeout(timer);
			timeout = null;
		}
	};
	debounced.isPending = () => !!timeout;
	debounced.cancel = () => {
		_clearTimeout(timeout);
		resolveList = [];
		trailingArgs = null;
	};
	debounced.flush = () => {
		_clearTimeout(timeout);
		if (!trailingArgs || currentPromise) return;
		const args = trailingArgs;
		trailingArgs = null;
		return applyFn(this, args);
	};
	return debounced;
}
async function _applyPromised(fn, _this, args) {
	return await fn.apply(_this, args);
}
var D$1 = new Set([
	"area",
	"base",
	"br",
	"col",
	"embed",
	"hr",
	"img",
	"input",
	"keygen",
	"link",
	"meta",
	"param",
	"source",
	"track",
	"wbr"
]), x$1 = new Set(["script", "style"]), o = /(?:<(\/?)([a-zA-Z][a-zA-Z0-9\:-]*)(?:\s([^>]*?))?((?:\s*\/)?)>|(<\!\-\-)([\s\S]*?)(\-\->)|(<\!)([\s\S]*?)(>))/gm, b$1 = /[\@\.a-z0-9_\:\-]/i;
function I$1(e) {
	let t = {};
	if (e) {
		let i = "none", r, n = "", a, l;
		for (let c = 0; c < e.length; c++) {
			let d = e[c];
			i === "none" ? b$1.test(d) ? (r && (t[r] = n, r = void 0, n = ""), a = c, i = "key") : d === "=" && r && (i = "value") : i === "key" ? b$1.test(d) || (r = e.substring(a, c), d === "=" ? i = "value" : i = "none") : d === l && c > 0 && e[c - 1] !== "\\" ? l && (n = e.substring(a, c), l = void 0, i = "none") : (d === "\"" || d === "'") && !l && (a = c + 1, l = d);
		}
		i === "key" && a != null && a < e.length && (r = e.substring(a, e.length)), r && (t[r] = n);
	}
	return t;
}
function P$1(e) {
	let t = typeof e == "string" ? e : e.value, i, r, n, a, l, c, d, m, s, u = [];
	o.lastIndex = 0, r = i = {
		type: 0,
		children: []
	};
	let g = 0;
	function h() {
		a = t.substring(g, o.lastIndex - n[0].length), a && r.children.push({
			type: 2,
			value: a,
			parent: r
		});
	}
	for (; n = o.exec(t);) {
		if (c = n[5] || n[8], d = n[6] || n[9], m = n[7] || n[10], x$1.has(r.name) && n[2] !== r.name) {
			l = o.lastIndex - n[0].length, r.children.length > 0 && (r.children[0].value += n[0]);
			continue;
		} else if (c === "<!--") {
			if (l = o.lastIndex - n[0].length, x$1.has(r.name)) continue;
			s = {
				type: 3,
				value: d,
				parent: r,
				loc: [{
					start: l,
					end: l + c.length
				}, {
					start: o.lastIndex - m.length,
					end: o.lastIndex
				}]
			}, u.push(s), s.parent.children.push(s);
		} else if (c === "<!") l = o.lastIndex - n[0].length, s = {
			type: 4,
			value: d,
			parent: r,
			loc: [{
				start: l,
				end: l + c.length
			}, {
				start: o.lastIndex - m.length,
				end: o.lastIndex
			}]
		}, u.push(s), s.parent.children.push(s);
		else if (n[1] !== "/") if (h(), x$1.has(r.name)) {
			g = o.lastIndex, h();
			continue;
		} else s = {
			type: 1,
			name: n[2] + "",
			attributes: I$1(n[3]),
			parent: r,
			children: [],
			loc: [{
				start: o.lastIndex - n[0].length,
				end: o.lastIndex
			}]
		}, u.push(s), s.parent.children.push(s), n[4] && n[4].indexOf("/") > -1 || D$1.has(s.name) ? (s.loc[1] = s.loc[0], s.isSelfClosingTag = !0) : r = s;
		else h(), n[2] + "" === r.name ? (s = r, r = s.parent, s.loc.push({
			start: o.lastIndex - n[0].length,
			end: o.lastIndex
		}), a = t.substring(s.loc[0].end, s.loc[1].start), s.children.length === 0 && s.children.push({
			type: 2,
			value: a,
			parent: r
		})) : n[2] + "" === u[u.length - 1].name && u[u.length - 1].isSelfClosingTag === !0 && (s = u[u.length - 1], s.loc.push({
			start: o.lastIndex - n[0].length,
			end: o.lastIndex
		}));
		g = o.lastIndex;
	}
	return a = t.slice(g), r.children.push({
		type: 2,
		value: a,
		parent: r
	}), i;
}
var T$1 = class {
	constructor(t) {
		this.callback = t;
	}
	async visit(t, i, r) {
		if (await this.callback(t, i, r), Array.isArray(t.children)) {
			let n = [];
			for (let a = 0; a < t.children.length; a++) {
				let l = t.children[a];
				n.push(this.visit(l, t, a));
			}
			await Promise.all(n);
		}
	}
};
function z$1(e, t) {
	return new T$1(t).visit(e);
}
const NUMBER_CHAR_RE = /\d/;
const STR_SPLITTERS = [
	"-",
	"_",
	"/",
	"."
];
function isUppercase(char = "") {
	if (NUMBER_CHAR_RE.test(char)) return;
	return char !== char.toLowerCase();
}
function splitByCase(str, separators) {
	const splitters = separators ?? STR_SPLITTERS;
	const parts = [];
	if (!str || typeof str !== "string") return parts;
	let buff = "";
	let previousUpper;
	let previousSplitter;
	for (const char of str) {
		const isSplitter = splitters.includes(char);
		if (isSplitter === true) {
			parts.push(buff);
			buff = "";
			previousUpper = void 0;
			continue;
		}
		const isUpper = isUppercase(char);
		if (previousSplitter === false) {
			if (previousUpper === false && isUpper === true) {
				parts.push(buff);
				buff = char;
				previousUpper = isUpper;
				continue;
			}
			if (previousUpper === true && isUpper === false && buff.length > 1) {
				const lastChar = buff.at(-1);
				parts.push(buff.slice(0, Math.max(0, buff.length - 1)));
				buff = lastChar + char;
				previousUpper = isUpper;
				continue;
			}
		}
		buff += char;
		previousUpper = isUpper;
		previousSplitter = isSplitter;
	}
	parts.push(buff);
	return parts;
}
function upperFirst(str) {
	return str ? str[0].toUpperCase() + str.slice(1) : "";
}
function lowerFirst(str) {
	return str ? str[0].toLowerCase() + str.slice(1) : "";
}
function pascalCase(str, opts) {
	return str ? (Array.isArray(str) ? str : splitByCase(str)).map((p) => upperFirst(opts?.normalize ? p.toLowerCase() : p)).join("") : "";
}
function camelCase$1(str, opts) {
	return lowerFirst(pascalCase(str || "", opts));
}
function kebabCase$1(str, joiner) {
	return str ? (Array.isArray(str) ? str : splitByCase(str)).map((p) => p.toLowerCase()).join(joiner ?? "-") : "";
}
function toArray$3(val) {
	if (Array.isArray(val)) return val;
	return val === void 0 ? [] : [val];
}
function formatLineColumns(lines, linePrefix = "") {
	const maxLength = [];
	for (const line of lines) for (const [i, element] of line.entries()) maxLength[i] = Math.max(maxLength[i] || 0, element.length);
	return lines.map((l) => l.map((c, i) => linePrefix + c[i === 0 ? "padStart" : "padEnd"](maxLength[i])).join("  ")).join("\n");
}
function resolveValue(input) {
	return typeof input === "function" ? input() : input;
}
var CLIError = class extends Error {
	code;
	constructor(message, code) {
		super(message);
		this.name = "CLIError";
		this.code = code;
	}
};
function parseRawArgs(args = [], opts = {}) {
	const booleans = new Set(opts.boolean || []);
	const strings = new Set(opts.string || []);
	const aliasMap = opts.alias || {};
	const defaults = opts.default || {};
	const aliasToMain = /* @__PURE__ */ new Map();
	const mainToAliases = /* @__PURE__ */ new Map();
	for (const [key, value] of Object.entries(aliasMap)) {
		const targets = value;
		for (const target of targets) {
			aliasToMain.set(key, target);
			if (!mainToAliases.has(target)) mainToAliases.set(target, []);
			mainToAliases.get(target).push(key);
			aliasToMain.set(target, key);
			if (!mainToAliases.has(key)) mainToAliases.set(key, []);
			mainToAliases.get(key).push(target);
		}
	}
	const options = {};
	function getType(name) {
		if (booleans.has(name)) return "boolean";
		const aliases = mainToAliases.get(name) || [];
		for (const alias of aliases) if (booleans.has(alias)) return "boolean";
		return "string";
	}
	const allOptions = new Set([
		...booleans,
		...strings,
		...Object.keys(aliasMap),
		...Object.values(aliasMap).flat(),
		...Object.keys(defaults)
	]);
	for (const name of allOptions) if (!options[name]) options[name] = {
		type: getType(name),
		default: defaults[name]
	};
	for (const [alias, main] of aliasToMain.entries()) if (alias.length === 1 && options[main] && !options[main].short) options[main].short = alias;
	const processedArgs = [];
	const negatedFlags = {};
	for (let i = 0; i < args.length; i++) {
		const arg = args[i];
		if (arg === "--") {
			processedArgs.push(...args.slice(i));
			break;
		}
		if (arg.startsWith("--no-")) {
			const flagName = arg.slice(5);
			negatedFlags[flagName] = true;
			continue;
		}
		processedArgs.push(arg);
	}
	let parsed;
	try {
		parsed = parseArgs({
			args: processedArgs,
			options: Object.keys(options).length > 0 ? options : void 0,
			allowPositionals: true,
			strict: false
		});
	} catch {
		parsed = {
			values: {},
			positionals: processedArgs
		};
	}
	const out = { _: [] };
	out._ = parsed.positionals;
	for (const [key, value] of Object.entries(parsed.values)) out[key] = value;
	for (const [name] of Object.entries(negatedFlags)) out[name] = false;
	for (const [alias, main] of aliasToMain.entries()) {
		if (out[alias] !== void 0 && out[main] === void 0) out[main] = out[alias];
		if (out[main] !== void 0 && out[alias] === void 0) out[alias] = out[main];
	}
	return out;
}
const noColor = /* @__PURE__ */ (() => {
	const env = globalThis.process?.env ?? {};
	return env.NO_COLOR === "1" || env.TERM === "dumb" || env.TEST || env.CI;
})();
const _c = (c, r = 39) => (t) => noColor ? t : `\u001B[${c}m${t}\u001B[${r}m`;
const bold = /* @__PURE__ */ _c(1, 22);
const cyan = /* @__PURE__ */ _c(36);
const gray = /* @__PURE__ */ _c(90);
const underline = /* @__PURE__ */ _c(4, 24);
function parseArgs$1(rawArgs, argsDef) {
	const parseOptions = {
		boolean: [],
		string: [],
		alias: {},
		default: {}
	};
	const args = resolveArgs(argsDef);
	for (const arg of args) {
		if (arg.type === "positional") continue;
		if (arg.type === "string" || arg.type === "enum") parseOptions.string.push(arg.name);
		else if (arg.type === "boolean") parseOptions.boolean.push(arg.name);
		if (arg.default !== void 0) parseOptions.default[arg.name] = arg.default;
		if (arg.alias) parseOptions.alias[arg.name] = arg.alias;
		const camelName = camelCase$1(arg.name);
		const kebabName = kebabCase$1(arg.name);
		if (camelName !== arg.name || kebabName !== arg.name) {
			const existingAliases = toArray$3(parseOptions.alias[arg.name] || []);
			if (camelName !== arg.name && !existingAliases.includes(camelName)) existingAliases.push(camelName);
			if (kebabName !== arg.name && !existingAliases.includes(kebabName)) existingAliases.push(kebabName);
			if (existingAliases.length > 0) parseOptions.alias[arg.name] = existingAliases;
		}
	}
	const parsed = parseRawArgs(rawArgs, parseOptions);
	const [ ...positionalArguments] = parsed._;
	const parsedArgsProxy = new Proxy(parsed, { get(target, prop) {
		return target[prop] ?? target[camelCase$1(prop)] ?? target[kebabCase$1(prop)];
	} });
	for (const [, arg] of args.entries()) if (arg.type === "positional") {
		const nextPositionalArgument = positionalArguments.shift();
		if (nextPositionalArgument !== void 0) parsedArgsProxy[arg.name] = nextPositionalArgument;
		else if (arg.default === void 0 && arg.required !== false) throw new CLIError(`Missing required positional argument: ${arg.name.toUpperCase()}`, "EARG");
		else parsedArgsProxy[arg.name] = arg.default;
	} else if (arg.type === "enum") {
		const argument = parsedArgsProxy[arg.name];
		const options = arg.options || [];
		if (argument !== void 0 && options.length > 0 && !options.includes(argument)) throw new CLIError(`Invalid value for argument: ${cyan(`--${arg.name}`)} (${cyan(argument)}). Expected one of: ${options.map((o) => cyan(o)).join(", ")}.`, "EARG");
	} else if (arg.required && parsedArgsProxy[arg.name] === void 0) throw new CLIError(`Missing required argument: --${arg.name}`, "EARG");
	return parsedArgsProxy;
}
function resolveArgs(argsDef) {
	const args = [];
	for (const [name, argDef] of Object.entries(argsDef || {})) args.push({
		...argDef,
		name,
		alias: toArray$3(argDef.alias)
	});
	return args;
}
function defineCommand(def) {
	return def;
}
async function runCommand(cmd, opts) {
	const cmdArgs = await resolveValue(cmd.args || {});
	const parsedArgs = parseArgs$1(opts.rawArgs, cmdArgs);
	const context = {
		rawArgs: opts.rawArgs,
		args: parsedArgs,
		data: opts.data,
		cmd
	};
	if (typeof cmd.setup === "function") await cmd.setup(context);
	let result;
	try {
		const subCommands = await resolveValue(cmd.subCommands);
		if (subCommands && Object.keys(subCommands).length > 0) {
			const subCommandArgIndex = opts.rawArgs.findIndex((arg) => !arg.startsWith("-"));
			const subCommandName = opts.rawArgs[subCommandArgIndex];
			if (subCommandName) {
				if (!subCommands[subCommandName]) throw new CLIError(`Unknown command ${cyan(subCommandName)}`, "E_UNKNOWN_COMMAND");
				const subCommand = await resolveValue(subCommands[subCommandName]);
				if (subCommand) await runCommand(subCommand, { rawArgs: opts.rawArgs.slice(subCommandArgIndex + 1) });
			} else if (!cmd.run) throw new CLIError(`No command specified.`, "E_NO_COMMAND");
		}
		if (typeof cmd.run === "function") result = await cmd.run(context);
	} finally {
		if (typeof cmd.cleanup === "function") await cmd.cleanup(context);
	}
	return { result };
}
async function resolveSubCommand(cmd, rawArgs, parent) {
	const subCommands = await resolveValue(cmd.subCommands);
	if (subCommands && Object.keys(subCommands).length > 0) {
		const subCommandArgIndex = rawArgs.findIndex((arg) => !arg.startsWith("-"));
		const subCommandName = rawArgs[subCommandArgIndex];
		const subCommand = await resolveValue(subCommands[subCommandName]);
		if (subCommand) return resolveSubCommand(subCommand, rawArgs.slice(subCommandArgIndex + 1), cmd);
	}
	return [cmd, parent];
}
async function showUsage(cmd, parent) {
	try {
		console.log(await renderUsage(cmd, parent) + "\n");
	} catch (error) {
		console.error(error);
	}
}
const negativePrefixRe = /^no[-A-Z]/;
async function renderUsage(cmd, parent) {
	const cmdMeta = await resolveValue(cmd.meta || {});
	const cmdArgs = resolveArgs(await resolveValue(cmd.args || {}));
	const parentMeta = await resolveValue(parent?.meta || {});
	const commandName = `${parentMeta.name ? `${parentMeta.name} ` : ""}` + (cmdMeta.name || process.argv[1]);
	const argLines = [];
	const posLines = [];
	const commandsLines = [];
	const usageLine = [];
	for (const arg of cmdArgs) if (arg.type === "positional") {
		const name = arg.name.toUpperCase();
		const isRequired = arg.required !== false && arg.default === void 0;
		const defaultHint = arg.default ? `="${arg.default}"` : "";
		posLines.push([
			cyan(name + defaultHint),
			arg.description || "",
			arg.valueHint ? `<${arg.valueHint}>` : ""
		]);
		usageLine.push(isRequired ? `<${name}>` : `[${name}]`);
	} else {
		const isRequired = arg.required === true && arg.default === void 0;
		const argStr = [...(arg.alias || []).map((a) => `-${a}`), `--${arg.name}`].join(", ") + (arg.type === "string" && (arg.valueHint || arg.default) ? `=${arg.valueHint ? `<${arg.valueHint}>` : `"${arg.default || ""}"`}` : "") + (arg.type === "enum" && arg.options ? `=<${arg.options.join("|")}>` : "");
		argLines.push([cyan(argStr + (isRequired ? " (required)" : "")), arg.description || ""]);
		if (arg.type === "boolean" && (arg.default === true || arg.negativeDescription) && !negativePrefixRe.test(arg.name)) {
			const negativeArgStr = [...(arg.alias || []).map((a) => `--no-${a}`), `--no-${arg.name}`].join(", ");
			argLines.push([cyan(negativeArgStr + (isRequired ? " (required)" : "")), arg.negativeDescription || ""]);
		}
		if (isRequired) usageLine.push(argStr);
	}
	if (cmd.subCommands) {
		const commandNames = [];
		const subCommands = await resolveValue(cmd.subCommands);
		for (const [name, sub] of Object.entries(subCommands)) {
			const meta = await resolveValue((await resolveValue(sub))?.meta);
			if (meta?.hidden) continue;
			commandsLines.push([cyan(name), meta?.description || ""]);
			commandNames.push(name);
		}
		usageLine.push(commandNames.join("|"));
	}
	const usageLines = [];
	const version = cmdMeta.version || parentMeta.version;
	usageLines.push(gray(`${cmdMeta.description} (${commandName + (version ? ` v${version}` : "")})`), "");
	const hasOptions = argLines.length > 0 || posLines.length > 0;
	usageLines.push(`${underline(bold("USAGE"))} ${cyan(`${commandName}${hasOptions ? " [OPTIONS]" : ""} ${usageLine.join(" ")}`)}`, "");
	if (posLines.length > 0) {
		usageLines.push(underline(bold("ARGUMENTS")), "");
		usageLines.push(formatLineColumns(posLines, "  "));
		usageLines.push("");
	}
	if (argLines.length > 0) {
		usageLines.push(underline(bold("OPTIONS")), "");
		usageLines.push(formatLineColumns(argLines, "  "));
		usageLines.push("");
	}
	if (commandsLines.length > 0) {
		usageLines.push(underline(bold("COMMANDS")), "");
		usageLines.push(formatLineColumns(commandsLines, "  "));
		usageLines.push("", `Use ${cyan(`${commandName} <command> --help`)} for more information about a command.`);
	}
	return usageLines.filter((l) => typeof l === "string").join("\n");
}
async function runMain(cmd, opts = {}) {
	const rawArgs = opts.rawArgs || process.argv.slice(2);
	const showUsage$1 = opts.showUsage || showUsage;
	try {
		if (rawArgs.includes("--help") || rawArgs.includes("-h")) {
			await showUsage$1(...await resolveSubCommand(cmd, rawArgs));
			process.exit(0);
		} else if (rawArgs.length === 1 && rawArgs[0] === "--version") {
			const meta = typeof cmd.meta === "function" ? await cmd.meta() : await cmd.meta;
			if (!meta?.version) throw new CLIError("No version specified", "E_NO_VERSION");
			console.log(meta.version);
		} else await runCommand(cmd, { rawArgs });
	} catch (error) {
		if (error instanceof CLIError) {
			await showUsage$1(...await resolveSubCommand(cmd, rawArgs));
			console.error(error.message);
		} else console.error(error, "\n");
		process.exit(1);
	}
}
function exactRegex(str, flags) {
	return new RegExp(`^${escapeRegex(str)}$`, flags);
}
const escapeRegexRE = /[-/\\^$*+?.()|[\]{}]/g;
function escapeRegex(str) {
	return str.replace(escapeRegexRE, "\\$&");
}
function parseIdQuery(id) {
	if (!id.includes("?")) return {
		filename: id,
		query: {}
	};
	const [filename, rawQuery] = id.split(`?`, 2);
	return {
		filename,
		query: Object.fromEntries(new URLSearchParams(rawQuery))
	};
}
function toAssetsVirtual(options) {
	return `virtual:fullstack/assets?${new URLSearchParams(options)}&lang.js`;
}
function parseAssetsVirtual(id) {
	if (id.startsWith("\0virtual:fullstack/assets?")) return parseIdQuery(id).query;
}
function createVirtualPlugin(name, load) {
	name = "virtual:" + name;
	return {
		name: `fullstack:virtual-${name}`,
		resolveId: {
			filter: { id: exactRegex(name) },
			handler(source, _importer, _options) {
				return source === name ? "\0" + name : void 0;
			}
		},
		load: {
			filter: { id: exactRegex("\0" + name) },
			handler(id, options) {
				return load.apply(this, [id, options]);
			}
		}
	};
}
function normalizeRelativePath(s) {
	s = normalizePath(s);
	return s[0] === "." ? s : "./" + s;
}
function hashString(v) {
	return createHash("sha256").update(v).digest().toString("hex").slice(0, 12);
}
const VALID_ID_PREFIX = `/@id/`;
const NULL_BYTE_PLACEHOLDER = `__x00__`;
const FS_PREFIX = `/@fs/`;
function wrapId$1(id) {
	return id.startsWith(VALID_ID_PREFIX) ? id : VALID_ID_PREFIX + id.replace("\0", NULL_BYTE_PLACEHOLDER);
}
function withTrailingSlash(path$1) {
	if (path$1[path$1.length - 1] !== "/") return `${path$1}/`;
	return path$1;
}
const postfixRE = /[?#].*$/;
function cleanUrl(url) {
	return url.replace(postfixRE, "");
}
function splitFileAndPostfix(path$1) {
	const file = cleanUrl(path$1);
	return {
		file,
		postfix: path$1.slice(file.length)
	};
}
const windowsSlashRE = /\\/g;
function slash(p) {
	return p.replace(windowsSlashRE, "/");
}
const isWindows = typeof process !== "undefined" && process.platform === "win32";
function injectQuery(url, queryToInject) {
	const { file, postfix } = splitFileAndPostfix(url);
	return `${isWindows ? slash(file) : file}?${queryToInject}${postfix[0] === "?" ? `&${postfix.slice(1)}` : postfix}`;
}
function normalizeResolvedIdToUrl(environment, url, resolved) {
	const root = environment.config.root;
	const depsOptimizer = environment.depsOptimizer;
	if (resolved.id.startsWith(withTrailingSlash(root))) url = resolved.id.slice(root.length);
	else if (depsOptimizer?.isOptimizedDepFile(resolved.id) || resolved.id !== "/@react-refresh" && path.isAbsolute(resolved.id) && fs.existsSync(cleanUrl(resolved.id))) url = path.posix.join(FS_PREFIX, resolved.id);
	else url = resolved.id;
	if (url[0] !== "." && url[0] !== "/") url = wrapId$1(resolved.id);
	return url;
}
function normalizeViteImportAnalysisUrl(environment, id) {
	let url = normalizeResolvedIdToUrl(environment, id, { id });
	if (environment.config.consumer === "client") {
		const mod = environment.moduleGraph.getModuleById(id);
		if (mod && mod.lastHMRTimestamp > 0) url = injectQuery(url, `t=${mod.lastHMRTimestamp}`);
	}
	return url;
}
function evalValue(rawValue) {
	return new Function(`
    var console, exports, global, module, process, require
    return (\n${rawValue}\n)
  `)();
}
const directRequestRE = /(\?|&)direct=?(?:&|$)/;
function assetsPlugin(pluginOpts) {
	let server;
	let resolvedConfig;
	const importAssetsMetaMap = {};
	const bundleMap = {};
	async function processAssetsImport(ctx, id, options) {
		if (ctx.environment.mode === "dev") {
			const result = {
				entry: void 0,
				js: [],
				css: []
			};
			const environment = server.environments[options.environment];
			assert$1(environment, `Unknown environment: ${options.environment}`);
			if (options.environment === "client") result.entry = assetsURLDev(normalizeViteImportAnalysisUrl(environment, id).slice(1), resolvedConfig);
			if (environment.name !== "client") {
				const collected = await collectCss(environment, id, { eager: pluginOpts?.experimental?.devEagerTransform ?? true });
				result.css = collected.hrefs.map((href, i) => ({
					href: assetsURLDev(href.slice(1), resolvedConfig),
					"data-vite-dev-id": collected.ids[i]
				}));
			}
			return JSON.stringify(result);
		} else {
			const map = importAssetsMetaMap[options.environment] ??= {};
			const meta = {
				id,
				key: path.relative(resolvedConfig.root, id),
				importerEnvironment: ctx.environment.name,
				isEntry: !!(map[id]?.isEntry || options.isEntry)
			};
			map[id] = meta;
			return `__assets_manifest[${JSON.stringify(options.environment)}][${JSON.stringify(meta.key)}]`;
		}
	}
	let writeAssetsManifestCalled = false;
	async function writeAssetsManifest(builder) {
		if (writeAssetsManifestCalled) return;
		writeAssetsManifestCalled = true;
		const manifest = {};
		for (const [environmentName, metas] of Object.entries(importAssetsMetaMap)) {
			const bundle = bundleMap[environmentName];
			const assetDepsMap = collectAssetDeps(bundle);
			for (const [id, meta] of Object.entries(metas)) {
				const found = assetDepsMap[id];
				if (!found) {
					builder.config.logger.error(`[vite-plugin-fullstack] failed to find built chunk for ${meta.id} imported by ${meta.importerEnvironment} environment`);
					return;
				}
				const result = {
					js: [],
					css: []
				};
				const { chunk, deps } = found;
				if (environmentName === "client") {
					result.entry = assetsURL(chunk.fileName, builder.config);
					result.js = deps.js.map((fileName) => ({ href: assetsURL(fileName, builder.config) }));
				}
				result.css = deps.css.map((fileName) => ({ href: assetsURL(fileName, builder.config) }));
				if (!builder.environments[environmentName].config.build.cssCodeSplit) {
					const singleCss = Object.values(bundle).find((v) => v.type === "asset" && v.originalFileNames.includes("style.css"));
					if (singleCss) result.css.push({ href: assetsURL(singleCss.fileName, builder.config) });
				}
				(manifest[environmentName] ??= {})[meta.key] = result;
			}
		}
		const importerEnvironments = new Set(Object.values(importAssetsMetaMap).flatMap((metas) => Object.values(metas)).flatMap((meta) => meta.importerEnvironment));
		for (const environmentName of importerEnvironments) {
			const outDir = builder.environments[environmentName].config.build.outDir;
			fs.writeFileSync(path.join(outDir, BUILD_ASSETS_MANIFEST_NAME), `export default ${serializeValueWithRuntime(manifest)};`);
			const clientOutDir = builder.environments["client"].config.build.outDir;
			for (const asset of Object.values(bundleMap[environmentName])) if (asset.type === "asset") {
				const srcFile = path.join(outDir, asset.fileName);
				const destFile = path.join(clientOutDir, asset.fileName);
				fs.mkdirSync(path.dirname(destFile), { recursive: true });
				fs.copyFileSync(srcFile, destFile);
			}
		}
	}
	return [
		{
			name: "fullstack:assets",
			sharedDuringBuild: true,
			configureServer(server_) {
				server = server_;
			},
			configResolved(config) {
				resolvedConfig = config;
			},
			configEnvironment(name) {
				if ((pluginOpts?.serverEnvironments ?? ["ssr"]).includes(name)) return { build: { emitAssets: true } };
			},
			transform: {
				filter: { code: /import\.meta\.vite\.assets\(/ },
				async handler(code, id, _options) {
					const output = new MagicString(code);
					const strippedCode = stripLiteral(code);
					const newImports = /* @__PURE__ */ new Set();
					for (const match of code.matchAll(/import\.meta\.vite\.assets\(([\s\S]*?)\)/dg)) {
						const [start, end] = match.indices[0];
						if (!strippedCode.slice(start, end).includes("import.meta.vite.assets")) continue;
						if (this.environment.name === "client") {
							const replacement$1 = `(${JSON.stringify(EMPTY_ASSETS)})`;
							output.update(start, end, replacement$1);
							continue;
						}
						const argCode = match[1].trim();
						const options = {
							import: id,
							environment: void 0,
							asEntry: false
						};
						if (argCode) {
							const argValue = evalValue(argCode);
							Object.assign(options, argValue);
						}
						const environments = options.environment ? [options.environment] : ["client", this.environment.name];
						const importedNames = [];
						for (const environment of environments) {
							const importSource = toAssetsVirtual({
								import: options.import,
								importer: id,
								environment,
								entry: options.asEntry ? "1" : ""
							});
							const importedName = `__assets_${hashString(importSource)}`;
							newImports.add(`;import ${importedName} from ${JSON.stringify(importSource)};\n`);
							importedNames.push(importedName);
						}
						let replacement = importedNames[0];
						if (importedNames.length > 1) {
							newImports.add(`;import * as __assets_runtime from "virtual:fullstack/runtime";\n`);
							replacement = `__assets_runtime.mergeAssets(${importedNames.join(", ")})`;
						}
						output.update(start, end, `(${replacement})`);
					}
					if (output.hasChanged()) {
						for (const newImport of newImports) output.append(newImport);
						return {
							code: output.toString(),
							map: output.generateMap({ hires: "boundary" })
						};
					}
				}
			},
			resolveId: {
				filter: { id: /^virtual:fullstack\// },
				handler(source) {
					if (source === "virtual:fullstack/runtime") return "\0" + source;
					if (source.startsWith("virtual:fullstack/assets?")) return "\0" + source;
					if (source === "virtual:fullstack/assets-manifest") {
						assert$1.notEqual(this.environment.name, "client");
						assert$1.equal(this.environment.mode, "build");
						return {
							id: source,
							external: true
						};
					}
				}
			},
			load: {
				filter: { id: /^\0virtual:fullstack\// },
				async handler(id) {
					if (id === "\0virtual:fullstack/runtime") return `export const mergeAssets = ${(await Promise.resolve().then(() => runtime_exports)).mergeAssets.toString()};`;
					const parsed = parseAssetsVirtual(id);
					if (!parsed) return;
					assert$1.notEqual(this.environment.name, "client");
					const resolved = await this.resolve(parsed.import, parsed.importer);
					assert$1(resolved, `Failed to resolve: ${parsed.import}`);
					const s = new MagicString("");
					const code = await processAssetsImport(this, resolved.id, {
						environment: parsed.environment,
						isEntry: !!parsed.entry
					});
					s.append(`export default ${code};\n`);
					if (this.environment.mode === "build") s.prepend(`import __assets_manifest from "virtual:fullstack/assets-manifest";\n`);
					return s.toString();
				}
			},
			renderChunk(code, chunk) {
				if (code.includes("virtual:fullstack/assets-manifest")) {
					const replacement = normalizeRelativePath(path.relative(path.join(chunk.fileName, ".."), BUILD_ASSETS_MANIFEST_NAME));
					code = code.replaceAll("virtual:fullstack/assets-manifest", () => replacement);
					return { code };
				}
			},
			writeBundle(_options, bundle) {
				bundleMap[this.environment.name] = bundle;
			},
			buildStart() {
				if (this.environment.mode == "build" && this.environment.name === "client") {
					if (importAssetsMetaMap["client"]) {
						for (const meta of Object.values(importAssetsMetaMap["client"])) if (meta.isEntry) this.emitFile({
							type: "chunk",
							id: meta.id,
							preserveSignature: "exports-only"
						});
					}
				}
			},
			buildApp: {
				order: "pre",
				async handler(builder) {
					builder.writeAssetsManifest = async () => {
						await writeAssetsManifest(builder);
					};
				}
			}
		},
		{
			name: "fullstack:write-assets-manifest-post",
			buildApp: {
				order: "post",
				async handler(builder) {
					await builder.writeAssetsManifest();
				}
			}
		},
		{
			name: "fullstack:assets-query",
			sharedDuringBuild: true,
			resolveId: {
				order: "pre",
				filter: { id: /[?&]assets/ },
				handler(source) {
					const { query } = parseIdQuery(source);
					if (typeof query["assets"] !== "undefined") {
						if (this.environment.name === "client") return `\0virtual:fullstack/empty-assets`;
					}
				}
			},
			load: {
				filter: { id: [/^\0virtual:fullstack\/empty-assets$/, /[?&]assets/] },
				async handler(id) {
					if (id === "\0virtual:fullstack/empty-assets") return `export default ${JSON.stringify(EMPTY_ASSETS)}`;
					const { filename, query } = parseIdQuery(id);
					const value = query["assets"];
					if (typeof value !== "undefined") {
						const s = new MagicString("");
						const codes = [];
						if (value) {
							const code = await processAssetsImport(this, filename, {
								environment: value,
								isEntry: value === "client"
							});
							codes.push(code);
						} else {
							const code1 = await processAssetsImport(this, filename, {
								environment: "client",
								isEntry: false
							});
							const code2 = await processAssetsImport(this, filename, {
								environment: this.environment.name,
								isEntry: false
							});
							codes.push(code1, code2);
						}
						s.append(`
import * as __assets_runtime from "virtual:fullstack/runtime";\n
export default __assets_runtime.mergeAssets(${codes.join(", ")});
`);
						if (this.environment.mode === "build") s.prepend(`import __assets_manifest from "virtual:fullstack/assets-manifest";\n`);
						return {
							code: s.toString(),
							moduleSideEffects: false
						};
					}
				}
			},
			hotUpdate(ctx) {
				if (this.environment.name === "rsc") {
					const mods = collectModuleDependents(ctx.modules);
					for (const mod of mods) if (mod.id) {
						const ids = [
							`${mod.id}?assets`,
							`${mod.id}?assets=client`,
							`${mod.id}?assets=${this.environment.name}`
						];
						for (const id of ids) invalidteModuleById(this.environment, id);
					}
				}
			}
		},
		{
			...createVirtualPlugin("fullstack/client-fallback", () => "export {}"),
			configEnvironment: {
				order: "post",
				handler(name, config, _env) {
					if (name === "client") {
						if ((pluginOpts?.experimental?.clientBuildFallback ?? true) && !config.build?.rollupOptions?.input) return { build: { rollupOptions: { input: { __fallback: "virtual:fullstack/client-fallback" } } } };
					}
				}
			},
			generateBundle(_optoins, bundle) {
				if (this.environment.name !== "client") return;
				for (const [k, v] of Object.entries(bundle)) if (v.type === "chunk" && v.name === "__fallback") delete bundle[k];
			}
		},
		patchViteClientPlugin(),
		patchVueScopeCssHmr(),
		patchCssLinkSelfAccept()
	];
}
const EMPTY_ASSETS = {
	js: [],
	css: []
};
const BUILD_ASSETS_MANIFEST_NAME = "__fullstack_assets_manifest.js";
async function collectCss(environment, entryId, options) {
	const visited = /* @__PURE__ */ new Set();
	const cssIds = /* @__PURE__ */ new Set();
	async function recurse(id) {
		if (visited.has(id) || parseAssetsVirtual(id) || "assets" in parseIdQuery(id).query) return;
		visited.add(id);
		const mod = environment.moduleGraph.getModuleById(id);
		if (!mod) return;
		if (options.eager && !mod?.transformResult) try {
			await environment.transformRequest(id);
		} catch (e) {
			console.error(`[collectCss] Failed to transform '${id}'`, e);
		}
		for (const next of mod?.importedModules ?? []) if (next.id) if (isCSSRequest(next.id)) {
			if (hasSpecialCssQuery(next.id)) continue;
			cssIds.add(next.id);
		} else await recurse(next.id);
	}
	await recurse(entryId);
	const hrefs = [...cssIds].map((id) => normalizeViteImportAnalysisUrl(environment, id));
	return {
		ids: [...cssIds],
		hrefs
	};
}
function invalidteModuleById(environment, id) {
	const mod = environment.moduleGraph.getModuleById(id);
	if (mod) environment.moduleGraph.invalidateModule(mod);
	return mod;
}
function collectModuleDependents(mods) {
	const visited = /* @__PURE__ */ new Set();
	function recurse(mod) {
		if (visited.has(mod)) return;
		visited.add(mod);
		for (const importer of mod.importers) recurse(importer);
	}
	for (const mod of mods) recurse(mod);
	return [...visited];
}
function hasSpecialCssQuery(id) {
	return /[?&](url|inline|raw)(\b|=|&|$)/.test(id);
}
function collectAssetDeps(bundle) {
	const chunkToDeps = /* @__PURE__ */ new Map();
	for (const chunk of Object.values(bundle)) if (chunk.type === "chunk") chunkToDeps.set(chunk, collectAssetDepsInner(chunk.fileName, bundle));
	const idToDeps = {};
	for (const [chunk, deps] of chunkToDeps.entries()) for (const id of chunk.moduleIds) idToDeps[id] = {
		chunk,
		deps
	};
	return idToDeps;
}
function collectAssetDepsInner(fileName, bundle) {
	const visited = /* @__PURE__ */ new Set();
	const css = [];
	function recurse(k) {
		if (visited.has(k)) return;
		visited.add(k);
		const v = bundle[k];
		assert$1(v, `Not found '${k}' in the bundle`);
		if (v.type === "chunk") {
			css.push(...v.viteMetadata?.importedCss ?? []);
			for (const k2 of v.imports) if (k2 in bundle) recurse(k2);
		}
	}
	recurse(fileName);
	return {
		js: [...visited],
		css: [...new Set(css)]
	};
}
function patchViteClientPlugin() {
	const viteClientPath = normalizePath(fileURLToPath(import.meta.resolve("vite/dist/client/client.mjs")));
	function endIndexOf(code, searchValue) {
		const i = code.lastIndexOf(searchValue);
		return i === -1 ? i : i + searchValue.length;
	}
	return {
		name: "fullstack:patch-vite-client",
		transform: {
			filter: { id: exactRegex(viteClientPath) },
			handler(code, id) {
				if (id === viteClientPath) {
					if (code.includes("linkSheetsMap")) return;
					const s = new MagicString(code);
					s.prependLeft(code.indexOf("const sheetsMap"), `\
const linkSheetsMap = new Map();
document
  .querySelectorAll('link[rel="stylesheet"][data-vite-dev-id]')
  .forEach((el) => {
    linkSheetsMap.set(el.getAttribute('data-vite-dev-id'), el)
  });
`);
					s.appendLeft(endIndexOf(code, `function updateStyle(id, content) {`), `if (linkSheetsMap.has(id)) { return }`);
					s.appendLeft(endIndexOf(code, `function removeStyle(id) {`), `
const link = linkSheetsMap.get(id);
if (link) {
  document
    .querySelectorAll(
      'link[rel="stylesheet"][data-vite-dev-id]',
    )
    .forEach((el) => {
      if (el.getAttribute('data-vite-dev-id') === id) {
        el.remove()
      }
    })
  linkSheetsMap.delete(id)
}
`);
					return s.toString();
				}
			}
		}
	};
}
function patchVueScopeCssHmr() {
	return {
		name: "fullstack:patch-vue-scoped-css-hmr",
		configureServer(server) {
			server.middlewares.use((req, _res, next) => {
				if (req.headers.accept?.includes("text/css") && req.url?.includes("&lang.css=")) req.url = req.url.replace("&lang.css=", "?lang.css");
				next();
			});
		}
	};
}
function patchCssLinkSelfAccept() {
	return {
		name: "fullstack:patch-css-link-self-accept",
		apply: "serve",
		transform: {
			order: "post",
			handler(_code, id, _options) {
				if (this.environment.name === "client" && this.environment.mode === "dev" && isCSSRequest(id) && directRequestRE.test(id)) {
					const mod = this.environment.moduleGraph.getModuleById(id);
					if (mod && !mod.isSelfAccepting) mod.isSelfAccepting = true;
				}
			}
		}
	};
}
var BuildAssetsURLWithRuntime = class {
	constructor(runtime) {
		this.runtime = runtime;
	}
};
function serializeValueWithRuntime(value) {
	const replacements = [];
	let result = JSON.stringify(value, (_key, value$1) => {
		if (value$1 instanceof BuildAssetsURLWithRuntime) {
			const placeholder = `__runtime_placeholder_${replacements.length}__`;
			replacements.push([placeholder, value$1.runtime]);
			return placeholder;
		}
		return value$1;
	}, 2);
	for (const [placeholder, runtime] of replacements) result = result.replace(`"${placeholder}"`, runtime);
	return result;
}
function assetsURL(url, config) {
	if (config.command === "build" && typeof config.experimental?.renderBuiltUrl === "function") {
		const result = config.experimental.renderBuiltUrl(url, {
			type: "asset",
			hostType: "js",
			ssr: true,
			hostId: ""
		});
		if (typeof result === "object") {
			if (result.runtime) return new BuildAssetsURLWithRuntime(result.runtime);
			assert$1(!result.relative, "\"result.relative\" not supported on renderBuiltUrl() for fullstack plugin");
		} else if (result) return result;
	}
	return config.base + url;
}
function assetsURLDev(url, config) {
	return config.base + url;
}
var runtime_exports = /* @__PURE__ */ __exportAll$1({ mergeAssets: () => mergeAssets });
function mergeAssets(...args) {
	const js = uniqBy(args.flatMap((h) => h.js), (a) => a.href);
	const css = uniqBy(args.flatMap((h) => h.css), (a) => a.href);
	const raw = {
		entry: args.filter((arg) => arg.entry)?.[0]?.entry,
		js,
		css
	};
	return {
		...raw,
		merge: (...args$1) => mergeAssets(raw, ...args$1)
	};
	function uniqBy(array, key) {
		const seen = /* @__PURE__ */ new Set();
		return array.filter((item) => {
			const k = key(item);
			if (seen.has(k)) return false;
			seen.add(k);
			return true;
		});
	}
}
var dist_exports$2 = /* @__PURE__ */ __exportAll$1({ default: () => alias });
function matches(pattern, importee) {
	if (pattern instanceof RegExp) return pattern.test(importee);
	if (importee.length < pattern.length) return false;
	if (importee === pattern) return true;
	return importee.startsWith(pattern + "/");
}
function getEntries({ entries, customResolver }) {
	if (!entries) return [];
	const resolverFunctionFromOptions = resolveCustomResolver(customResolver);
	if (Array.isArray(entries)) return entries.map((entry) => {
		return {
			find: entry.find,
			replacement: entry.replacement,
			resolverFunction: resolveCustomResolver(entry.customResolver) || resolverFunctionFromOptions
		};
	});
	return Object.entries(entries).map(([key, value]) => {
		return {
			find: key,
			replacement: value,
			resolverFunction: resolverFunctionFromOptions
		};
	});
}
function getHookFunction(hook) {
	if (typeof hook === "function") return hook;
	if (hook && "handler" in hook && typeof hook.handler === "function") return hook.handler;
	return null;
}
function resolveCustomResolver(customResolver) {
	if (typeof customResolver === "function") return customResolver;
	if (customResolver) return getHookFunction(customResolver.resolveId);
	return null;
}
function alias(options = {}) {
	const entries = getEntries(options);
	if (entries.length === 0) return {
		name: "alias",
		resolveId: () => null
	};
	return {
		name: "alias",
		async buildStart(inputOptions) {
			await Promise.all([...Array.isArray(options.entries) ? options.entries : [], options].map(({ customResolver }) => customResolver && getHookFunction(customResolver.buildStart)?.call(this, inputOptions)));
		},
		resolveId(importee, importer, resolveOptions) {
			const matchedEntry = entries.find((entry) => matches(entry.find, importee));
			if (!matchedEntry) return null;
			const updatedId = importee.replace(matchedEntry.find, matchedEntry.replacement);
			if (matchedEntry.resolverFunction) return matchedEntry.resolverFunction.call(this, updatedId, importer, resolveOptions);
			return this.resolve(updatedId, importer, Object.assign({ skipSelf: true }, resolveOptions)).then((resolved) => {
				if (resolved) return resolved;
				if (!path.isAbsolute(updatedId)) this.warn(`rewrote ${importee} to ${updatedId} but was not an absolute path and was not handled by other plugins. This will lead to duplicated modules for the same path. To avoid duplicating modules, you should resolve to an absolute path.`);
				return { id: updatedId };
			});
		}
	};
}
var es_exports = /* @__PURE__ */ __exportAll$1({ default: () => inject });
var escape = function(str) {
	return str.replace(/[-[\]/{}()*+?.\\^$|]/g, "\\$&");
};
var isReference$1 = function(node, parent) {
	if (node.type === "MemberExpression") return !node.computed && isReference$1(node.object, node);
	if (node.type === "Identifier") {
		if (parent.type === "MemberExpression") return parent.computed || node === parent.object;
		if (parent.type === "Property" && node !== parent.value) return false;
		if (parent.type === "MethodDefinition") return false;
		if (parent.type === "ExportSpecifier" && node !== parent.local) return false;
		if (parent.type === "ImportSpecifier" && node === parent.imported) return false;
		return true;
	}
	return false;
};
var flatten = function(startNode) {
	var parts = [];
	var node = startNode;
	while (node.type === "MemberExpression") {
		parts.unshift(node.property.name);
		node = node.object;
	}
	var name = node.name;
	parts.unshift(name);
	return {
		name,
		keypath: parts.join(".")
	};
};
function inject(options) {
	if (!options) throw new Error("Missing options");
	var filter = createFilter$2(options.include, options.exclude);
	var modules = options.modules;
	if (!modules) {
		modules = Object.assign({}, options);
		delete modules.include;
		delete modules.exclude;
		delete modules.sourceMap;
		delete modules.sourcemap;
	}
	var modulesMap = new Map(Object.entries(modules));
	if (sep$1 !== "/") modulesMap.forEach(function(mod, key) {
		modulesMap.set(key, Array.isArray(mod) ? [mod[0].split(sep$1).join("/"), mod[1]] : mod.split(sep$1).join("/"));
	});
	var firstpass = new RegExp("(?:" + Array.from(modulesMap.keys()).map(escape).join("|") + ")", "g");
	var sourceMap = options.sourceMap !== false && options.sourcemap !== false;
	return {
		name: "inject",
		transform: function transform(code, id) {
			if (!filter(id)) return null;
			if (code.search(firstpass) === -1) return null;
			if (sep$1 !== "/") id = id.split(sep$1).join("/");
			var ast = null;
			try {
				ast = this.parse(code);
			} catch (err) {
				this.warn({
					code: "PARSE_ERROR",
					message: "rollup-plugin-inject: failed to parse " + id + ". Consider restricting the plugin to particular files via options.include"
				});
			}
			if (!ast) return null;
			var imports = /* @__PURE__ */ new Set();
			ast.body.forEach(function(node) {
				if (node.type === "ImportDeclaration") node.specifiers.forEach(function(specifier) {
					imports.add(specifier.local.name);
				});
			});
			var scope = attachScopes(ast, "scope");
			var magicString = new MagicString(code);
			var newImports = /* @__PURE__ */ new Map();
			function handleReference(node, name, keypath) {
				var mod = modulesMap.get(keypath);
				if (mod && !imports.has(name) && !scope.contains(name)) {
					if (typeof mod === "string") mod = [mod, "default"];
					if (mod[0] === id) return false;
					var hash = keypath + ":" + mod[0] + ":" + mod[1];
					var importLocalName = name === keypath ? name : makeLegalIdentifier("$inject_" + keypath);
					if (!newImports.has(hash)) {
						var modName = mod[0].replace(/[''\\]/g, "\\$&");
						if (mod[1] === "*") newImports.set(hash, "import * as " + importLocalName + " from '" + modName + "';");
						else newImports.set(hash, "import { " + mod[1] + " as " + importLocalName + " } from '" + modName + "';");
					}
					if (name !== keypath) magicString.overwrite(node.start, node.end, importLocalName, { storeName: true });
					return true;
				}
				return false;
			}
			walk$1(ast, {
				enter: function enter(node, parent) {
					if (sourceMap) {
						magicString.addSourcemapLocation(node.start);
						magicString.addSourcemapLocation(node.end);
					}
					if (node.scope) scope = node.scope;
					if (node.type === "Property" && node.shorthand && node.value.type === "Identifier") {
						var name = node.key.name;
						handleReference(node, name, name);
						this.skip();
						return;
					}
					if (isReference$1(node, parent)) {
						var ref$1 = flatten(node);
						var name$1 = ref$1.name;
						var keypath = ref$1.keypath;
						if (handleReference(node, name$1, keypath)) this.skip();
					}
				},
				leave: function leave(node) {
					if (node.scope) scope = scope.parent;
				}
			});
			if (newImports.size === 0) return {
				code,
				ast,
				map: sourceMap ? magicString.generateMap({ hires: true }) : null
			};
			var importBlock = Array.from(newImports.values()).join("\n\n");
			magicString.prepend(importBlock + "\n\n");
			return {
				code: magicString.toString(),
				map: sourceMap ? magicString.generateMap({ hires: true }) : null
			};
		}
	};
}
var ohash_exports = /* @__PURE__ */ __exportAll$1({
	n: () => dist_exports$1,
	t: () => utils_exports
});
var __defProp = Object.defineProperty;
var __exportAll = (all, no_symbols) => {
	let target = {};
	for (var name in all) __defProp(target, name, {
		get: all[name],
		enumerable: true
	});
	if (!no_symbols) __defProp(target, Symbol.toStringTag, { value: "Module" });
	return target;
};
function serialize(o) {
	return typeof o == "string" ? `'${o}'` : new c$1().serialize(o);
}
const c$1 = /* @__PURE__ */ function() {
	class o {
		#t = /* @__PURE__ */ new Map();
		compare(t, r) {
			const e = typeof t, n = typeof r;
			return e === "string" && n === "string" ? t.localeCompare(r) : e === "number" && n === "number" ? t - r : String.prototype.localeCompare.call(this.serialize(t, true), this.serialize(r, true));
		}
		serialize(t, r) {
			if (t === null) return "null";
			switch (typeof t) {
				case "string": return r ? t : `'${t}'`;
				case "bigint": return `${t}n`;
				case "object": return this.$object(t);
				case "function": return this.$function(t);
			}
			return String(t);
		}
		serializeObject(t) {
			const r = Object.prototype.toString.call(t);
			if (r !== "[object Object]") return this.serializeBuiltInType(r.length < 10 ? `unknown:${r}` : r.slice(8, -1), t);
			const e = t.constructor, n = e === Object || e === void 0 ? "" : e.name;
			if (n !== "" && globalThis[n] === e) return this.serializeBuiltInType(n, t);
			if (typeof t.toJSON == "function") {
				const i = t.toJSON();
				return n + (i !== null && typeof i == "object" ? this.$object(i) : `(${this.serialize(i)})`);
			}
			return this.serializeObjectEntries(n, Object.entries(t));
		}
		serializeBuiltInType(t, r) {
			const e = this["$" + t];
			if (e) return e.call(this, r);
			if (typeof r?.entries == "function") return this.serializeObjectEntries(t, r.entries());
			throw new Error(`Cannot serialize ${t}`);
		}
		serializeObjectEntries(t, r) {
			const e = Array.from(r).sort((i, a) => this.compare(i[0], a[0]));
			let n = `${t}{`;
			for (let i = 0; i < e.length; i++) {
				const [a, l] = e[i];
				n += `${this.serialize(a, true)}:${this.serialize(l)}`, i < e.length - 1 && (n += ",");
			}
			return n + "}";
		}
		$object(t) {
			let r = this.#t.get(t);
			return r === void 0 && (this.#t.set(t, `#${this.#t.size}`), r = this.serializeObject(t), this.#t.set(t, r)), r;
		}
		$function(t) {
			const r = Function.prototype.toString.call(t);
			return r.slice(-15) === "[native code] }" ? `${t.name || ""}()[native]` : `${t.name}(${t.length})${r.replace(/\s*\n\s*/g, "")}`;
		}
		$Array(t) {
			let r = "[";
			for (let e = 0; e < t.length; e++) r += this.serialize(t[e]), e < t.length - 1 && (r += ",");
			return r + "]";
		}
		$Date(t) {
			try {
				return `Date(${t.toISOString()})`;
			} catch {
				return "Date(null)";
			}
		}
		$ArrayBuffer(t) {
			return `ArrayBuffer[${new Uint8Array(t).join(",")}]`;
		}
		$Set(t) {
			return `Set${this.$Array(Array.from(t).sort((r, e) => this.compare(r, e)))}`;
		}
		$Map(t) {
			return this.serializeObjectEntries("Map", t.entries());
		}
	}
	for (const s of [
		"Error",
		"RegExp",
		"URL"
	]) o.prototype["$" + s] = function(t) {
		return `${s}(${t})`;
	};
	for (const s of [
		"Int8Array",
		"Uint8Array",
		"Uint8ClampedArray",
		"Int16Array",
		"Uint16Array",
		"Int32Array",
		"Uint32Array",
		"Float32Array",
		"Float64Array"
	]) o.prototype["$" + s] = function(t) {
		return `${s}[${t.join(",")}]`;
	};
	for (const s of ["BigInt64Array", "BigUint64Array"]) o.prototype["$" + s] = function(t) {
		return `${s}[${t.join("n,")}${t.length > 0 ? "n" : ""}]`;
	};
	return o;
}();
const e = globalThis.process?.getBuiltinModule?.("crypto")?.hash, r = "sha256", s = "base64url";
function digest(t) {
	if (e) return e(r, t, s);
	const o = createHash(r).update(t);
	return globalThis.process?.versions?.webcontainer ? o.digest().toString(s) : o.digest(s);
}
var dist_exports$1 = /* @__PURE__ */ __exportAll({ digest: () => digest });
var utils_exports = /* @__PURE__ */ __exportAll({ diff: () => diff });
function diff(obj1, obj2) {
	return _diff(_toHashedObject(obj1), _toHashedObject(obj2));
}
function _diff(h1, h2) {
	const diffs = [];
	const allProps = /* @__PURE__ */ new Set([...Object.keys(h1.props || {}), ...Object.keys(h2.props || {})]);
	if (h1.props && h2.props) for (const prop of allProps) {
		const p1 = h1.props[prop];
		const p2 = h2.props[prop];
		if (p1 && p2) diffs.push(..._diff(h1.props?.[prop], h2.props?.[prop]));
		else if (p1 || p2) diffs.push(new DiffEntry((p2 || p1).key, p1 ? "removed" : "added", p2, p1));
	}
	if (allProps.size === 0 && h1.hash !== h2.hash) diffs.push(new DiffEntry((h2 || h1).key, "changed", h2, h1));
	return diffs;
}
function _toHashedObject(obj, key = "") {
	if (obj && typeof obj !== "object") return new DiffHashedObject(key, obj, serialize(obj));
	const props = {};
	const hashes = [];
	for (const _key in obj) {
		props[_key] = _toHashedObject(obj[_key], key ? `${key}.${_key}` : _key);
		hashes.push(props[_key].hash);
	}
	return new DiffHashedObject(key, obj, `{${hashes.join(":")}}`, props);
}
var DiffEntry = class {
	constructor(key, type, newValue, oldValue) {
		this.key = key;
		this.type = type;
		this.newValue = newValue;
		this.oldValue = oldValue;
	}
	toString() {
		return this.toJSON();
	}
	toJSON() {
		switch (this.type) {
			case "added": return `Added   \`${this.key}\``;
			case "removed": return `Removed \`${this.key}\``;
			case "changed": return `Changed \`${this.key}\` from \`${this.oldValue?.toString() || "-"}\` to \`${this.newValue.toString()}\``;
		}
	}
};
var DiffHashedObject = class {
	constructor(key, value, hash, props) {
		this.key = key;
		this.value = value;
		this.hash = hash;
		this.props = props;
	}
	toString() {
		if (this.props) return `{${Object.keys(this.props).join(",")}}`;
		else return JSON.stringify(this.value);
	}
	toJSON() {
		const k = this.key || ".";
		if (this.props) return `${k}({${Object.keys(this.props).join(",")}})`;
		return `${k}(${this.value})`;
	}
};
var l = Object.create;
var u = Object.defineProperty;
var d = Object.getOwnPropertyDescriptor;
var f = Object.getOwnPropertyNames;
var p = Object.getPrototypeOf;
var m = Object.prototype.hasOwnProperty;
var h = (e, t) => () => (t || e((t = { exports: {} }).exports, t), t.exports);
var g = (e, t, n, r) => {
	if (t && typeof t === "object" || typeof t === "function") for (var i = f(t), a = 0, o = i.length, s; a < o; a++) {
		s = i[a];
		if (!m.call(e, s) && s !== n) u(e, s, {
			get: ((e) => t[e]).bind(null, s),
			enumerable: !(r = d(t, s)) || r.enumerable
		});
	}
	return e;
};
var _ = (e, t, n) => (n = e != null ? l(p(e)) : {}, g(t || !e || !e.__esModule ? u(n, "default", {
	value: e,
	enumerable: true
}) : n, e));
var v = /* @__PURE__ */ createRequire$1(import.meta.url);
const y = /^path$/i;
const b = {
	key: "PATH",
	value: ""
};
function x(e) {
	for (const t in e) {
		if (!Object.prototype.hasOwnProperty.call(e, t) || !y.test(t)) continue;
		const n = e[t];
		if (!n) return b;
		return {
			key: t,
			value: n
		};
	}
	return b;
}
function S(e, t) {
	const i = t.value.split(delimiter);
	let o = e;
	let s;
	do {
		i.push(resolve(o, "node_modules", ".bin"));
		s = o;
		o = dirname(o);
	} while (o !== s);
	return {
		key: t.key,
		value: i.join(delimiter)
	};
}
function C(e, t) {
	const n = {
		...process.env,
		...t
	};
	const r = S(e, x(n));
	n[r.key] = r.value;
	return n;
}
const w = (e) => {
	let t = e.length;
	const n = new PassThrough();
	const r = () => {
		if (--t === 0) n.emit("end");
	};
	for (const t of e) {
		t.pipe(n, { end: false });
		t.on("end", r);
	}
	return n;
};
var T = h((exports, t) => {
	t.exports = a;
	a.sync = o;
	var n = v("fs");
	function r(e, t) {
		var n = t.pathExt !== void 0 ? t.pathExt : process.env.PATHEXT;
		if (!n) return true;
		n = n.split(";");
		if (n.indexOf("") !== -1) return true;
		for (var r = 0; r < n.length; r++) {
			var i = n[r].toLowerCase();
			if (i && e.substr(-i.length).toLowerCase() === i) return true;
		}
		return false;
	}
	function i(e, t, n) {
		if (!e.isSymbolicLink() && !e.isFile()) return false;
		return r(t, n);
	}
	function a(e, t, r) {
		n.stat(e, function(n, a) {
			r(n, n ? false : i(a, e, t));
		});
	}
	function o(e, t) {
		return i(n.statSync(e), e, t);
	}
});
var E = h((exports, t) => {
	t.exports = r;
	r.sync = i;
	var n = v("fs");
	function r(e, t, r) {
		n.stat(e, function(e, n) {
			r(e, e ? false : a(n, t));
		});
	}
	function i(e, t) {
		return a(n.statSync(e), t);
	}
	function a(e, t) {
		return e.isFile() && o(e, t);
	}
	function o(e, t) {
		var n = e.mode;
		var r = e.uid;
		var i = e.gid;
		var a = t.uid !== void 0 ? t.uid : process.getuid && process.getuid();
		var o = t.gid !== void 0 ? t.gid : process.getgid && process.getgid();
		var s = parseInt("100", 8);
		var c = parseInt("010", 8);
		var l = parseInt("001", 8);
		var u = s | c;
		return n & l || n & c && i === o || n & s && r === a || n & u && a === 0;
	}
});
var D = h((exports, t) => {
	v("fs");
	var r;
	if (process.platform === "win32" || global.TESTING_WINDOWS) r = T();
	else r = E();
	t.exports = i;
	i.sync = a;
	function i(e, t, n) {
		if (typeof t === "function") {
			n = t;
			t = {};
		}
		if (!n) {
			if (typeof Promise !== "function") throw new TypeError("callback not provided");
			return new Promise(function(n, r) {
				i(e, t || {}, function(e, t) {
					if (e) r(e);
					else n(t);
				});
			});
		}
		r(e, t || {}, function(e, r) {
			if (e) {
				if (e.code === "EACCES" || t && t.ignoreErrors) {
					e = null;
					r = false;
				}
			}
			n(e, r);
		});
	}
	function a(e, t) {
		try {
			return r.sync(e, t || {});
		} catch (e) {
			if (t && t.ignoreErrors || e.code === "EACCES") return false;
			else throw e;
		}
	}
});
var O = h((exports, t) => {
	const n = process.platform === "win32" || process.env.OSTYPE === "cygwin" || process.env.OSTYPE === "msys";
	const r = v("path");
	const i = n ? ";" : ":";
	const a = D();
	const o = (e) => Object.assign(/* @__PURE__ */ new Error(`not found: ${e}`), { code: "ENOENT" });
	const s = (e, t) => {
		const r = t.colon || i;
		const a = e.match(/\//) || n && e.match(/\\/) ? [""] : [...n ? [process.cwd()] : [], ...(t.path || process.env.PATH || "").split(r)];
		const o = n ? t.pathExt || process.env.PATHEXT || ".EXE;.CMD;.BAT;.COM" : "";
		const s = n ? o.split(r) : [""];
		if (n) {
			if (e.indexOf(".") !== -1 && s[0] !== "") s.unshift("");
		}
		return {
			pathEnv: a,
			pathExt: s,
			pathExtExe: o
		};
	};
	const c = (e, t, n) => {
		if (typeof t === "function") {
			n = t;
			t = {};
		}
		if (!t) t = {};
		const { pathEnv: i, pathExt: c, pathExtExe: l } = s(e, t);
		const u = [];
		const d = (n) => new Promise((a, s) => {
			if (n === i.length) return t.all && u.length ? a(u) : s(o(e));
			const c = i[n];
			const l = /^".*"$/.test(c) ? c.slice(1, -1) : c;
			const d = r.join(l, e);
			a(f(!l && /^\.[\\\/]/.test(e) ? e.slice(0, 2) + d : d, n, 0));
		});
		const f = (e, n, r) => new Promise((i, o) => {
			if (r === c.length) return i(d(n + 1));
			const s = c[r];
			a(e + s, { pathExt: l }, (a, o) => {
				if (!a && o) if (t.all) u.push(e + s);
				else return i(e + s);
				return i(f(e, n, r + 1));
			});
		});
		return n ? d(0).then((e) => n(null, e), n) : d(0);
	};
	const l = (e, t) => {
		t = t || {};
		const { pathEnv: n, pathExt: i, pathExtExe: c } = s(e, t);
		const l = [];
		for (let o = 0; o < n.length; o++) {
			const s = n[o];
			const u = /^".*"$/.test(s) ? s.slice(1, -1) : s;
			const d = r.join(u, e);
			const f = !u && /^\.[\\\/]/.test(e) ? e.slice(0, 2) + d : d;
			for (let e = 0; e < i.length; e++) {
				const n = f + i[e];
				try {
					if (a.sync(n, { pathExt: c })) if (t.all) l.push(n);
					else return n;
				} catch (e) {}
			}
		}
		if (t.all && l.length) return l;
		if (t.nothrow) return null;
		throw o(e);
	};
	t.exports = c;
	c.sync = l;
});
var k = h((exports, t) => {
	const n = (e = {}) => {
		const t = e.env || process.env;
		if ((e.platform || process.platform) !== "win32") return "PATH";
		return Object.keys(t).reverse().find((e) => e.toUpperCase() === "PATH") || "Path";
	};
	t.exports = n;
	t.exports.default = n;
});
var A = h((exports, t) => {
	const n = v("path");
	const r = O();
	const i = k();
	function a(e, t) {
		const a = e.options.env || process.env;
		const o = process.cwd();
		const s = e.options.cwd != null;
		const c = s && process.chdir !== void 0 && !process.chdir.disabled;
		if (c) try {
			process.chdir(e.options.cwd);
		} catch (e) {}
		let l;
		try {
			l = r.sync(e.command, {
				path: a[i({ env: a })],
				pathExt: t ? n.delimiter : void 0
			});
		} catch (e) {} finally {
			if (c) process.chdir(o);
		}
		if (l) l = n.resolve(s ? e.options.cwd : "", l);
		return l;
	}
	function o(e) {
		return a(e) || a(e, true);
	}
	t.exports = o;
});
var j = h((exports, t) => {
	const n = /([()\][%!^"`<>&|;, *?])/g;
	function r(e) {
		e = e.replace(n, "^$1");
		return e;
	}
	function i(e, t) {
		e = `${e}`;
		e = e.replace(/(\\*)"/g, "$1$1\\\"");
		e = e.replace(/(\\*)$/, "$1$1");
		e = `"${e}"`;
		e = e.replace(n, "^$1");
		if (t) e = e.replace(n, "^$1");
		return e;
	}
	t.exports.command = r;
	t.exports.argument = i;
});
var M = h((exports, t) => {
	t.exports = /^#!(.*)/;
});
var N = h((exports, t) => {
	const n = M();
	t.exports = (e = "") => {
		const t = e.match(n);
		if (!t) return null;
		const [r, i] = t[0].replace(/#! ?/, "").split(" ");
		const a = r.split("/").pop();
		if (a === "env") return i;
		return i ? `${a} ${i}` : a;
	};
});
var P = h((exports, t) => {
	const n = v("fs");
	const r = N();
	function i(e) {
		const t = 150;
		const i = Buffer.alloc(t);
		let a;
		try {
			a = n.openSync(e, "r");
			n.readSync(a, i, 0, t, 0);
			n.closeSync(a);
		} catch (e) {}
		return r(i.toString());
	}
	t.exports = i;
});
var F = h((exports, t) => {
	const n = v("path");
	const r = A();
	const i = j();
	const a = P();
	const o = process.platform === "win32";
	const s = /\.(?:com|exe)$/i;
	const c = /node_modules[\\/].bin[\\/][^\\/]+\.cmd$/i;
	function l(e) {
		e.file = r(e);
		const t = e.file && a(e.file);
		if (t) {
			e.args.unshift(e.file);
			e.command = t;
			return r(e);
		}
		return e.file;
	}
	function u(e) {
		if (!o) return e;
		const t = l(e);
		const r = !s.test(t);
		if (e.options.forceShell || r) {
			const r = c.test(t);
			e.command = n.normalize(e.command);
			e.command = i.command(e.command);
			e.args = e.args.map((e) => i.argument(e, r));
			e.args = [
				"/d",
				"/s",
				"/c",
				`"${[e.command].concat(e.args).join(" ")}"`
			];
			e.command = process.env.comspec || "cmd.exe";
			e.options.windowsVerbatimArguments = true;
		}
		return e;
	}
	function d(e, t, n) {
		if (t && !Array.isArray(t)) {
			n = t;
			t = null;
		}
		t = t ? t.slice(0) : [];
		n = Object.assign({}, n);
		const r = {
			command: e,
			args: t,
			options: n,
			file: void 0,
			original: {
				command: e,
				args: t
			}
		};
		return n.shell ? r : u(r);
	}
	t.exports = d;
});
var I = h((exports, t) => {
	const n = process.platform === "win32";
	function r(e, t) {
		return Object.assign(/* @__PURE__ */ new Error(`${t} ${e.command} ENOENT`), {
			code: "ENOENT",
			errno: "ENOENT",
			syscall: `${t} ${e.command}`,
			path: e.command,
			spawnargs: e.args
		});
	}
	function i(e, t) {
		if (!n) return;
		const r = e.emit;
		e.emit = function(n, i) {
			if (n === "exit") {
				const n = a(i, t, "spawn");
				if (n) return r.call(e, "error", n);
			}
			return r.apply(e, arguments);
		};
	}
	function a(e, t) {
		if (n && e === 1 && !t.file) return r(t.original, "spawn");
		return null;
	}
	function o(e, t) {
		if (n && e === 1 && !t.file) return r(t.original, "spawnSync");
		return null;
	}
	t.exports = {
		hookChildProcess: i,
		verifyENOENT: a,
		verifyENOENTSync: o,
		notFoundError: r
	};
});
var R = _(h((exports, t) => {
	const n = v("child_process");
	const r = F();
	const i = I();
	function a(e, t, a) {
		const o = r(e, t, a);
		const s = n.spawn(o.command, o.args, o.options);
		i.hookChildProcess(s, o);
		return s;
	}
	function o(e, t, a) {
		const o = r(e, t, a);
		const s = n.spawnSync(o.command, o.args, o.options);
		s.error = s.error || i.verifyENOENTSync(s.status, o);
		return s;
	}
	t.exports = a;
	t.exports.spawn = a;
	t.exports.sync = o;
	t.exports._parse = r;
	t.exports._enoent = i;
})(), 1);
var z = class extends Error {
	result;
	output;
	get exitCode() {
		if (this.result.exitCode !== null) return this.result.exitCode;
	}
	constructor(e, t) {
		super(`Process exited with non-zero status (${e.exitCode})`);
		this.result = e;
		this.output = t;
	}
};
const B = {
	timeout: void 0,
	persist: false
};
const V = { windowsHide: true };
function H(e, t) {
	return {
		command: normalize(e),
		args: t ?? []
	};
}
function U(e) {
	const t = new AbortController();
	for (const n of e) {
		if (n.aborted) {
			t.abort();
			return n;
		}
		const e = () => {
			t.abort(n.reason);
		};
		n.addEventListener("abort", e, { signal: t.signal });
	}
	return t.signal;
}
async function W(e) {
	let t = "";
	for await (const n of e) t += n.toString();
	return t;
}
var G = class {
	_process;
	_aborted = false;
	_options;
	_command;
	_args;
	_resolveClose;
	_processClosed;
	_thrownError;
	get process() {
		return this._process;
	}
	get pid() {
		return this._process?.pid;
	}
	get exitCode() {
		if (this._process && this._process.exitCode !== null) return this._process.exitCode;
	}
	constructor(e, t, n) {
		this._options = {
			...B,
			...n
		};
		this._command = e;
		this._args = t ?? [];
		this._processClosed = new Promise((e) => {
			this._resolveClose = e;
		});
	}
	kill(e) {
		return this._process?.kill(e) === true;
	}
	get aborted() {
		return this._aborted;
	}
	get killed() {
		return this._process?.killed === true;
	}
	pipe(e, t, n) {
		return q(e, t, {
			...n,
			stdin: this
		});
	}
	async *[Symbol.asyncIterator]() {
		const e = this._process;
		if (!e) return;
		const t = [];
		if (this._streamErr) t.push(this._streamErr);
		if (this._streamOut) t.push(this._streamOut);
		const n = w(t);
		const r = c.createInterface({ input: n });
		for await (const e of r) yield e.toString();
		await this._processClosed;
		e.removeAllListeners();
		if (this._thrownError) throw this._thrownError;
		if (this._options?.throwOnError && this.exitCode !== 0 && this.exitCode !== void 0) throw new z(this);
	}
	async _waitForOutput() {
		const e = this._process;
		if (!e) throw new Error("No process was started");
		const [t, n] = await Promise.all([this._streamOut ? W(this._streamOut) : "", this._streamErr ? W(this._streamErr) : ""]);
		await this._processClosed;
		if (this._options?.stdin) await this._options.stdin;
		e.removeAllListeners();
		if (this._thrownError) throw this._thrownError;
		const r = {
			stderr: n,
			stdout: t,
			exitCode: this.exitCode
		};
		if (this._options.throwOnError && this.exitCode !== 0 && this.exitCode !== void 0) throw new z(this, r);
		return r;
	}
	then(e, t) {
		return this._waitForOutput().then(e, t);
	}
	_streamOut;
	_streamErr;
	spawn() {
		const e = cwd();
		const n = this._options;
		const r = {
			...V,
			...n.nodeOptions
		};
		const i = [];
		this._resetState();
		if (n.timeout !== void 0) i.push(AbortSignal.timeout(n.timeout));
		if (n.signal !== void 0) i.push(n.signal);
		if (n.persist === true) r.detached = true;
		if (i.length > 0) r.signal = U(i);
		r.env = C(e, r.env);
		const { command: a, args: s } = H(this._command, this._args);
		const c = (0, R._parse)(a, s, r);
		const l = spawn(c.command, c.args, c.options);
		if (l.stderr) this._streamErr = l.stderr;
		if (l.stdout) this._streamOut = l.stdout;
		this._process = l;
		l.once("error", this._onError);
		l.once("close", this._onClose);
		if (n.stdin !== void 0 && l.stdin && n.stdin.process) {
			const { stdout: e } = n.stdin.process;
			if (e) e.pipe(l.stdin);
		}
	}
	_resetState() {
		this._aborted = false;
		this._processClosed = new Promise((e) => {
			this._resolveClose = e;
		});
		this._thrownError = void 0;
	}
	_onError = (e) => {
		if (e.name === "AbortError" && (!(e.cause instanceof Error) || e.cause.name !== "TimeoutError")) {
			this._aborted = true;
			return;
		}
		this._thrownError = e;
	};
	_onClose = () => {
		if (this._resolveClose) this._resolveClose();
	};
};
const K = (e, t, n) => {
	const r = new G(e, t, n);
	r.spawn();
	return r;
};
const q = K;
var dist_exports = /* @__PURE__ */ __exportAll$1({
	addDependency: () => addDependency,
	addDevDependency: () => addDevDependency,
	detectPackageManager: () => detectPackageManager,
	packageManagers: () => packageManagers
});
async function findup(cwd, match, options = {}) {
	const segments = normalize$2(cwd).split("/");
	while (segments.length > 0) {
		const result = await match(segments.join("/") || "/");
		if (result || !options.includeParentDirs) return result;
		segments.pop();
	}
}
async function readPackageJSON(cwd) {
	return findup(cwd, (p) => {
		const pkgPath = join(p, "package.json");
		if (existsSync(pkgPath)) return readFile(pkgPath, "utf8").then((data) => JSON.parse(data));
	});
}
function cached(fn) {
	let v;
	return () => {
		if (v === void 0) v = fn().then((r) => {
			v = r;
			return v;
		});
		return v;
	};
}
const hasCorepack = cached(async () => {
	if (globalThis.process?.versions?.webcontainer) return false;
	try {
		const { exitCode } = await K("corepack", ["--version"]);
		return exitCode === 0;
	} catch {
		return false;
	}
});
async function executeCommand(command, args, options = {}) {
	const xArgs = command !== "npm" && command !== "bun" && command !== "deno" && options.corepack !== false && await hasCorepack() ? ["corepack", [command, ...args]] : [command, args];
	const { exitCode, stdout, stderr } = await K(xArgs[0], xArgs[1], { nodeOptions: {
		cwd: resolve$3(options.cwd || process.cwd()),
		env: options.env,
		stdio: options.silent ? "pipe" : "inherit"
	} });
	if (exitCode !== 0) throw new Error(`\`${xArgs.flat().join(" ")}\` failed.${options.silent ? [
		"",
		stdout,
		stderr
	].join("\n") : ""}`);
}
const NO_PACKAGE_MANAGER_DETECTED_ERROR_MSG = "No package manager auto-detected.";
async function resolveOperationOptions(options = {}) {
	const cwd = options.cwd || process.cwd();
	const env = {
		...process.env,
		...options.env
	};
	const packageManager = (typeof options.packageManager === "string" ? packageManagers.find((pm) => pm.name === options.packageManager) : options.packageManager) || await detectPackageManager(options.cwd || process.cwd());
	if (!packageManager) throw new Error(NO_PACKAGE_MANAGER_DETECTED_ERROR_MSG);
	return {
		cwd,
		env,
		silent: options.silent ?? false,
		packageManager,
		dev: options.dev ?? false,
		workspace: options.workspace,
		global: options.global ?? false,
		dry: options.dry ?? false,
		corepack: options.corepack ?? true
	};
}
function getWorkspaceArgs(options) {
	if (!options.workspace) return [];
	const workspacePkg = typeof options.workspace === "string" && options.workspace !== "" ? options.workspace : void 0;
	if (options.packageManager.name === "pnpm") return workspacePkg ? ["--filter", workspacePkg] : ["--workspace-root"];
	if (options.packageManager.name === "npm") return workspacePkg ? ["-w", workspacePkg] : ["--workspaces"];
	if (options.packageManager.name === "yarn") if (!options.packageManager.majorVersion || options.packageManager.majorVersion === "1") return workspacePkg ? ["--cwd", workspacePkg] : ["-W"];
	else return workspacePkg ? ["workspace", workspacePkg] : [];
	return [];
}
function parsePackageManagerField(packageManager) {
	const [name, _version] = (packageManager || "").split("@");
	const [version, buildMeta] = _version?.split("+") || [];
	if (name && name !== "-" && /^(@[a-z0-9-~][a-z0-9-._~]*\/)?[a-z0-9-~][a-z0-9-._~]*$/.test(name)) return {
		name,
		version,
		buildMeta
	};
	const sanitized = (name || "").replace(/\W+/g, "");
	return {
		name: sanitized,
		version,
		buildMeta,
		warnings: [`Abnormal characters found in \`packageManager\` field, sanitizing from \`${name}\` to \`${sanitized}\``]
	};
}
const packageManagers = [
	{
		name: "npm",
		command: "npm",
		lockFile: "package-lock.json"
	},
	{
		name: "pnpm",
		command: "pnpm",
		lockFile: "pnpm-lock.yaml",
		files: ["pnpm-workspace.yaml"]
	},
	{
		name: "bun",
		command: "bun",
		lockFile: ["bun.lockb", "bun.lock"]
	},
	{
		name: "yarn",
		command: "yarn",
		lockFile: "yarn.lock",
		files: [".yarnrc.yml"]
	},
	{
		name: "deno",
		command: "deno",
		lockFile: "deno.lock",
		files: ["deno.json"]
	}
];
async function detectPackageManager(cwd, options = {}) {
	const detected = await findup(resolve$3(cwd || "."), async (path) => {
		if (!options.ignorePackageJSON) {
			const packageJSONPath = join$2(path, "package.json");
			if (existsSync(packageJSONPath)) {
				const packageJSON = JSON.parse(await readFile(packageJSONPath, "utf8"));
				if (packageJSON?.packageManager) {
					const { name, version = "0.0.0", buildMeta, warnings } = parsePackageManagerField(packageJSON.packageManager);
					if (name) {
						const majorVersion = version.split(".")[0];
						const packageManager = packageManagers.find((pm) => pm.name === name && pm.majorVersion === majorVersion) || packageManagers.find((pm) => pm.name === name);
						return {
							name,
							command: name,
							version,
							majorVersion,
							buildMeta,
							warnings,
							files: packageManager?.files,
							lockFile: packageManager?.lockFile
						};
					}
				}
			}
			if (existsSync(join$2(path, "deno.json"))) return packageManagers.find((pm) => pm.name === "deno");
		}
		if (!options.ignoreLockFile) {
			for (const packageManager of packageManagers) if ([packageManager.lockFile, packageManager.files].flat().filter(Boolean).some((file) => existsSync(resolve$3(path, file)))) return { ...packageManager };
		}
	}, { includeParentDirs: options.includeParentDirs ?? true });
	if (!detected && !options.ignoreArgv) {
		const scriptArg = process.argv[1];
		if (scriptArg) {
			for (const packageManager of packageManagers) if (new RegExp(`[/\\\\]\\.?${packageManager.command}`).test(scriptArg)) return packageManager;
		}
	}
	return detected;
}
async function addDependency(name, options = {}) {
	const resolvedOptions = await resolveOperationOptions(options);
	const names = Array.isArray(name) ? name : [name];
	if (resolvedOptions.packageManager.name === "deno") {
		for (let i = 0; i < names.length; i++) if (!/^(npm|jsr|file):.+$/.test(names[i] || "")) names[i] = `npm:${names[i]}`;
	}
	if (names.length === 0) return {};
	const args = (resolvedOptions.packageManager.name === "yarn" ? [
		...getWorkspaceArgs(resolvedOptions),
		resolvedOptions.global && resolvedOptions.packageManager.majorVersion === "1" ? "global" : "",
		"add",
		resolvedOptions.dev ? "-D" : "",
		...names
	] : [
		resolvedOptions.packageManager.name === "npm" ? "install" : "add",
		...getWorkspaceArgs(resolvedOptions),
		resolvedOptions.dev ? "-D" : "",
		resolvedOptions.global ? "-g" : "",
		...names
	]).filter(Boolean);
	if (!resolvedOptions.dry) await executeCommand(resolvedOptions.packageManager.command, args, {
		cwd: resolvedOptions.cwd,
		silent: resolvedOptions.silent,
		corepack: resolvedOptions.corepack
	});
	if (!resolvedOptions.dry && options.installPeerDependencies) {
		const existingPkg = await readPackageJSON(resolvedOptions.cwd);
		const peerDeps = [];
		const peerDevDeps = [];
		const _require = createRequire(join(resolvedOptions.cwd, "/_.js"));
		for (const _name of names) {
			const pkgName = _name.match(/^(.[^@]+)/)?.[0];
			const pkg = await readPackageJSON(_require.resolve(pkgName));
			if (!pkg?.peerDependencies || pkg?.name !== pkgName) continue;
			for (const [peerDependency, version] of Object.entries(pkg.peerDependencies)) {
				if (pkg.peerDependenciesMeta?.[peerDependency]?.optional) continue;
				if (existingPkg?.dependencies?.[peerDependency] || existingPkg?.devDependencies?.[peerDependency]) continue;
				(pkg.peerDependenciesMeta?.[peerDependency]?.dev ? peerDevDeps : peerDeps).push(`${peerDependency}@${version}`);
			}
		}
		if (peerDeps.length > 0) await addDependency(peerDeps, { ...resolvedOptions });
		if (peerDevDeps.length > 0) await addDevDependency(peerDevDeps, { ...resolvedOptions });
	}
	return { exec: {
		command: resolvedOptions.packageManager.command,
		args
	} };
}
async function addDevDependency(name, options = {}) {
	return await addDependency(name, {
		...options,
		dev: true
	});
}
var WalkerBase = class {
	constructor() {
		this.should_skip = false;
		this.should_remove = false;
		this.replacement = null;
		this.context = {
			skip: () => this.should_skip = true,
			remove: () => this.should_remove = true,
			replace: (node) => this.replacement = node
		};
	}
	replace(parent, prop, index, node) {
		if (parent && prop) if (index != null) parent[prop][index] = node;
		else parent[prop] = node;
	}
	remove(parent, prop, index) {
		if (parent && prop) if (index !== null && index !== void 0) parent[prop].splice(index, 1);
		else delete parent[prop];
	}
};
var SyncWalker = class extends WalkerBase {
	constructor(enter, leave) {
		super();
		this.should_skip = false;
		this.should_remove = false;
		this.replacement = null;
		this.context = {
			skip: () => this.should_skip = true,
			remove: () => this.should_remove = true,
			replace: (node) => this.replacement = node
		};
		this.enter = enter;
		this.leave = leave;
	}
	visit(node, parent, prop, index) {
		if (node) {
			if (this.enter) {
				const _should_skip = this.should_skip;
				const _should_remove = this.should_remove;
				const _replacement = this.replacement;
				this.should_skip = false;
				this.should_remove = false;
				this.replacement = null;
				this.enter.call(this.context, node, parent, prop, index);
				if (this.replacement) {
					node = this.replacement;
					this.replace(parent, prop, index, node);
				}
				if (this.should_remove) this.remove(parent, prop, index);
				const skipped = this.should_skip;
				const removed = this.should_remove;
				this.should_skip = _should_skip;
				this.should_remove = _should_remove;
				this.replacement = _replacement;
				if (skipped) return node;
				if (removed) return null;
			}
			let key;
			for (key in node) {
				const value = node[key];
				if (value && typeof value === "object") {
					if (Array.isArray(value)) {
						const nodes = value;
						for (let i = 0; i < nodes.length; i += 1) {
							const item = nodes[i];
							if (isNode(item)) {
								if (!this.visit(item, node, key, i)) i--;
							}
						}
					} else if (isNode(value)) this.visit(value, node, key, null);
				}
			}
			if (this.leave) {
				const _replacement = this.replacement;
				const _should_remove = this.should_remove;
				this.replacement = null;
				this.should_remove = false;
				this.leave.call(this.context, node, parent, prop, index);
				if (this.replacement) {
					node = this.replacement;
					this.replace(parent, prop, index, node);
				}
				if (this.should_remove) this.remove(parent, prop, index);
				const removed = this.should_remove;
				this.replacement = _replacement;
				this.should_remove = _should_remove;
				if (removed) return null;
			}
		}
		return node;
	}
};
function isNode(value) {
	return value !== null && typeof value === "object" && "type" in value && typeof value.type === "string";
}
function walk(ast, { enter, leave }) {
	return new SyncWalker(enter, leave).visit(ast, null);
}
var detect_acorn_exports = /* @__PURE__ */ __exportAll$1({
	createVirtualImportsAcronWalker: () => createVirtualImportsAcronWalker,
	detectImportsAcorn: () => detectImportsAcorn,
	traveseScopes: () => traveseScopes
});
async function detectImportsAcorn(code, ctx, options) {
	const s = getMagicString(code);
	const map = await ctx.getImportMap();
	let matchedImports = [];
	const enableAutoImport = options?.autoImport !== false;
	const enableTransformVirtualImports = options?.transformVirtualImports !== false && ctx.options.virtualImports?.length;
	if (enableAutoImport || enableTransformVirtualImports) {
		const ast = parse$4(s.original, {
			sourceType: "module",
			ecmaVersion: "latest",
			locations: true
		});
		const virtualImports = createVirtualImportsAcronWalker(map, ctx.options.virtualImports);
		const scopes = traveseScopes(ast, enableTransformVirtualImports ? virtualImports.walk : {});
		if (enableAutoImport) {
			const identifiers = scopes.unmatched;
			matchedImports.push(...Array.from(identifiers).map((name) => {
				const item = map.get(name);
				if (item && !item.disabled) return item;
				return null;
			}).filter(Boolean));
			for (const addon of ctx.addons) matchedImports = await addon.matchImports?.call(ctx, identifiers, matchedImports) || matchedImports;
		}
		virtualImports.ranges.forEach(([start, end]) => {
			s.remove(start, end);
		});
		matchedImports.push(...virtualImports.imports);
	}
	return {
		s,
		strippedCode: code.toString(),
		matchedImports,
		isCJSContext: false,
		firstOccurrence: 0
	};
}
function traveseScopes(ast, additionalWalk) {
	const scopes = [];
	let scopeCurrent = void 0;
	const scopesStack = [];
	function pushScope(node) {
		scopeCurrent = {
			node,
			parent: scopeCurrent,
			declarations: /* @__PURE__ */ new Set(),
			references: /* @__PURE__ */ new Set()
		};
		scopes.push(scopeCurrent);
		scopesStack.push(scopeCurrent);
	}
	function popScope(node) {
		if (scopesStack.pop()?.node !== node) throw new Error("Scope mismatch");
		scopeCurrent = scopesStack[scopesStack.length - 1];
	}
	pushScope(void 0);
	walk(ast, {
		enter(node, parent, prop, index) {
			additionalWalk?.enter?.call(this, node, parent, prop, index);
			switch (node.type) {
				case "ImportSpecifier":
				case "ImportDefaultSpecifier":
				case "ImportNamespaceSpecifier":
					scopeCurrent.declarations.add(node.local.name);
					return;
				case "FunctionDeclaration":
				case "ClassDeclaration":
					if (node.id) scopeCurrent.declarations.add(node.id.name);
					return;
				case "VariableDeclarator":
					if (node.id.type === "Identifier") scopeCurrent.declarations.add(node.id.name);
					else walk(node.id, { enter(node2) {
						if (node2.type === "ObjectPattern") node2.properties.forEach((i) => {
							if (i.type === "Property" && i.value.type === "Identifier") scopeCurrent.declarations.add(i.value.name);
							else if (i.type === "RestElement" && i.argument.type === "Identifier") scopeCurrent.declarations.add(i.argument.name);
						});
						else if (node2.type === "ArrayPattern") node2.elements.forEach((i) => {
							if (i?.type === "Identifier") scopeCurrent.declarations.add(i.name);
							if (i?.type === "RestElement" && i.argument.type === "Identifier") scopeCurrent.declarations.add(i.argument.name);
						});
					} });
					return;
				case "BlockStatement":
					switch (parent?.type) {
						case "FunctionDeclaration":
						case "ArrowFunctionExpression":
						case "FunctionExpression": {
							const parameterIdentifiers = parent.params.filter((p) => p.type === "Identifier");
							for (const id of parameterIdentifiers) scopeCurrent.declarations.add(id.name);
							break;
						}
					}
					pushScope(node);
					return;
				case "Identifier":
					switch (parent?.type) {
						case "CallExpression":
							if (parent.callee === node || parent.arguments.includes(node)) scopeCurrent.references.add(node.name);
							return;
						case "MemberExpression":
							if (parent.object === node) scopeCurrent.references.add(node.name);
							return;
						case "VariableDeclarator":
							if (parent.init === node) scopeCurrent.references.add(node.name);
							return;
						case "SpreadElement":
							if (parent.argument === node) scopeCurrent.references.add(node.name);
							return;
						case "ClassDeclaration":
							if (parent.superClass === node) scopeCurrent.references.add(node.name);
							return;
						case "Property":
							if (parent.value === node) scopeCurrent.references.add(node.name);
							return;
						case "TemplateLiteral":
							if (parent.expressions.includes(node)) scopeCurrent.references.add(node.name);
							return;
						case "AssignmentExpression":
							if (parent.right === node) scopeCurrent.references.add(node.name);
							return;
						case "IfStatement":
						case "WhileStatement":
						case "DoWhileStatement":
							if (parent.test === node) scopeCurrent.references.add(node.name);
							return;
						case "SwitchStatement":
							if (parent.discriminant === node) scopeCurrent.references.add(node.name);
							return;
					}
					if (parent?.type.includes("Expression")) scopeCurrent.references.add(node.name);
			}
		},
		leave(node, parent, prop, index) {
			additionalWalk?.leave?.call(this, node, parent, prop, index);
			switch (node.type) {
				case "BlockStatement": popScope(node);
			}
		}
	});
	const unmatched = /* @__PURE__ */ new Set();
	for (const scope of scopes) for (const name of scope.references) {
		let defined = false;
		let parent = scope;
		while (parent) {
			if (parent.declarations.has(name)) {
				defined = true;
				break;
			}
			parent = parent?.parent;
		}
		if (!defined) unmatched.add(name);
	}
	return {
		unmatched,
		scopes
	};
}
function createVirtualImportsAcronWalker(importMap, virtualImports = []) {
	const imports = [];
	const ranges = [];
	return {
		imports,
		ranges,
		walk: { enter(node) {
			if (node.type === "ImportDeclaration") {
				if (virtualImports.includes(node.source.value)) {
					ranges.push([node.start, node.end]);
					node.specifiers.forEach((i) => {
						if (i.type === "ImportSpecifier" && i.imported.type === "Identifier") {
							const original = importMap.get(i.imported.name);
							if (!original) throw new Error(`[unimport] failed to find "${i.imported.name}" imported from "${node.source.value}"`);
							imports.push({
								from: original.from,
								name: original.name,
								as: i.local.name
							});
						}
					});
				}
			}
		} }
	};
}
var import_picomatch = /* @__PURE__ */ __toESM(require_picomatch(), 1);
function toArray$2(array) {
	array = array || [];
	if (Array.isArray(array)) return array;
	return [array];
}
const BACKSLASH_REGEX = /\\/g;
function normalize$1$1(path$1) {
	return path$1.replace(BACKSLASH_REGEX, "/");
}
const ABSOLUTE_PATH_REGEX = /^(?:\/|(?:[A-Z]:)?[/\\|])/i;
function isAbsolute$1$1(path$1) {
	return ABSOLUTE_PATH_REGEX.test(path$1);
}
function getMatcherString$1(glob, cwd) {
	if (glob.startsWith("**") || isAbsolute$1$1(glob)) return normalize$1$1(glob);
	return normalize$1$1(resolve(cwd, glob));
}
function patternToIdFilter(pattern) {
	if (pattern instanceof RegExp) return (id) => {
		const normalizedId = normalize$1$1(id);
		const result = pattern.test(normalizedId);
		pattern.lastIndex = 0;
		return result;
	};
	const matcher = (0, import_picomatch.default)(getMatcherString$1(pattern, process.cwd()), { dot: true });
	return (id) => {
		return matcher(normalize$1$1(id));
	};
}
function patternToCodeFilter(pattern) {
	if (pattern instanceof RegExp) return (code) => {
		const result = pattern.test(code);
		pattern.lastIndex = 0;
		return result;
	};
	return (code) => code.includes(pattern);
}
function createFilter$1(exclude, include) {
	if (!exclude && !include) return;
	return (input) => {
		if (exclude?.some((filter) => filter(input))) return false;
		if (include?.some((filter) => filter(input))) return true;
		return !(include && include.length > 0);
	};
}
function normalizeFilter(filter) {
	if (typeof filter === "string" || filter instanceof RegExp) return { include: [filter] };
	if (Array.isArray(filter)) return { include: filter };
	return {
		exclude: filter.exclude ? toArray$2(filter.exclude) : void 0,
		include: filter.include ? toArray$2(filter.include) : void 0
	};
}
function createIdFilter(filter) {
	if (!filter) return;
	const { exclude, include } = normalizeFilter(filter);
	const excludeFilter = exclude?.map(patternToIdFilter);
	const includeFilter = include?.map(patternToIdFilter);
	return createFilter$1(excludeFilter, includeFilter);
}
function createCodeFilter(filter) {
	if (!filter) return;
	const { exclude, include } = normalizeFilter(filter);
	const excludeFilter = exclude?.map(patternToCodeFilter);
	const includeFilter = include?.map(patternToCodeFilter);
	return createFilter$1(excludeFilter, includeFilter);
}
function createFilterForId(filter) {
	const filterFunction = createIdFilter(filter);
	return filterFunction ? (id) => !!filterFunction(id) : void 0;
}
function createFilterForTransform(idFilter, codeFilter) {
	if (!idFilter && !codeFilter) return;
	const idFilterFunction = createIdFilter(idFilter);
	const codeFilterFunction = createCodeFilter(codeFilter);
	return (id, code) => {
		let fallback = true;
		if (idFilterFunction) fallback &&= idFilterFunction(id);
		if (!fallback) return false;
		if (codeFilterFunction) fallback &&= codeFilterFunction(code);
		return fallback;
	};
}
function normalizeObjectHook(name, hook) {
	let handler;
	let filter;
	if (typeof hook === "function") handler = hook;
	else {
		handler = hook.handler;
		const hookFilter = hook.filter;
		if (name === "resolveId" || name === "load") filter = createFilterForId(hookFilter?.id);
		else filter = createFilterForTransform(hookFilter?.id, hookFilter?.code);
	}
	return {
		handler,
		filter: filter || (() => true)
	};
}
function parse$1(code, opts = {}) {
	return Parser.parse(code, {
		sourceType: "module",
		ecmaVersion: "latest",
		locations: true,
		...opts
	});
}
function transformUse(data, plugin, transformLoader) {
	if (data.resource == null) return [];
	const id = normalizeAbsolutePath(data.resource + (data.resourceQuery || ""));
	if (plugin.transformInclude && !plugin.transformInclude(id)) return [];
	const { filter } = normalizeObjectHook("load", plugin.transform);
	if (!filter(id)) return [];
	return [{
		loader: transformLoader,
		options: { plugin },
		ident: plugin.name
	}];
}
function normalizeAbsolutePath(path$1) {
	if (isAbsolute(path$1)) return normalize(path$1);
	else return path$1;
}
function createBuildContext$1(compiler, compilation, loaderContext, inputSourceMap) {
	return {
		getNativeBuildContext() {
			return {
				framework: "rspack",
				compiler,
				compilation,
				loaderContext,
				inputSourceMap
			};
		},
		addWatchFile(file) {
			const cwd = process.cwd();
			compilation.fileDependencies.add(resolve(cwd, file));
		},
		getWatchFiles() {
			return Array.from(compilation.fileDependencies);
		},
		parse: parse$1,
		emitFile(emittedFile) {
			const outFileName = emittedFile.fileName || emittedFile.name;
			if (emittedFile.source && outFileName) {
				const { sources } = compilation.compiler.webpack;
				compilation.emitAsset(outFileName, new sources.RawSource(typeof emittedFile.source === "string" ? emittedFile.source : Buffer$1.from(emittedFile.source)));
			}
		}
	};
}
function normalizeMessage$1(error) {
	const err = new Error(typeof error === "string" ? error : error.message);
	if (typeof error === "object") {
		err.stack = error.stack;
		err.cause = error.meta;
	}
	return err;
}
function encodeVirtualModuleId(id, plugin) {
	return resolve(plugin.__virtualModulePrefix, encodeURIComponent(id));
}
function decodeVirtualModuleId(encoded, _plugin) {
	return decodeURIComponent(basename(encoded));
}
function isVirtualModuleId(encoded, plugin) {
	return dirname(encoded) === plugin.__virtualModulePrefix;
}
var FakeVirtualModulesPlugin = class FakeVirtualModulesPlugin {
	name = "FakeVirtualModulesPlugin";
	static counters = /* @__PURE__ */ new Map();
	static initCleanup = false;
	constructor(plugin) {
		this.plugin = plugin;
		if (!FakeVirtualModulesPlugin.initCleanup) {
			FakeVirtualModulesPlugin.initCleanup = true;
			process.once("exit", () => {
				FakeVirtualModulesPlugin.counters.forEach((_, dir) => {
					fs.rmSync(dir, {
						recursive: true,
						force: true
					});
				});
			});
		}
	}
	apply(compiler) {
		const dir = this.plugin.__virtualModulePrefix;
		if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
		const counter = FakeVirtualModulesPlugin.counters.get(dir) ?? 0;
		FakeVirtualModulesPlugin.counters.set(dir, counter + 1);
		compiler.hooks.shutdown.tap(this.name, () => {
			const counter$1 = (FakeVirtualModulesPlugin.counters.get(dir) ?? 1) - 1;
			if (counter$1 === 0) {
				FakeVirtualModulesPlugin.counters.delete(dir);
				fs.rmSync(dir, {
					recursive: true,
					force: true
				});
			} else FakeVirtualModulesPlugin.counters.set(dir, counter$1);
		});
	}
	async writeModule(file) {
		return fs.promises.writeFile(file, "");
	}
};
function contextOptionsFromCompilation(compilation) {
	return {
		addWatchFile(file) {
			(compilation.fileDependencies ?? compilation.compilationDependencies).add(file);
		},
		getWatchFiles() {
			return Array.from(compilation.fileDependencies ?? compilation.compilationDependencies);
		}
	};
}
const require$1 = createRequire(import.meta.url);
function getSource(fileSource) {
	return new (require$1("webpack")).sources.RawSource(typeof fileSource === "string" ? fileSource : Buffer$1.from(fileSource.buffer));
}
function createBuildContext(options, compiler, compilation, loaderContext, inputSourceMap) {
	return {
		parse: parse$1,
		addWatchFile(id) {
			options.addWatchFile(resolve(process$1.cwd(), id));
		},
		emitFile(emittedFile) {
			const outFileName = emittedFile.fileName || emittedFile.name;
			if (emittedFile.source && outFileName) {
				if (!compilation) throw new Error("unplugin/webpack: emitFile outside supported hooks  (buildStart, buildEnd, load, transform, watchChange)");
				compilation.emitAsset(outFileName, getSource(emittedFile.source));
			}
		},
		getWatchFiles() {
			return options.getWatchFiles();
		},
		getNativeBuildContext() {
			return {
				framework: "webpack",
				compiler,
				compilation,
				loaderContext,
				inputSourceMap
			};
		}
	};
}
function normalizeMessage(error) {
	const err = new Error(typeof error === "string" ? error : error.message);
	if (typeof error === "object") {
		err.stack = error.stack;
		err.cause = error.meta;
	}
	return err;
}
const schemeRegex = /^[\w+.-]+:\/\//;
const urlRegex = /^([\w+.-]+:)\/\/([^@/#?]*@)?([^:/#?]*)(:\d+)?(\/[^#?]*)?(\?[^#]*)?(#.*)?/;
const fileRegex = /^file:(?:\/\/((?![a-z]:)[^/#?]*)?)?(\/?[^#?]*)(\?[^#]*)?(#.*)?/i;
function isAbsoluteUrl(input) {
	return schemeRegex.test(input);
}
function isSchemeRelativeUrl(input) {
	return input.startsWith("//");
}
function isAbsolutePath(input) {
	return input.startsWith("/");
}
function isFileUrl(input) {
	return input.startsWith("file:");
}
function isRelative(input) {
	return /^[.?#]/.test(input);
}
function parseAbsoluteUrl(input) {
	const match = urlRegex.exec(input);
	return makeUrl(match[1], match[2] || "", match[3], match[4] || "", match[5] || "/", match[6] || "", match[7] || "");
}
function parseFileUrl(input) {
	const match = fileRegex.exec(input);
	const path = match[2];
	return makeUrl("file:", "", match[1] || "", "", isAbsolutePath(path) ? path : "/" + path, match[3] || "", match[4] || "");
}
function makeUrl(scheme, user, host, port, path, query, hash) {
	return {
		scheme,
		user,
		host,
		port,
		path,
		query,
		hash,
		type: 7
	};
}
function parseUrl(input) {
	if (isSchemeRelativeUrl(input)) {
		const url = parseAbsoluteUrl("http:" + input);
		url.scheme = "";
		url.type = 6;
		return url;
	}
	if (isAbsolutePath(input)) {
		const url = parseAbsoluteUrl("http://foo.com" + input);
		url.scheme = "";
		url.host = "";
		url.type = 5;
		return url;
	}
	if (isFileUrl(input)) return parseFileUrl(input);
	if (isAbsoluteUrl(input)) return parseAbsoluteUrl(input);
	const url = parseAbsoluteUrl("http://foo.com/" + input);
	url.scheme = "";
	url.host = "";
	url.type = input ? input.startsWith("?") ? 3 : input.startsWith("#") ? 2 : 4 : 1;
	return url;
}
function stripPathFilename(path) {
	if (path.endsWith("/..")) return path;
	const index = path.lastIndexOf("/");
	return path.slice(0, index + 1);
}
function mergePaths(url, base) {
	normalizePath$2(base, base.type);
	if (url.path === "/") url.path = base.path;
	else url.path = stripPathFilename(base.path) + url.path;
}
function normalizePath$2(url, type) {
	const rel = type <= 4;
	const pieces = url.path.split("/");
	let pointer = 1;
	let positive = 0;
	let addTrailingSlash = false;
	for (let i = 1; i < pieces.length; i++) {
		const piece = pieces[i];
		if (!piece) {
			addTrailingSlash = true;
			continue;
		}
		addTrailingSlash = false;
		if (piece === ".") continue;
		if (piece === "..") {
			if (positive) {
				addTrailingSlash = true;
				positive--;
				pointer--;
			} else if (rel) pieces[pointer++] = piece;
			continue;
		}
		pieces[pointer++] = piece;
		positive++;
	}
	let path = "";
	for (let i = 1; i < pointer; i++) path += "/" + pieces[i];
	if (!path || addTrailingSlash && !path.endsWith("/..")) path += "/";
	url.path = path;
}
function resolve$2(input, base) {
	if (!input && !base) return "";
	const url = parseUrl(input);
	let inputType = url.type;
	if (base && inputType !== 7) {
		const baseUrl = parseUrl(base);
		const baseType = baseUrl.type;
		switch (inputType) {
			case 1: url.hash = baseUrl.hash;
			case 2: url.query = baseUrl.query;
			case 3:
			case 4: mergePaths(url, baseUrl);
			case 5:
				url.user = baseUrl.user;
				url.host = baseUrl.host;
				url.port = baseUrl.port;
			case 6: url.scheme = baseUrl.scheme;
		}
		if (baseType > inputType) inputType = baseType;
	}
	normalizePath$2(url, inputType);
	const queryHash = url.query + url.hash;
	switch (inputType) {
		case 2:
		case 3: return queryHash;
		case 4: {
			const path = url.path.slice(1);
			if (!path) return queryHash || ".";
			if (isRelative(base || input) && !isRelative(path)) return "./" + path + queryHash;
			return path + queryHash;
		}
		case 5: return url.path + queryHash;
		default: return url.scheme + "//" + url.user + url.host + url.port + url.path + queryHash;
	}
}
function stripFilename(path) {
	if (!path) return "";
	const index = path.lastIndexOf("/");
	return path.slice(0, index + 1);
}
function resolver(mapUrl, sourceRoot) {
	const from = stripFilename(mapUrl);
	const prefix = sourceRoot ? sourceRoot + "/" : "";
	return (source) => resolve$2(prefix + (source || ""), from);
}
var COLUMN$1 = 0;
function maybeSort(mappings, owned) {
	const unsortedIndex = nextUnsortedSegmentLine(mappings, 0);
	if (unsortedIndex === mappings.length) return mappings;
	if (!owned) mappings = mappings.slice();
	for (let i = unsortedIndex; i < mappings.length; i = nextUnsortedSegmentLine(mappings, i + 1)) mappings[i] = sortSegments(mappings[i], owned);
	return mappings;
}
function nextUnsortedSegmentLine(mappings, start) {
	for (let i = start; i < mappings.length; i++) if (!isSorted(mappings[i])) return i;
	return mappings.length;
}
function isSorted(line) {
	for (let j = 1; j < line.length; j++) if (line[j][COLUMN$1] < line[j - 1][COLUMN$1]) return false;
	return true;
}
function sortSegments(line, owned) {
	if (!owned) line = line.slice();
	return line.sort(sortComparator);
}
function sortComparator(a, b) {
	return a[COLUMN$1] - b[COLUMN$1];
}
var found = false;
function binarySearch(haystack, needle, low, high) {
	while (low <= high) {
		const mid = low + (high - low >> 1);
		const cmp = haystack[mid][COLUMN$1] - needle;
		if (cmp === 0) {
			found = true;
			return mid;
		}
		if (cmp < 0) low = mid + 1;
		else high = mid - 1;
	}
	found = false;
	return low - 1;
}
function upperBound(haystack, needle, index) {
	for (let i = index + 1; i < haystack.length; index = i++) if (haystack[i][COLUMN$1] !== needle) break;
	return index;
}
function lowerBound(haystack, needle, index) {
	for (let i = index - 1; i >= 0; index = i--) if (haystack[i][COLUMN$1] !== needle) break;
	return index;
}
function memoizedState() {
	return {
		lastKey: -1,
		lastNeedle: -1,
		lastIndex: -1
	};
}
function memoizedBinarySearch(haystack, needle, state, key) {
	const { lastKey, lastNeedle, lastIndex } = state;
	let low = 0;
	let high = haystack.length - 1;
	if (key === lastKey) {
		if (needle === lastNeedle) {
			found = lastIndex !== -1 && haystack[lastIndex][COLUMN$1] === needle;
			return lastIndex;
		}
		if (needle >= lastNeedle) low = lastIndex === -1 ? 0 : lastIndex;
		else high = lastIndex;
	}
	state.lastKey = key;
	state.lastNeedle = needle;
	return state.lastIndex = binarySearch(haystack, needle, low, high);
}
function parse(map) {
	return typeof map === "string" ? JSON.parse(map) : map;
}
var LEAST_UPPER_BOUND = -1;
var GREATEST_LOWER_BOUND = 1;
var TraceMap = class {
	constructor(map, mapUrl) {
		const isString = typeof map === "string";
		if (!isString && map._decodedMemo) return map;
		const parsed = parse(map);
		const { version, file, names, sourceRoot, sources, sourcesContent } = parsed;
		this.version = version;
		this.file = file;
		this.names = names || [];
		this.sourceRoot = sourceRoot;
		this.sources = sources;
		this.sourcesContent = sourcesContent;
		this.ignoreList = parsed.ignoreList || parsed.x_google_ignoreList || void 0;
		const resolve = resolver(mapUrl, sourceRoot);
		this.resolvedSources = sources.map(resolve);
		const { mappings } = parsed;
		if (typeof mappings === "string") {
			this._encoded = mappings;
			this._decoded = void 0;
		} else if (Array.isArray(mappings)) {
			this._encoded = void 0;
			this._decoded = maybeSort(mappings, isString);
		} else if (parsed.sections) throw new Error(`TraceMap passed sectioned source map, please use FlattenMap export instead`);
		else throw new Error(`invalid source map: ${JSON.stringify(parsed)}`);
		this._decodedMemo = memoizedState();
		this._bySources = void 0;
		this._bySourceMemos = void 0;
	}
};
function cast$1(map) {
	return map;
}
function decodedMappings(map) {
	var _a;
	return (_a = cast$1(map))._decoded || (_a._decoded = decode(cast$1(map)._encoded));
}
function traceSegment(map, line, column) {
	const decoded = decodedMappings(map);
	if (line >= decoded.length) return null;
	const segments = decoded[line];
	const index = traceSegmentInternal(segments, cast$1(map)._decodedMemo, line, column, GREATEST_LOWER_BOUND);
	return index === -1 ? null : segments[index];
}
function traceSegmentInternal(segments, memo, line, column, bias) {
	let index = memoizedBinarySearch(segments, column, memo, line);
	if (found) index = (bias === LEAST_UPPER_BOUND ? upperBound : lowerBound)(segments, column, index);
	else if (bias === LEAST_UPPER_BOUND) index++;
	if (index === -1 || index === segments.length) return -1;
	return index;
}
var SetArray = class {
	constructor() {
		this._indexes = { __proto__: null };
		this.array = [];
	}
};
function cast(set) {
	return set;
}
function get(setarr, key) {
	return cast(setarr)._indexes[key];
}
function put(setarr, key) {
	const index = get(setarr, key);
	if (index !== void 0) return index;
	const { array, _indexes: indexes } = cast(setarr);
	return indexes[key] = array.push(key) - 1;
}
function remove(setarr, key) {
	const index = get(setarr, key);
	if (index === void 0) return;
	const { array, _indexes: indexes } = cast(setarr);
	for (let i = index + 1; i < array.length; i++) {
		const k = array[i];
		array[i - 1] = k;
		indexes[k]--;
	}
	indexes[key] = void 0;
	array.pop();
}
var COLUMN = 0;
var SOURCES_INDEX = 1;
var SOURCE_LINE = 2;
var SOURCE_COLUMN = 3;
var NAMES_INDEX = 4;
var NO_NAME = -1;
var GenMapping = class {
	constructor({ file, sourceRoot } = {}) {
		this._names = new SetArray();
		this._sources = new SetArray();
		this._sourcesContent = [];
		this._mappings = [];
		this.file = file;
		this.sourceRoot = sourceRoot;
		this._ignoreList = new SetArray();
	}
};
function cast2(map) {
	return map;
}
var maybeAddSegment = (map, genLine, genColumn, source, sourceLine, sourceColumn, name, content) => {
	return addSegmentInternal(true, map, genLine, genColumn, source, sourceLine, sourceColumn, name, content);
};
function setSourceContent(map, source, content) {
	const { _sources: sources, _sourcesContent: sourcesContent } = cast2(map);
	const index = put(sources, source);
	sourcesContent[index] = content;
}
function setIgnore(map, source, ignore = true) {
	const { _sources: sources, _sourcesContent: sourcesContent, _ignoreList: ignoreList } = cast2(map);
	const index = put(sources, source);
	if (index === sourcesContent.length) sourcesContent[index] = null;
	if (ignore) put(ignoreList, index);
	else remove(ignoreList, index);
}
function toDecodedMap(map) {
	const { _mappings: mappings, _sources: sources, _sourcesContent: sourcesContent, _names: names, _ignoreList: ignoreList } = cast2(map);
	removeEmptyFinalLines(mappings);
	return {
		version: 3,
		file: map.file || void 0,
		names: names.array,
		sourceRoot: map.sourceRoot || void 0,
		sources: sources.array,
		sourcesContent,
		mappings,
		ignoreList: ignoreList.array
	};
}
function toEncodedMap(map) {
	const decoded = toDecodedMap(map);
	return Object.assign({}, decoded, { mappings: encode(decoded.mappings) });
}
function addSegmentInternal(skipable, map, genLine, genColumn, source, sourceLine, sourceColumn, name, content) {
	const { _mappings: mappings, _sources: sources, _sourcesContent: sourcesContent, _names: names } = cast2(map);
	const line = getIndex(mappings, genLine);
	const index = getColumnIndex(line, genColumn);
	if (!source) {
		if (skipable && skipSourceless(line, index)) return;
		return insert(line, index, [genColumn]);
	}
	assert$2(sourceLine);
	assert$2(sourceColumn);
	const sourcesIndex = put(sources, source);
	const namesIndex = name ? put(names, name) : NO_NAME;
	if (sourcesIndex === sourcesContent.length) sourcesContent[sourcesIndex] = content != null ? content : null;
	if (skipable && skipSource(line, index, sourcesIndex, sourceLine, sourceColumn, namesIndex)) return;
	return insert(line, index, name ? [
		genColumn,
		sourcesIndex,
		sourceLine,
		sourceColumn,
		namesIndex
	] : [
		genColumn,
		sourcesIndex,
		sourceLine,
		sourceColumn
	]);
}
function assert$2(_val) {}
function getIndex(arr, index) {
	for (let i = arr.length; i <= index; i++) arr[i] = [];
	return arr[index];
}
function getColumnIndex(line, genColumn) {
	let index = line.length;
	for (let i = index - 1; i >= 0; index = i--) if (genColumn >= line[i][COLUMN]) break;
	return index;
}
function insert(array, index, value) {
	for (let i = array.length; i > index; i--) array[i] = array[i - 1];
	array[index] = value;
}
function removeEmptyFinalLines(mappings) {
	const { length } = mappings;
	let len = length;
	for (let i = len - 1; i >= 0; len = i, i--) if (mappings[i].length > 0) break;
	if (len < length) mappings.length = len;
}
function skipSourceless(line, index) {
	if (index === 0) return true;
	return line[index - 1].length === 1;
}
function skipSource(line, index, sourcesIndex, sourceLine, sourceColumn, namesIndex) {
	if (index === 0) return false;
	const prev = line[index - 1];
	if (prev.length === 1) return false;
	return sourcesIndex === prev[SOURCES_INDEX] && sourceLine === prev[SOURCE_LINE] && sourceColumn === prev[SOURCE_COLUMN] && namesIndex === (prev.length === 5 ? prev[NAMES_INDEX] : NO_NAME);
}
var SOURCELESS_MAPPING = /* @__PURE__ */ SegmentObject("", -1, -1, "", null, false);
var EMPTY_SOURCES = [];
function SegmentObject(source, line, column, name, content, ignore) {
	return {
		source,
		line,
		column,
		name,
		content,
		ignore
	};
}
function Source(map, sources, source, content, ignore) {
	return {
		map,
		sources,
		source,
		content,
		ignore
	};
}
function MapSource(map, sources) {
	return Source(map, sources, "", null, false);
}
function OriginalSource(source, content, ignore) {
	return Source(null, EMPTY_SOURCES, source, content, ignore);
}
function traceMappings(tree) {
	const gen = new GenMapping({ file: tree.map.file });
	const { sources: rootSources, map } = tree;
	const rootNames = map.names;
	const rootMappings = decodedMappings(map);
	for (let i = 0; i < rootMappings.length; i++) {
		const segments = rootMappings[i];
		for (let j = 0; j < segments.length; j++) {
			const segment = segments[j];
			const genCol = segment[0];
			let traced = SOURCELESS_MAPPING;
			if (segment.length !== 1) {
				const source2 = rootSources[segment[1]];
				traced = originalPositionFor(source2, segment[2], segment[3], segment.length === 5 ? rootNames[segment[4]] : "");
				if (traced == null) continue;
			}
			const { column, line, name, content, source, ignore } = traced;
			maybeAddSegment(gen, i, genCol, source, line, column, name);
			if (source && content != null) setSourceContent(gen, source, content);
			if (ignore) setIgnore(gen, source, true);
		}
	}
	return gen;
}
function originalPositionFor(source, line, column, name) {
	if (!source.map) return SegmentObject(source.source, line, column, name, source.content, source.ignore);
	const segment = traceSegment(source.map, line, column);
	if (segment == null) return null;
	if (segment.length === 1) return SOURCELESS_MAPPING;
	return originalPositionFor(source.sources[segment[1]], segment[2], segment[3], segment.length === 5 ? source.map.names[segment[4]] : name);
}
function asArray(value) {
	if (Array.isArray(value)) return value;
	return [value];
}
function buildSourceMapTree(input, loader) {
	const maps = asArray(input).map((m) => new TraceMap(m, ""));
	const map = maps.pop();
	for (let i = 0; i < maps.length; i++) if (maps[i].sources.length > 1) throw new Error(`Transformation map ${i} must have exactly one source file.
Did you specify these with the most recent transformation maps first?`);
	let tree = build(map, loader, "", 0);
	for (let i = maps.length - 1; i >= 0; i--) tree = MapSource(maps[i], [tree]);
	return tree;
}
function build(map, loader, importer, importerDepth) {
	const { resolvedSources, sourcesContent, ignoreList } = map;
	const depth = importerDepth + 1;
	return MapSource(map, resolvedSources.map((sourceFile, i) => {
		const ctx = {
			importer,
			depth,
			source: sourceFile || "",
			content: void 0,
			ignore: void 0
		};
		const sourceMap = loader(ctx.source, ctx);
		const { source, content, ignore } = ctx;
		if (sourceMap) return build(new TraceMap(sourceMap, source), loader, source, depth);
		return OriginalSource(source, content !== void 0 ? content : sourcesContent ? sourcesContent[i] : null, ignore !== void 0 ? ignore : ignoreList ? ignoreList.includes(i) : false);
	}));
}
var SourceMap = class {
	constructor(map, options) {
		const out = options.decodedMappings ? toDecodedMap(map) : toEncodedMap(map);
		this.version = out.version;
		this.file = out.file;
		this.mappings = out.mappings;
		this.names = out.names;
		this.ignoreList = out.ignoreList;
		this.sourceRoot = out.sourceRoot;
		this.sources = out.sources;
		if (!options.excludeContent) this.sourcesContent = out.sourcesContent;
	}
	toString() {
		return JSON.stringify(this);
	}
};
function remapping(input, loader, options) {
	const opts = typeof options === "object" ? options : {
		excludeContent: !!options,
		decodedMappings: false
	};
	return new SourceMap(traceMappings(buildSourceMapTree(input, loader)), opts);
}
var require_virtual_stats = /* @__PURE__ */ __commonJSMin(((exports) => {
	var __importDefault = exports && exports.__importDefault || function(mod) {
		return mod && mod.__esModule ? mod : { "default": mod };
	};
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.VirtualStats = void 0;
	const constants_1 = __importDefault(__require("constants"));
	var VirtualStats = class {
		constructor(config) {
			for (const key in config) {
				if (!Object.prototype.hasOwnProperty.call(config, key)) continue;
				this[key] = config[key];
			}
		}
		_checkModeProperty(property) {
			return (this.mode & constants_1.default.S_IFMT) === property;
		}
		isDirectory() {
			return this._checkModeProperty(constants_1.default.S_IFDIR);
		}
		isFile() {
			return this._checkModeProperty(constants_1.default.S_IFREG);
		}
		isBlockDevice() {
			return this._checkModeProperty(constants_1.default.S_IFBLK);
		}
		isCharacterDevice() {
			return this._checkModeProperty(constants_1.default.S_IFCHR);
		}
		isSymbolicLink() {
			return this._checkModeProperty(constants_1.default.S_IFLNK);
		}
		isFIFO() {
			return this._checkModeProperty(constants_1.default.S_IFIFO);
		}
		isSocket() {
			return this._checkModeProperty(constants_1.default.S_IFSOCK);
		}
	};
	exports.VirtualStats = VirtualStats;
}));
var import_lib = /* @__PURE__ */ __toESM((/* @__PURE__ */ __commonJSMin(((exports, module) => {
	const path_1 = (exports && exports.__importDefault || function(mod) {
		return mod && mod.__esModule ? mod : { "default": mod };
	})(__require("path"));
	const virtual_stats_1 = require_virtual_stats();
	let inode = 45e6;
	const ALL = "all";
	const STATIC = "static";
	const DYNAMIC = "dynamic";
	function checkActivation(instance) {
		if (!instance._compiler) throw new Error("You must use this plugin only after creating webpack instance!");
	}
	function getModulePath(filePath, compiler) {
		return path_1.default.isAbsolute(filePath) ? filePath : path_1.default.join(compiler.context, filePath);
	}
	function createWebpackData(result) {
		return (backendOrStorage) => {
			if (backendOrStorage._data) {
				const curLevelIdx = backendOrStorage._currentLevel;
				return {
					result,
					level: backendOrStorage._levels[curLevelIdx]
				};
			}
			return [null, result];
		};
	}
	function getData(storage, key) {
		if (storage._data instanceof Map) return storage._data.get(key);
		else if (storage._data) return storage.data[key];
		else if (storage.data instanceof Map) return storage.data.get(key);
		else return storage.data[key];
	}
	function setData(backendOrStorage, key, valueFactory) {
		const value = valueFactory(backendOrStorage);
		if (backendOrStorage._data instanceof Map) backendOrStorage._data.set(key, value);
		else if (backendOrStorage._data) backendOrStorage.data[key] = value;
		else if (backendOrStorage.data instanceof Map) backendOrStorage.data.set(key, value);
		else backendOrStorage.data[key] = value;
	}
	function getStatStorage(fileSystem) {
		if (fileSystem._statStorage) return fileSystem._statStorage;
		else if (fileSystem._statBackend) return fileSystem._statBackend;
		else throw new Error("Couldn't find a stat storage");
	}
	function getFileStorage(fileSystem) {
		if (fileSystem._readFileStorage) return fileSystem._readFileStorage;
		else if (fileSystem._readFileBackend) return fileSystem._readFileBackend;
		else throw new Error("Couldn't find a readFileStorage");
	}
	function getReadDirBackend(fileSystem) {
		if (fileSystem._readdirBackend) return fileSystem._readdirBackend;
		else if (fileSystem._readdirStorage) return fileSystem._readdirStorage;
		else throw new Error("Couldn't find a readDirStorage from Webpack Internals");
	}
	function getRealpathBackend(fileSystem) {
		if (fileSystem._realpathBackend) return fileSystem._realpathBackend;
	}
	var VirtualModulesPlugin = class {
		constructor(modules) {
			this._compiler = null;
			this._watcher = null;
			this._staticModules = modules || null;
		}
		getModuleList(filter = ALL) {
			var _a, _b;
			let modules = {};
			const shouldGetStaticModules = filter === ALL || filter === STATIC;
			const shouldGetDynamicModules = filter === ALL || filter === DYNAMIC;
			if (shouldGetStaticModules) modules = Object.assign(Object.assign({}, modules), this._staticModules);
			if (shouldGetDynamicModules) {
				const finalInputFileSystem = (_a = this._compiler) === null || _a === void 0 ? void 0 : _a.inputFileSystem;
				const virtualFiles = (_b = finalInputFileSystem === null || finalInputFileSystem === void 0 ? void 0 : finalInputFileSystem._virtualFiles) !== null && _b !== void 0 ? _b : {};
				const dynamicModules = {};
				Object.keys(virtualFiles).forEach((key) => {
					dynamicModules[key] = virtualFiles[key].contents;
				});
				modules = Object.assign(Object.assign({}, modules), dynamicModules);
			}
			return modules;
		}
		writeModule(filePath, contents) {
			if (!this._compiler) throw new Error(`Plugin has not been initialized`);
			checkActivation(this);
			const len = contents ? contents.length : 0;
			const time = Date.now();
			const date = new Date(time);
			const stats = new virtual_stats_1.VirtualStats({
				dev: 8675309,
				nlink: 0,
				uid: 1e3,
				gid: 1e3,
				rdev: 0,
				blksize: 4096,
				ino: inode++,
				mode: 33188,
				size: len,
				blocks: Math.floor(len / 4096),
				atime: date,
				mtime: date,
				ctime: date,
				birthtime: date
			});
			const modulePath = getModulePath(filePath, this._compiler);
			if (process.env.WVM_DEBUG) console.log(this._compiler.name, "Write virtual module:", modulePath, contents);
			let finalWatchFileSystem = this._watcher && this._watcher.watchFileSystem;
			while (finalWatchFileSystem && finalWatchFileSystem.wfs) finalWatchFileSystem = finalWatchFileSystem.wfs;
			let finalInputFileSystem = this._compiler.inputFileSystem;
			while (finalInputFileSystem && finalInputFileSystem._inputFileSystem) finalInputFileSystem = finalInputFileSystem._inputFileSystem;
			finalInputFileSystem._writeVirtualFile(modulePath, stats, contents);
			if (finalWatchFileSystem && finalWatchFileSystem.watcher && (finalWatchFileSystem.watcher.fileWatchers.size || finalWatchFileSystem.watcher.fileWatchers.length)) {
				const fileWatchers = finalWatchFileSystem.watcher.fileWatchers instanceof Map ? Array.from(finalWatchFileSystem.watcher.fileWatchers.values()) : finalWatchFileSystem.watcher.fileWatchers;
				for (let fileWatcher of fileWatchers) {
					if ("watcher" in fileWatcher) fileWatcher = fileWatcher.watcher;
					if (fileWatcher.path === modulePath) {
						if (process.env.DEBUG) console.log(this._compiler.name, "Emit file change:", modulePath, time);
						delete fileWatcher.directoryWatcher._cachedTimeInfoEntries;
						fileWatcher.emit("change", time, null);
					}
				}
			}
		}
		apply(compiler) {
			this._compiler = compiler;
			const afterEnvironmentHook = () => {
				let finalInputFileSystem = compiler.inputFileSystem;
				while (finalInputFileSystem && finalInputFileSystem._inputFileSystem) finalInputFileSystem = finalInputFileSystem._inputFileSystem;
				if (!finalInputFileSystem._writeVirtualFile) {
					const originalPurge = finalInputFileSystem.purge;
					finalInputFileSystem.purge = () => {
						originalPurge.apply(finalInputFileSystem, []);
						if (finalInputFileSystem._virtualFiles) Object.keys(finalInputFileSystem._virtualFiles).forEach((file) => {
							const data = finalInputFileSystem._virtualFiles[file];
							finalInputFileSystem._writeVirtualFile(file, data.stats, data.contents);
						});
					};
					finalInputFileSystem._writeVirtualFile = (file, stats, contents) => {
						const statStorage = getStatStorage(finalInputFileSystem);
						const fileStorage = getFileStorage(finalInputFileSystem);
						const readDirStorage = getReadDirBackend(finalInputFileSystem);
						const realPathStorage = getRealpathBackend(finalInputFileSystem);
						finalInputFileSystem._virtualFiles = finalInputFileSystem._virtualFiles || {};
						finalInputFileSystem._virtualFiles[file] = {
							stats,
							contents
						};
						setData(statStorage, file, createWebpackData(stats));
						setData(fileStorage, file, createWebpackData(contents));
						const segments = file.split(/[\\/]/);
						let count = segments.length - 1;
						const minCount = segments[0] ? 1 : 0;
						while (count > minCount) {
							const dir = segments.slice(0, count).join(path_1.default.sep) || path_1.default.sep;
							try {
								finalInputFileSystem.readdirSync(dir);
							} catch (e) {
								const time = Date.now();
								const dirStats = new virtual_stats_1.VirtualStats({
									dev: 8675309,
									nlink: 0,
									uid: 1e3,
									gid: 1e3,
									rdev: 0,
									blksize: 4096,
									ino: inode++,
									mode: 16877,
									size: stats.size,
									blocks: Math.floor(stats.size / 4096),
									atime: time,
									mtime: time,
									ctime: time,
									birthtime: time
								});
								setData(readDirStorage, dir, createWebpackData([]));
								if (realPathStorage) setData(realPathStorage, dir, createWebpackData(dir));
								setData(statStorage, dir, createWebpackData(dirStats));
							}
							let dirData = getData(getReadDirBackend(finalInputFileSystem), dir);
							dirData = dirData[1] || dirData.result;
							const filename = segments[count];
							if (dirData.indexOf(filename) < 0) {
								const files = dirData.concat([filename]).sort();
								setData(getReadDirBackend(finalInputFileSystem), dir, createWebpackData(files));
							} else break;
							count--;
						}
					};
				}
			};
			const afterResolversHook = () => {
				if (this._staticModules) {
					for (const [filePath, contents] of Object.entries(this._staticModules)) this.writeModule(filePath, contents);
					this._staticModules = null;
				}
			};
			const version = typeof compiler.webpack === "undefined" ? 4 : 5;
			const watchRunHook = (watcher, callback) => {
				this._watcher = watcher.compiler || watcher;
				const virtualFiles = compiler.inputFileSystem._virtualFiles;
				const fts = compiler.fileTimestamps;
				if (virtualFiles && fts && typeof fts.set === "function") Object.keys(virtualFiles).forEach((file) => {
					const mtime = +virtualFiles[file].stats.mtime;
					fts.set(file, version === 4 ? mtime : {
						safeTime: mtime,
						timestamp: mtime
					});
				});
				callback();
			};
			if (compiler.hooks) {
				compiler.hooks.afterEnvironment.tap("VirtualModulesPlugin", afterEnvironmentHook);
				compiler.hooks.afterResolvers.tap("VirtualModulesPlugin", afterResolversHook);
				compiler.hooks.watchRun.tapAsync("VirtualModulesPlugin", watchRunHook);
			} else {
				compiler.plugin("after-environment", afterEnvironmentHook);
				compiler.plugin("after-resolvers", afterResolversHook);
				compiler.plugin("watch-run", watchRunHook);
			}
		}
	};
	module.exports = VirtualModulesPlugin;
})))(), 1);
const ExtToLoader = {
	".js": "js",
	".mjs": "js",
	".cjs": "js",
	".jsx": "jsx",
	".ts": "ts",
	".cts": "ts",
	".mts": "ts",
	".tsx": "tsx",
	".css": "css",
	".less": "css",
	".stylus": "css",
	".scss": "css",
	".sass": "css",
	".json": "json",
	".txt": "text"
};
function guessLoader(code, id) {
	return ExtToLoader[path.extname(id).toLowerCase()] || "js";
}
function unwrapLoader(loader, code, id) {
	if (typeof loader === "function") return loader(code, id);
	return loader;
}
function fixSourceMap(map) {
	if (!Object.prototype.hasOwnProperty.call(map, "toString")) Object.defineProperty(map, "toString", {
		enumerable: false,
		value: function toString() {
			return JSON.stringify(this);
		}
	});
	if (!Object.prototype.hasOwnProperty.call(map, "toUrl")) Object.defineProperty(map, "toUrl", {
		enumerable: false,
		value: function toUrl() {
			return `data:application/json;charset=utf-8;base64,${Buffer$1.from(this.toString()).toString("base64")}`;
		}
	});
	return map;
}
const nullSourceMap = {
	names: [],
	sources: [],
	mappings: "",
	version: 3
};
function combineSourcemaps(filename, sourcemapList) {
	sourcemapList = sourcemapList.filter((m) => m.sources);
	if (sourcemapList.length === 0 || sourcemapList.every((m) => m.sources.length === 0)) return { ...nullSourceMap };
	let map;
	let mapIndex = 1;
	if (sourcemapList.slice(0, -1).find((m) => m.sources.length !== 1) === void 0) map = remapping(sourcemapList, () => null, true);
	else map = remapping(sourcemapList[0], (sourcefile) => {
		if (sourcefile === filename && sourcemapList[mapIndex]) return sourcemapList[mapIndex++];
		else return { ...nullSourceMap };
	}, true);
	if (!map.file) delete map.file;
	return map;
}
function createBuildContext$2(build) {
	const watchFiles = [];
	const { initialOptions } = build;
	return {
		parse: parse$1,
		addWatchFile() {
			throw new Error("unplugin/esbuild: addWatchFile outside supported hooks (resolveId, load, transform)");
		},
		emitFile(emittedFile) {
			const outFileName = emittedFile.fileName || emittedFile.name;
			if (initialOptions.outdir && emittedFile.source && outFileName) {
				const outPath = path.resolve(initialOptions.outdir, outFileName);
				const outDir = path.dirname(outPath);
				if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });
				fs.writeFileSync(outPath, emittedFile.source);
			}
		},
		getWatchFiles() {
			return watchFiles;
		},
		getNativeBuildContext() {
			return {
				framework: "esbuild",
				build
			};
		}
	};
}
function createPluginContext(context) {
	const errors = [];
	const warnings = [];
	const pluginContext = {
		error(message) {
			errors.push(normalizeMessage$2(message));
		},
		warn(message) {
			warnings.push(normalizeMessage$2(message));
		}
	};
	return {
		errors,
		warnings,
		mixedContext: {
			...context,
			...pluginContext,
			addWatchFile(id) {
				context.getWatchFiles().push(id);
			}
		}
	};
}
function normalizeMessage$2(message) {
	if (typeof message === "string") message = { message };
	return {
		id: message.id,
		pluginName: message.plugin,
		text: message.message,
		location: message.loc ? {
			file: message.loc.file,
			line: message.loc.line,
			column: message.loc.column
		} : null,
		detail: message.meta,
		notes: []
	};
}
function processCodeWithSourceMap(map, code) {
	if (map) {
		if (!map.sourcesContent || map.sourcesContent.length === 0) map.sourcesContent = [code];
		map = fixSourceMap(map);
		code += `\n//# sourceMappingURL=${map.toUrl()}`;
	}
	return code;
}
function getEsbuildPlugin(factory) {
	return (userOptions) => {
		const meta = { framework: "esbuild" };
		const plugins = toArray$2(factory(userOptions, meta));
		const setupPlugins = async (build) => {
			const setup = buildSetup();
			const loaders = [];
			for (const plugin of plugins) {
				const loader = {};
				await setup(plugin)({
					...build,
					onLoad(_options, callback) {
						loader.options = _options;
						loader.onLoadCb = callback;
					},
					onTransform(_options, callback) {
						loader.options ||= _options;
						loader.onTransformCb = callback;
					}
				}, build);
				if (loader.onLoadCb || loader.onTransformCb) loaders.push(loader);
			}
			if (loaders.length) build.onLoad(loaders.length === 1 ? loaders[0].options : { filter: /.*/ }, async (args) => {
				function checkFilter(options) {
					return loaders.length === 1 || !options?.filter || options.filter.test(args.path);
				}
				let result;
				for (const { options, onLoadCb } of loaders) {
					if (!checkFilter(options)) continue;
					if (onLoadCb) result = await onLoadCb(args);
					if (result?.contents) break;
				}
				let fsContentsCache;
				for (const { options, onTransformCb } of loaders) {
					if (!checkFilter(options)) continue;
					if (onTransformCb) {
						const _result = await onTransformCb({
							...result,
							...args,
							async getContents() {
								if (result?.contents) return result.contents;
								if (fsContentsCache) return fsContentsCache;
								return fsContentsCache = await fs.promises.readFile(args.path, "utf8");
							}
						});
						if (_result?.contents) result = _result;
					}
				}
				if (result?.contents) return result;
			});
		};
		return {
			name: (plugins.length === 1 ? plugins[0].name : meta.esbuildHostName) ?? `unplugin-host:${plugins.map((p) => p.name).join(":")}`,
			setup: setupPlugins
		};
	};
}
function buildSetup() {
	return (plugin) => {
		return (build, rawBuild) => {
			const context = createBuildContext$2(rawBuild);
			const { onStart, onEnd, onResolve, onLoad, onTransform, initialOptions } = build;
			const onResolveFilter = plugin.esbuild?.onResolveFilter ?? /.*/;
			const onLoadFilter = plugin.esbuild?.onLoadFilter ?? /.*/;
			const loader = plugin.esbuild?.loader ?? guessLoader;
			plugin.esbuild?.config?.call(context, initialOptions);
			if (plugin.buildStart) onStart(() => plugin.buildStart.call(context));
			if (plugin.buildEnd || plugin.writeBundle) onEnd(async () => {
				if (plugin.buildEnd) await plugin.buildEnd.call(context);
				if (plugin.writeBundle) await plugin.writeBundle();
			});
			if (plugin.resolveId) onResolve({ filter: onResolveFilter }, async (args) => {
				const id = args.path;
				if (initialOptions.external?.includes(id)) return;
				const { handler, filter } = normalizeObjectHook("resolveId", plugin.resolveId);
				if (!filter(id)) return;
				const { errors, warnings, mixedContext } = createPluginContext(context);
				const isEntry = args.kind === "entry-point";
				const result = await handler.call(mixedContext, id, isEntry ? void 0 : args.importer, { isEntry });
				if (typeof result === "string") return {
					path: result,
					namespace: plugin.name,
					errors,
					warnings,
					watchFiles: mixedContext.getWatchFiles()
				};
				else if (typeof result === "object" && result !== null) return {
					path: result.id,
					external: result.external,
					namespace: plugin.name,
					errors,
					warnings,
					watchFiles: mixedContext.getWatchFiles()
				};
			});
			if (plugin.load) onLoad({ filter: onLoadFilter }, async (args) => {
				const { handler, filter } = normalizeObjectHook("load", plugin.load);
				const id = args.path + (args.suffix || "");
				if (plugin.loadInclude && !plugin.loadInclude(id)) return;
				if (!filter(id)) return;
				const { errors, warnings, mixedContext } = createPluginContext(context);
				let code;
				let map;
				const result = await handler.call(mixedContext, id);
				if (typeof result === "string") code = result;
				else if (typeof result === "object" && result !== null) {
					code = result.code;
					map = result.map;
				}
				if (code === void 0) return null;
				if (map) code = processCodeWithSourceMap(map, code);
				const resolveDir = path.dirname(args.path);
				return {
					contents: code,
					errors,
					warnings,
					watchFiles: mixedContext.getWatchFiles(),
					loader: unwrapLoader(loader, code, args.path),
					resolveDir
				};
			});
			if (plugin.transform) onTransform({ filter: onLoadFilter }, async (args) => {
				const { handler, filter } = normalizeObjectHook("transform", plugin.transform);
				const id = args.path + (args.suffix || "");
				if (plugin.transformInclude && !plugin.transformInclude(id)) return;
				let code = await args.getContents();
				if (!filter(id, code)) return;
				const { mixedContext, errors, warnings } = createPluginContext(context);
				const resolveDir = path.dirname(args.path);
				let map;
				const result = await handler.call(mixedContext, code, id);
				if (typeof result === "string") code = result;
				else if (typeof result === "object" && result !== null) {
					code = result.code;
					if (map && result.map) map = combineSourcemaps(args.path, [result.map === "string" ? JSON.parse(result.map) : result.map, map]);
					else if (typeof result.map === "string") map = JSON.parse(result.map);
					else map = result.map;
				}
				if (code) {
					if (map) code = processCodeWithSourceMap(map, code);
					return {
						contents: code,
						errors,
						warnings,
						watchFiles: mixedContext.getWatchFiles(),
						loader: unwrapLoader(loader, code, args.path),
						resolveDir
					};
				}
			});
			if (plugin.esbuild?.setup) return plugin.esbuild.setup(rawBuild);
		};
	};
}
function createFarmContext(context, currentResolveId) {
	return {
		parse: parse$1,
		addWatchFile(id) {
			context.addWatchFile(id, currentResolveId || id);
		},
		emitFile(emittedFile) {
			const outFileName = emittedFile.fileName || emittedFile.name;
			if (emittedFile.source && outFileName) context.emitFile({
				resolvedPath: outFileName,
				name: outFileName,
				content: [...Buffer$1.from(emittedFile.source)],
				resourceType: extname(outFileName)
			});
		},
		getWatchFiles() {
			return context.getWatchFiles();
		},
		getNativeBuildContext() {
			return {
				framework: "farm",
				context
			};
		}
	};
}
function unpluginContext(context) {
	return {
		error: (error) => context.error(typeof error === "string" ? new Error(error) : error),
		warn: (error) => context.warn(typeof error === "string" ? new Error(error) : error)
	};
}
function convertEnforceToPriority(value) {
	const defaultPriority = 100;
	const enforceToPriority = {
		pre: 102,
		post: 98
	};
	return enforceToPriority[value] !== void 0 ? enforceToPriority[value] : defaultPriority;
}
function convertWatchEventChange(value) {
	return {
		Added: "create",
		Updated: "update",
		Removed: "delete"
	}[value];
}
function isString(variable) {
	return typeof variable === "string";
}
function isObject(variable) {
	return typeof variable === "object" && variable !== null;
}
function customParseQueryString(url) {
	if (!url) return [];
	const queryString = url.split("?")[1];
	const parsedParams = querystring.parse(queryString);
	const paramsArray = [];
	for (const key in parsedParams) paramsArray.push([key, parsedParams[key]]);
	return paramsArray;
}
function encodeStr(str) {
	const len = str.length;
	if (len === 0) return str;
	const firstNullIndex = str.indexOf("\0");
	if (firstNullIndex === -1) return str;
	const result = Array.from({ length: len + countNulls(str, firstNullIndex) });
	let pos = 0;
	for (let i = 0; i < firstNullIndex; i++) result[pos++] = str[i];
	for (let i = firstNullIndex; i < len; i++) {
		const char = str[i];
		if (char === "\0") {
			result[pos++] = "\\";
			result[pos++] = "0";
		} else result[pos++] = char;
	}
	return path.posix.normalize(result.join(""));
}
function decodeStr(str) {
	const len = str.length;
	if (len === 0) return str;
	const firstIndex = str.indexOf("\\0");
	if (firstIndex === -1) return str;
	const result = Array.from({ length: len - countBackslashZeros(str, firstIndex) });
	let pos = 0;
	for (let i$1 = 0; i$1 < firstIndex; i$1++) result[pos++] = str[i$1];
	let i = firstIndex;
	while (i < len) if (str[i] === "\\" && str[i + 1] === "0") {
		result[pos++] = "\0";
		i += 2;
	} else result[pos++] = str[i++];
	return path.posix.normalize(result.join(""));
}
function getContentValue(content) {
	if (content === null || content === void 0) throw new Error("Content cannot be null or undefined");
	return encodeStr(typeof content === "string" ? content : content.code || "");
}
function countNulls(str, startIndex) {
	let count = 0;
	const len = str.length;
	for (let i = startIndex; i < len; i++) if (str[i] === "\0") count++;
	return count;
}
function countBackslashZeros(str, startIndex) {
	let count = 0;
	const len = str.length;
	for (let i = startIndex; i < len - 1; i++) if (str[i] === "\\" && str[i + 1] === "0") {
		count++;
		i++;
	}
	return count;
}
function removeQuery(pathe) {
	const queryIndex = pathe.indexOf("?");
	if (queryIndex !== -1) return path.posix.normalize(pathe.slice(0, queryIndex));
	return path.posix.normalize(pathe);
}
function isStartsWithSlash(str) {
	return str?.startsWith("/");
}
function appendQuery(id, query) {
	if (!query.length) return id;
	return `${id}?${stringifyQuery(query)}`;
}
function stringifyQuery(query) {
	if (!query.length) return "";
	let queryStr = "";
	for (const [key, value] of query) queryStr += `${key}${value ? `=${value}` : ""}&`;
	return `${queryStr.slice(0, -1)}`;
}
const CSS_LANGS_RES = [
	[/\.(less)(?:$|\?)/, "less"],
	[/\.(scss|sass)(?:$|\?)/, "sass"],
	[/\.(styl|stylus)(?:$|\?)/, "stylus"],
	[/\.(css)(?:$|\?)/, "css"]
];
const JS_LANGS_RES = [
	[/\.(js|mjs|cjs)(?:$|\?)/, "js"],
	[/\.(jsx)(?:$|\?)/, "jsx"],
	[/\.(ts|cts|mts)(?:$|\?)/, "ts"],
	[/\.(tsx)(?:$|\?)/, "tsx"]
];
function getCssModuleType(id) {
	for (const [reg, lang] of CSS_LANGS_RES) if (reg.test(id)) return lang;
	return null;
}
function getJsModuleType(id) {
	for (const [reg, lang] of JS_LANGS_RES) if (reg.test(id)) return lang;
	return null;
}
function formatLoadModuleType(id) {
	const cssModuleType = getCssModuleType(id);
	if (cssModuleType) return cssModuleType;
	const jsModuleType = getJsModuleType(id);
	if (jsModuleType) return jsModuleType;
	return "js";
}
function formatTransformModuleType(id) {
	return formatLoadModuleType(id);
}
function getFarmPlugin(factory) {
	return ((userOptions) => {
		const plugins = toArray$2(factory(userOptions, { framework: "farm" })).map((rawPlugin) => {
			const plugin = toFarmPlugin(rawPlugin, userOptions);
			if (rawPlugin.farm) Object.assign(plugin, rawPlugin.farm);
			return plugin;
		});
		return plugins.length === 1 ? plugins[0] : plugins;
	});
}
function toFarmPlugin(plugin, options) {
	const farmPlugin = {
		name: plugin.name,
		priority: convertEnforceToPriority(plugin.enforce)
	};
	if (plugin.farm) Object.keys(plugin.farm).forEach((key) => {
		const value = plugin.farm[key];
		if (value) Reflect.set(farmPlugin, key, value);
	});
	if (plugin.buildStart) {
		const _buildStart = plugin.buildStart;
		farmPlugin.buildStart = { async executor(_, context) {
			await _buildStart.call(createFarmContext(context));
		} };
	}
	if (plugin.resolveId) {
		const _resolveId = plugin.resolveId;
		let filters = [];
		if (options) filters = options?.filters ?? [];
		farmPlugin.resolve = {
			filters: {
				sources: filters.length ? filters : [".*"],
				importers: [".*"]
			},
			async executor(params, context) {
				const resolvedIdPath = path.resolve(params.importer ?? "");
				const id = decodeStr(params.source);
				const { handler, filter } = normalizeObjectHook("resolveId", _resolveId);
				if (!filter(id)) return null;
				let isEntry = false;
				if (isObject(params.kind) && "entry" in params.kind) isEntry = params.kind.entry === "index";
				const farmContext = createFarmContext(context, resolvedIdPath);
				const resolveIdResult = await handler.call(Object.assign(unpluginContext(context), farmContext), id, resolvedIdPath ?? null, { isEntry });
				if (isString(resolveIdResult)) return {
					resolvedPath: removeQuery(encodeStr(resolveIdResult)),
					query: customParseQueryString(resolveIdResult),
					sideEffects: true,
					external: false,
					meta: {}
				};
				if (isObject(resolveIdResult)) return {
					resolvedPath: removeQuery(encodeStr(resolveIdResult?.id)),
					query: customParseQueryString(resolveIdResult?.id),
					sideEffects: false,
					external: Boolean(resolveIdResult?.external),
					meta: {}
				};
				if (!isStartsWithSlash(params.source)) return null;
			}
		};
	}
	if (plugin.load) {
		const _load = plugin.load;
		farmPlugin.load = {
			filters: { resolvedPaths: [".*"] },
			async executor(params, context) {
				const id = appendQuery(decodeStr(params.resolvedPath), params.query);
				const loader = formatTransformModuleType(id);
				if (plugin.loadInclude && !plugin.loadInclude?.(id)) return null;
				const { handler, filter } = normalizeObjectHook("load", _load);
				if (!filter(id)) return null;
				const farmContext = createFarmContext(context, id);
				return {
					content: getContentValue(await handler.call(Object.assign(unpluginContext(context), farmContext), id)),
					moduleType: loader
				};
			}
		};
	}
	if (plugin.transform) {
		const _transform = plugin.transform;
		farmPlugin.transform = {
			filters: {
				resolvedPaths: [".*"],
				moduleTypes: [".*"]
			},
			async executor(params, context) {
				const id = appendQuery(decodeStr(params.resolvedPath), params.query);
				const loader = formatTransformModuleType(id);
				if (plugin.transformInclude && !plugin.transformInclude(id)) return null;
				const { handler, filter } = normalizeObjectHook("transform", _transform);
				if (!filter(id, params.content)) return null;
				const farmContext = createFarmContext(context, id);
				const resource = await handler.call(Object.assign(unpluginContext(context), farmContext), params.content, id);
				if (resource && typeof resource !== "string") return {
					content: getContentValue(resource),
					moduleType: loader,
					sourceMap: typeof resource.map === "object" && resource.map !== null ? JSON.stringify(resource.map) : void 0
				};
			}
		};
	}
	if (plugin.watchChange) {
		const _watchChange = plugin.watchChange;
		farmPlugin.updateModules = { async executor(param, context) {
			const updatePathContent = param.paths[0];
			const ModifiedPath = updatePathContent[0];
			const eventChange = convertWatchEventChange(updatePathContent[1]);
			await _watchChange.call(createFarmContext(context), ModifiedPath, { event: eventChange });
		} };
	}
	if (plugin.buildEnd) {
		const _buildEnd = plugin.buildEnd;
		farmPlugin.buildEnd = { async executor(_, context) {
			await _buildEnd.call(createFarmContext(context));
		} };
	}
	if (plugin.writeBundle) {
		const _writeBundle = plugin.writeBundle;
		farmPlugin.finish = { async executor() {
			await _writeBundle();
		} };
	}
	return farmPlugin;
}
function getRollupPlugin(factory) {
	return ((userOptions) => {
		const plugins = toArray$2(factory(userOptions, { framework: "rollup" })).map((plugin) => toRollupPlugin(plugin, "rollup"));
		return plugins.length === 1 ? plugins[0] : plugins;
	});
}
function toRollupPlugin(plugin, key) {
	const nativeFilter = key === "rolldown";
	if (plugin.resolveId && !nativeFilter && typeof plugin.resolveId === "object" && plugin.resolveId.filter) {
		const resolveIdHook = plugin.resolveId;
		const { handler, filter } = normalizeObjectHook("load", resolveIdHook);
		replaceHookHandler("resolveId", resolveIdHook, function(...args) {
			const [id] = args;
			if (!supportNativeFilter(this, key) && !filter(id)) return;
			return handler.apply(this, args);
		});
	}
	if (plugin.load && (plugin.loadInclude || !nativeFilter && typeof plugin.load === "object" && plugin.load.filter)) {
		const loadHook = plugin.load;
		const { handler, filter } = normalizeObjectHook("load", loadHook);
		replaceHookHandler("load", loadHook, function(...args) {
			const [id] = args;
			if (plugin.loadInclude && !plugin.loadInclude(id)) return;
			if (!supportNativeFilter(this, key) && !filter(id)) return;
			return handler.apply(this, args);
		});
	}
	if (plugin.transform && (plugin.transformInclude || !nativeFilter && typeof plugin.transform === "object" && plugin.transform.filter)) {
		const transformHook = plugin.transform;
		const { handler, filter } = normalizeObjectHook("transform", transformHook);
		replaceHookHandler("transform", transformHook, function(...args) {
			const [code, id] = args;
			if (plugin.transformInclude && !plugin.transformInclude(id)) return;
			if (!supportNativeFilter(this, key) && !filter(id, code)) return;
			return handler.apply(this, args);
		});
	}
	if (plugin[key]) Object.assign(plugin, plugin[key]);
	return plugin;
	function replaceHookHandler(name, hook, handler) {
		if (typeof hook === "function") plugin[name] = handler;
		else hook.handler = handler;
	}
}
function supportNativeFilter(context, framework) {
	if (framework === "unloader") return false;
	if (framework === "vite") return !!context?.meta?.viteVersion;
	if (framework === "rolldown") return true;
	const rollupVersion = context?.meta?.rollupVersion;
	if (!rollupVersion) return false;
	const [major, minor] = rollupVersion.split(".");
	return Number(major) > 4 || Number(major) === 4 && Number(minor) >= 40;
}
function getRolldownPlugin(factory) {
	return ((userOptions) => {
		const plugins = toArray$2(factory(userOptions, { framework: "rolldown" })).map((rawPlugin) => {
			return toRollupPlugin(rawPlugin, "rolldown");
		});
		return plugins.length === 1 ? plugins[0] : plugins;
	});
}
const getFilename = () => fileURLToPath(import.meta.url);
const getDirname = () => path.dirname(getFilename());
const __dirname = /* @__PURE__ */ getDirname();
const TRANSFORM_LOADER$1 = resolve(__dirname, "rspack/loaders/transform");
const LOAD_LOADER$1 = resolve(__dirname, "rspack/loaders/load");
function getRspackPlugin(factory) {
	return (userOptions) => {
		return { apply(compiler) {
			const VIRTUAL_MODULE_PREFIX = resolve(compiler.options.context ?? process.cwd(), "node_modules/.virtual", compiler.rspack.experiments.VirtualModulesPlugin ? "" : process.pid.toString());
			const meta = {
				framework: "rspack",
				rspack: { compiler }
			};
			const rawPlugins = toArray$2(factory(userOptions, meta));
			for (const rawPlugin of rawPlugins) {
				const plugin = Object.assign(rawPlugin, {
					__unpluginMeta: meta,
					__virtualModulePrefix: VIRTUAL_MODULE_PREFIX
				});
				const externalModules = /* @__PURE__ */ new Set();
				if (plugin.resolveId) {
					const createPlugin = (plugin$1) => {
						if (compiler.rspack.experiments.VirtualModulesPlugin) return new compiler.rspack.experiments.VirtualModulesPlugin();
						return new FakeVirtualModulesPlugin(plugin$1);
					};
					const vfs = createPlugin(plugin);
					vfs.apply(compiler);
					const vfsModules = /* @__PURE__ */ new Map();
					plugin.__vfsModules = vfsModules;
					plugin.__vfs = vfs;
					compiler.hooks.compilation.tap(plugin.name, (compilation, { normalModuleFactory }) => {
						normalModuleFactory.hooks.resolve.tapPromise(plugin.name, async (resolveData) => {
							const id = normalizeAbsolutePath(resolveData.request);
							const requestContext = resolveData.contextInfo;
							let importer = requestContext.issuer !== "" ? requestContext.issuer : void 0;
							const isEntry = requestContext.issuer === "";
							if (importer?.startsWith(plugin.__virtualModulePrefix)) importer = decodeURIComponent(importer.slice(plugin.__virtualModulePrefix.length));
							const context = createBuildContext$1(compiler, compilation);
							let error;
							const pluginContext = {
								error(msg) {
									if (error == null) error = normalizeMessage$1(msg);
									else console.error(`unplugin/rspack: multiple errors returned from resolveId hook: ${msg}`);
								},
								warn(msg) {
									console.warn(`unplugin/rspack: warning from resolveId hook: ${msg}`);
								}
							};
							const { handler, filter } = normalizeObjectHook("resolveId", plugin.resolveId);
							if (!filter(id)) return;
							const resolveIdResult = await handler.call({
								...context,
								...pluginContext
							}, id, importer, { isEntry });
							if (error != null) throw error;
							if (resolveIdResult == null) return;
							let resolved = typeof resolveIdResult === "string" ? resolveIdResult : resolveIdResult.id;
							if (typeof resolveIdResult === "string" ? false : resolveIdResult.external === true) externalModules.add(resolved);
							let isVirtual = true;
							try {
								(compiler.inputFileSystem?.statSync ?? fs.statSync)(resolved);
								isVirtual = false;
							} catch {
								isVirtual = !isVirtualModuleId(resolved, plugin);
							}
							if (isVirtual) {
								const encodedVirtualPath = encodeVirtualModuleId(resolved, plugin);
								if (!vfsModules.has(resolved)) {
									const fsPromise = Promise.resolve(vfs.writeModule(encodedVirtualPath, ""));
									vfsModules.set(resolved, fsPromise);
									await fsPromise;
								} else await vfsModules.get(resolved);
								resolved = encodedVirtualPath;
							}
							resolveData.request = resolved;
						});
					});
				}
				if (plugin.load) compiler.options.module.rules.unshift({
					enforce: plugin.enforce,
					include(id) {
						if (isVirtualModuleId(id, plugin)) id = decodeVirtualModuleId(id, plugin);
						if (plugin.loadInclude && !plugin.loadInclude(id)) return false;
						const { filter } = normalizeObjectHook("load", plugin.load);
						if (!filter(id)) return false;
						return !externalModules.has(id);
					},
					use: [{
						loader: LOAD_LOADER$1,
						options: { plugin }
					}],
					type: "javascript/auto"
				});
				if (plugin.transform) compiler.options.module.rules.unshift({
					enforce: plugin.enforce,
					use(data) {
						return transformUse(data, plugin, TRANSFORM_LOADER$1);
					}
				});
				if (plugin.rspack) plugin.rspack(compiler);
				if (plugin.watchChange || plugin.buildStart) compiler.hooks.make.tapPromise(plugin.name, async (compilation) => {
					const context = createBuildContext$1(compiler, compilation);
					if (plugin.watchChange && (compiler.modifiedFiles || compiler.removedFiles)) {
						const promises = [];
						if (compiler.modifiedFiles) compiler.modifiedFiles.forEach((file) => promises.push(Promise.resolve(plugin.watchChange.call(context, file, { event: "update" }))));
						if (compiler.removedFiles) compiler.removedFiles.forEach((file) => promises.push(Promise.resolve(plugin.watchChange.call(context, file, { event: "delete" }))));
						await Promise.all(promises);
					}
					if (plugin.buildStart) return await plugin.buildStart.call(context);
				});
				if (plugin.buildEnd) compiler.hooks.emit.tapPromise(plugin.name, async (compilation) => {
					await plugin.buildEnd.call(createBuildContext$1(compiler, compilation));
				});
				if (plugin.writeBundle) compiler.hooks.afterEmit.tapPromise(plugin.name, async () => {
					await plugin.writeBundle();
				});
			}
		} };
	};
}
function getUnloaderPlugin(factory) {
	return ((userOptions) => {
		const plugins = toArray$2(factory(userOptions, { framework: "unloader" })).map((rawPlugin) => {
			return toRollupPlugin(rawPlugin, "unloader");
		});
		return plugins.length === 1 ? plugins[0] : plugins;
	});
}
function getVitePlugin(factory) {
	return ((userOptions) => {
		const plugins = toArray$2(factory(userOptions, { framework: "vite" })).map((rawPlugin) => {
			return toRollupPlugin(rawPlugin, "vite");
		});
		return plugins.length === 1 ? plugins[0] : plugins;
	});
}
const TRANSFORM_LOADER = resolve(__dirname, "webpack/loaders/transform");
const LOAD_LOADER = resolve(__dirname, "webpack/loaders/load");
function getWebpackPlugin(factory) {
	return (userOptions) => {
		return { apply(compiler) {
			const VIRTUAL_MODULE_PREFIX = resolve(compiler.options.context ?? process$1.cwd(), "_virtual_");
			const meta = {
				framework: "webpack",
				webpack: { compiler }
			};
			const rawPlugins = toArray$2(factory(userOptions, meta));
			for (const rawPlugin of rawPlugins) {
				const plugin = Object.assign(rawPlugin, {
					__unpluginMeta: meta,
					__virtualModulePrefix: VIRTUAL_MODULE_PREFIX
				});
				const externalModules = /* @__PURE__ */ new Set();
				if (plugin.resolveId) {
					let vfs = compiler.options.plugins.find((i) => i instanceof import_lib.default);
					if (!vfs) {
						vfs = new import_lib.default();
						compiler.options.plugins.push(vfs);
					}
					const vfsModules = /* @__PURE__ */ new Set();
					plugin.__vfsModules = vfsModules;
					plugin.__vfs = vfs;
					const resolverPlugin = { apply(resolver) {
						const target = resolver.ensureHook("resolve");
						resolver.getHook("resolve").tapAsync(plugin.name, async (request, resolveContext, callback) => {
							if (!request.request) return callback();
							if (normalizeAbsolutePath(request.request).startsWith(plugin.__virtualModulePrefix)) return callback();
							const id = normalizeAbsolutePath(request.request);
							const requestContext = request.context;
							let importer = requestContext.issuer !== "" ? requestContext.issuer : void 0;
							const isEntry = requestContext.issuer === "";
							if (importer?.startsWith(plugin.__virtualModulePrefix)) importer = decodeURIComponent(importer.slice(plugin.__virtualModulePrefix.length));
							const fileDependencies = /* @__PURE__ */ new Set();
							const context = createBuildContext({
								addWatchFile(file) {
									fileDependencies.add(file);
									resolveContext.fileDependencies?.add(file);
								},
								getWatchFiles() {
									return Array.from(fileDependencies);
								}
							}, compiler);
							let error;
							const pluginContext = {
								error(msg) {
									if (error == null) error = normalizeMessage(msg);
									else console.error(`unplugin/webpack: multiple errors returned from resolveId hook: ${msg}`);
								},
								warn(msg) {
									console.warn(`unplugin/webpack: warning from resolveId hook: ${msg}`);
								}
							};
							const { handler, filter } = normalizeObjectHook("resolveId", plugin.resolveId);
							if (!filter(id)) return callback();
							const resolveIdResult = await handler.call({
								...context,
								...pluginContext
							}, id, importer, { isEntry });
							if (error != null) return callback(error);
							if (resolveIdResult == null) return callback();
							let resolved = typeof resolveIdResult === "string" ? resolveIdResult : resolveIdResult.id;
							if (typeof resolveIdResult === "string" ? false : resolveIdResult.external === true) externalModules.add(resolved);
							if (!fs.existsSync(resolved)) {
								resolved = normalizeAbsolutePath(plugin.__virtualModulePrefix + encodeURIComponent(resolved));
								if (!vfsModules.has(resolved)) {
									plugin.__vfs.writeModule(resolved, "");
									vfsModules.add(resolved);
								}
							}
							const newRequest = {
								...request,
								request: resolved
							};
							resolver.doResolve(target, newRequest, null, resolveContext, callback);
						});
					} };
					compiler.options.resolve.plugins = compiler.options.resolve.plugins || [];
					compiler.options.resolve.plugins.push(resolverPlugin);
				}
				if (plugin.load) compiler.options.module.rules.unshift({
					include(id) {
						return shouldLoad(id, plugin, externalModules);
					},
					enforce: plugin.enforce,
					use: [{
						loader: LOAD_LOADER,
						options: { plugin }
					}],
					type: "javascript/auto"
				});
				if (plugin.transform) compiler.options.module.rules.unshift({
					enforce: plugin.enforce,
					use(data) {
						return transformUse(data, plugin, TRANSFORM_LOADER);
					}
				});
				if (plugin.webpack) plugin.webpack(compiler);
				if (plugin.watchChange || plugin.buildStart) compiler.hooks.make.tapPromise(plugin.name, async (compilation) => {
					const context = createBuildContext(contextOptionsFromCompilation(compilation), compiler, compilation);
					if (plugin.watchChange && (compiler.modifiedFiles || compiler.removedFiles)) {
						const promises = [];
						if (compiler.modifiedFiles) compiler.modifiedFiles.forEach((file) => promises.push(Promise.resolve(plugin.watchChange.call(context, file, { event: "update" }))));
						if (compiler.removedFiles) compiler.removedFiles.forEach((file) => promises.push(Promise.resolve(plugin.watchChange.call(context, file, { event: "delete" }))));
						await Promise.all(promises);
					}
					if (plugin.buildStart) return await plugin.buildStart.call(context);
				});
				if (plugin.buildEnd) compiler.hooks.emit.tapPromise(plugin.name, async (compilation) => {
					await plugin.buildEnd.call(createBuildContext(contextOptionsFromCompilation(compilation), compiler, compilation));
				});
				if (plugin.writeBundle) compiler.hooks.afterEmit.tapPromise(plugin.name, async () => {
					await plugin.writeBundle();
				});
			}
		} };
	};
}
function shouldLoad(id, plugin, externalModules) {
	if (id.startsWith(plugin.__virtualModulePrefix)) id = decodeURIComponent(id.slice(plugin.__virtualModulePrefix.length));
	if (plugin.loadInclude && !plugin.loadInclude(id)) return false;
	const { filter } = normalizeObjectHook("load", plugin.load);
	if (!filter(id)) return false;
	return !externalModules.has(id);
}
function createUnplugin(factory) {
	return {
		get esbuild() {
			return getEsbuildPlugin(factory);
		},
		get rollup() {
			return getRollupPlugin(factory);
		},
		get vite() {
			return getVitePlugin(factory);
		},
		get rolldown() {
			return getRolldownPlugin(factory);
		},
		get webpack() {
			return getWebpackPlugin(factory);
		},
		get rspack() {
			return getRspackPlugin(factory);
		},
		get farm() {
			return getFarmPlugin(factory);
		},
		get unloader() {
			return getUnloaderPlugin(factory);
		},
		get raw() {
			return factory;
		}
	};
}
function normalizePath$1(filename) {
	return filename.replaceAll("\\", "/");
}
const isArray = Array.isArray;
function toArray$1(thing) {
	if (isArray(thing)) return thing;
	if (thing == null) return [];
	return [thing];
}
const escapeMark = "[_#EsCaPe#_]";
function getMatcherString(id, resolutionBase) {
	if (resolutionBase === false || isAbsolute$2(id) || id.startsWith("**")) return normalizePath$1(id);
	return join$2(normalizePath$1(resolve$3(resolutionBase || "")).replaceAll(/[-^$*+?.()|[\]{}]/g, `${escapeMark}$&`), normalizePath$1(id)).replaceAll(escapeMark, "\\");
}
function createFilter(include, exclude, options) {
	const resolutionBase = options && options.resolve;
	const getMatcher = (id) => id instanceof RegExp ? id : { test: (what) => {
		return (0, import_picomatch.default)(getMatcherString(id, resolutionBase), { dot: true })(what);
	} };
	const includeMatchers = toArray$1(include).map(getMatcher);
	const excludeMatchers = toArray$1(exclude).map(getMatcher);
	if (!includeMatchers.length && !excludeMatchers.length) return (id) => typeof id === "string" && !id.includes("\0");
	return function result(id) {
		if (typeof id !== "string") return false;
		if (id.includes("\0")) return false;
		const pathId = normalizePath$1(id);
		for (const matcher of excludeMatchers) {
			if (matcher instanceof RegExp) matcher.lastIndex = 0;
			if (matcher.test(pathId)) return false;
		}
		for (const matcher of includeMatchers) {
			if (matcher instanceof RegExp) matcher.lastIndex = 0;
			if (matcher.test(pathId)) return true;
		}
		return !includeMatchers.length;
	};
}
var unplugin_exports = /* @__PURE__ */ __exportAll$1({
	default: () => unplugin,
	defaultExcludes: () => defaultExcludes,
	defaultIncludes: () => defaultIncludes
});
const defaultIncludes = [
	/\.[jt]sx?$/,
	/\.vue$/,
	/\.vue\?vue/,
	/\.svelte$/
];
const defaultExcludes = [/[\\/]node_modules[\\/]/, /[\\/]\.git[\\/]/];
function toArray(x) {
	return x == null ? [] : Array.isArray(x) ? x : [x];
}
const unplugin = createUnplugin((options = {}) => {
	const ctx = createUnimport(options);
	const filter = createFilter(toArray(options.include || []).length ? options.include : defaultIncludes, options.exclude || defaultExcludes);
	const dts = options.dts === true ? "unimport.d.ts" : options.dts;
	const { autoImport = true } = options;
	return {
		name: "unimport",
		enforce: "post",
		transformInclude(id) {
			return filter(id);
		},
		async transform(code, id) {
			const s = new MagicString(code);
			await ctx.injectImports(s, id, { autoImport });
			if (!s.hasChanged()) return;
			return {
				code: s.toString(),
				map: s.generateMap()
			};
		},
		async buildStart() {
			await ctx.init();
			if (dts) return promises.writeFile(dts, await ctx.generateTypeDeclarations(), "utf-8");
		}
	};
});
var require_commondir = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	var path$5 = __require("path");
	module.exports = function(basedir, relfiles) {
		if (relfiles) var files = relfiles.map(function(r) {
			return path$5.resolve(basedir, r);
		});
		else var files = basedir;
		var res = files.slice(1).reduce(function(ps, file) {
			if (!file.match(/^([A-Za-z]:)?\/|\\/)) throw new Error("relative path without a basedir");
			var xs = file.split(/\/+|\\+/);
			for (var i = 0; ps[i] === xs[i] && i < Math.min(ps.length, xs.length); i++);
			return ps.slice(0, i);
		}, files[0].split(/\/+|\\+/));
		return res.length > 1 ? res.join("/") : "/";
	};
}));
function isReference(node, parent) {
	if (node.type === "MemberExpression") return !node.computed && isReference(node.object, node);
	if (node.type === "Identifier") {
		if (!parent) return true;
		switch (parent.type) {
			case "MemberExpression": return parent.computed || node === parent.object;
			case "MethodDefinition": return parent.computed;
			case "FieldDefinition": return parent.computed || node === parent.value;
			case "Property": return parent.computed || node === parent.value;
			case "ExportSpecifier":
			case "ImportSpecifier": return node === parent.local;
			case "LabeledStatement":
			case "BreakStatement":
			case "ContinueStatement": return false;
			default: return true;
		}
	}
	return false;
}
var import_commondir = /* @__PURE__ */ __toESM(require_commondir(), 1);
var version$1 = "29.0.0";
var peerDependencies$1 = { rollup: "^2.68.0||^3.0.0||^4.0.0" };
function tryParse(parse, code, id) {
	try {
		return parse(code, { allowReturnOutsideFunction: true });
	} catch (err) {
		err.message += ` in ${id}`;
		throw err;
	}
}
const firstpassGlobal = /\b(?:require|module|exports|global)\b/;
const firstpassNoGlobal = /\b(?:require|module|exports)\b/;
function hasCjsKeywords(code, ignoreGlobal) {
	return (ignoreGlobal ? firstpassNoGlobal : firstpassGlobal).test(code);
}
function analyzeTopLevelStatements(parse, code, id) {
	const ast = tryParse(parse, code, id);
	let isEsModule = false;
	let hasDefaultExport = false;
	let hasNamedExports = false;
	for (const node of ast.body) switch (node.type) {
		case "ExportDefaultDeclaration":
			isEsModule = true;
			hasDefaultExport = true;
			break;
		case "ExportNamedDeclaration":
			isEsModule = true;
			if (node.declaration) hasNamedExports = true;
			else for (const specifier of node.specifiers) if (specifier.exported.name === "default") hasDefaultExport = true;
			else hasNamedExports = true;
			break;
		case "ExportAllDeclaration":
			isEsModule = true;
			if (node.exported && node.exported.name === "default") hasDefaultExport = true;
			else hasNamedExports = true;
			break;
		case "ImportDeclaration":
			isEsModule = true;
			break;
	}
	return {
		isEsModule,
		hasDefaultExport,
		hasNamedExports,
		ast
	};
}
function deconflict(scopes, globals, identifier) {
	let i = 1;
	let deconflicted = makeLegalIdentifier(identifier);
	const hasConflicts = () => scopes.some((scope) => scope.contains(deconflicted)) || globals.has(deconflicted);
	while (hasConflicts()) {
		deconflicted = makeLegalIdentifier(`${identifier}_${i}`);
		i += 1;
	}
	for (const scope of scopes) scope.declarations[deconflicted] = true;
	return deconflicted;
}
function getName(id) {
	const name = makeLegalIdentifier(basename$1(id, extname$1(id)));
	if (name !== "index") return name;
	return makeLegalIdentifier(basename$1(dirname$1(id)));
}
function normalizePathSlashes(path) {
	return path.replace(/\\/g, "/");
}
const getVirtualPathForDynamicRequirePath = (path, commonDir) => `/${normalizePathSlashes(relative$1(commonDir, path))}`;
function capitalize(name) {
	return name[0].toUpperCase() + name.slice(1);
}
function getStrictRequiresFilter({ strictRequires }) {
	switch (strictRequires) {
		case void 0:
		case true: return {
			strictRequiresFilter: () => true,
			detectCyclesAndConditional: false
		};
		case "auto":
		case "debug":
		case null: return {
			strictRequiresFilter: () => false,
			detectCyclesAndConditional: true
		};
		case false: return {
			strictRequiresFilter: () => false,
			detectCyclesAndConditional: false
		};
		default:
			if (typeof strictRequires === "string" || Array.isArray(strictRequires)) return {
				strictRequiresFilter: createFilter$2(strictRequires),
				detectCyclesAndConditional: false
			};
			throw new Error("Unexpected value for \"strictRequires\" option.");
	}
}
function getPackageEntryPoint(dirPath) {
	let entryPoint = "index.js";
	try {
		if (existsSync$1(join$1(dirPath, "package.json"))) entryPoint = JSON.parse(readFileSync$1(join$1(dirPath, "package.json"), { encoding: "utf8" })).main || entryPoint;
	} catch (ignored) {}
	return entryPoint;
}
function isDirectory(path) {
	try {
		if (statSync$1(path).isDirectory()) return true;
	} catch (ignored) {}
	return false;
}
function getDynamicRequireModules(patterns, dynamicRequireRoot) {
	const dynamicRequireModules = /* @__PURE__ */ new Map();
	const dirNames = /* @__PURE__ */ new Set();
	for (const pattern of !patterns || Array.isArray(patterns) ? patterns || [] : [patterns]) {
		const isNegated = pattern.startsWith("!");
		const modifyMap = (targetPath, resolvedPath) => isNegated ? dynamicRequireModules.delete(targetPath) : dynamicRequireModules.set(targetPath, resolvedPath);
		for (const path of new Builder().withBasePath().withDirs().glob(isNegated ? pattern.substr(1) : pattern).crawl(relative$1(".", dynamicRequireRoot)).sync().sort((a, b) => a.localeCompare(b, "en"))) {
			const resolvedPath = resolve$1(path);
			const requirePath = normalizePathSlashes(resolvedPath);
			if (isDirectory(resolvedPath)) {
				dirNames.add(resolvedPath);
				const modulePath = resolve$1(join$1(resolvedPath, getPackageEntryPoint(path)));
				modifyMap(requirePath, modulePath);
				modifyMap(normalizePathSlashes(modulePath), modulePath);
			} else {
				dirNames.add(dirname$1(resolvedPath));
				modifyMap(requirePath, resolvedPath);
			}
		}
	}
	return {
		commonDir: dirNames.size ? (0, import_commondir.default)([...dirNames, dynamicRequireRoot]) : null,
		dynamicRequireModules
	};
}
const FAILED_REQUIRE_ERROR = `throw new Error('Could not dynamically require "' + path + '". Please configure the dynamicRequireTargets or/and ignoreDynamicRequires option of @rollup/plugin-commonjs appropriately for this require call to work.');`;
const COMMONJS_REQUIRE_EXPORT = "commonjsRequire";
const CREATE_COMMONJS_REQUIRE_EXPORT = "createCommonjsRequire";
function getDynamicModuleRegistry(isDynamicRequireModulesEnabled, dynamicRequireModules, commonDir, ignoreDynamicRequires) {
	if (!isDynamicRequireModulesEnabled) return `export function ${COMMONJS_REQUIRE_EXPORT}(path) {
	${FAILED_REQUIRE_ERROR}
}`;
	return `${[...dynamicRequireModules.values()].map((id, index) => `import ${id.endsWith(".json") ? `json${index}` : `{ __require as require${index} }`} from ${JSON.stringify(id)};`).join("\n")}

var dynamicModules;

function getDynamicModules() {
	return dynamicModules || (dynamicModules = {
${[...dynamicRequireModules.keys()].map((id, index) => `\t\t${JSON.stringify(getVirtualPathForDynamicRequirePath(id, commonDir))}: ${id.endsWith(".json") ? `function () { return json${index}; }` : `require${index}`}`).join(",\n")}
	});
}

export function ${CREATE_COMMONJS_REQUIRE_EXPORT}(originalModuleDir) {
	function handleRequire(path) {
		var resolvedPath = commonjsResolve(path, originalModuleDir);
		if (resolvedPath !== null) {
			return getDynamicModules()[resolvedPath]();
		}
		${ignoreDynamicRequires ? "return require(path);" : FAILED_REQUIRE_ERROR}
	}
	handleRequire.resolve = function (path) {
		var resolvedPath = commonjsResolve(path, originalModuleDir);
		if (resolvedPath !== null) {
			return resolvedPath;
		}
		return require.resolve(path);
	}
	return handleRequire;
}

function commonjsResolve (path, originalModuleDir) {
	var shouldTryNodeModules = isPossibleNodeModulesPath(path);
	path = normalize(path);
	var relPath;
	if (path[0] === '/') {
		originalModuleDir = '';
	}
	var modules = getDynamicModules();
	var checkedExtensions = ['', '.js', '.json'];
	while (true) {
		if (!shouldTryNodeModules) {
			relPath = normalize(originalModuleDir + '/' + path);
		} else {
			relPath = normalize(originalModuleDir + '/node_modules/' + path);
		}

		if (relPath.endsWith('/..')) {
			break; // Travelled too far up, avoid infinite loop
		}

		for (var extensionIndex = 0; extensionIndex < checkedExtensions.length; extensionIndex++) {
			var resolvedPath = relPath + checkedExtensions[extensionIndex];
			if (modules[resolvedPath]) {
				return resolvedPath;
			}
		}
		if (!shouldTryNodeModules) break;
		var nextDir = normalize(originalModuleDir + '/..');
		if (nextDir === originalModuleDir) break;
		originalModuleDir = nextDir;
	}
	return null;
}

function isPossibleNodeModulesPath (modulePath) {
	var c0 = modulePath[0];
	if (c0 === '/' || c0 === '\\\\') return false;
	var c1 = modulePath[1], c2 = modulePath[2];
	if ((c0 === '.' && (!c1 || c1 === '/' || c1 === '\\\\')) ||
		(c0 === '.' && c1 === '.' && (!c2 || c2 === '/' || c2 === '\\\\'))) return false;
	if (c1 === ':' && (c2 === '/' || c2 === '\\\\')) return false;
	return true;
}

function normalize (path) {
	path = path.replace(/\\\\/g, '/');
	var parts = path.split('/');
	var slashed = parts[0] === '';
	for (var i = 1; i < parts.length; i++) {
		if (parts[i] === '.' || parts[i] === '') {
			parts.splice(i--, 1);
		}
	}
	for (var i = 1; i < parts.length; i++) {
		if (parts[i] !== '..') continue;
		if (i > 0 && parts[i - 1] !== '..' && parts[i - 1] !== '.') {
			parts.splice(--i, 2);
			i--;
		}
	}
	path = parts.join('/');
	if (slashed && path[0] !== '/') path = '/' + path;
	else if (path.length === 0) path = '.';
	return path;
}`;
}
const isWrappedId = (id, suffix) => id.endsWith(suffix);
const wrapId = (id, suffix) => `\0${id}${suffix}`;
const unwrapId = (wrappedId, suffix) => wrappedId.slice(1, -suffix.length);
const PROXY_SUFFIX = "?commonjs-proxy";
const WRAPPED_SUFFIX = "?commonjs-wrapped";
const EXTERNAL_SUFFIX = "?commonjs-external";
const EXPORTS_SUFFIX = "?commonjs-exports";
const MODULE_SUFFIX = "?commonjs-module";
const ENTRY_SUFFIX = "?commonjs-entry";
const ES_IMPORT_SUFFIX = "?commonjs-es-import";
const DYNAMIC_MODULES_ID = "\0commonjs-dynamic-modules";
const HELPERS_ID = "\0commonjsHelpers.js";
const IS_WRAPPED_COMMONJS = "withRequireFunction";
const HELPERS = `
export var commonjsGlobal = typeof globalThis !== 'undefined' ? globalThis : typeof window !== 'undefined' ? window : typeof global !== 'undefined' ? global : typeof self !== 'undefined' ? self : {};

export function getDefaultExportFromCjs (x) {
	return x && x.__esModule && Object.prototype.hasOwnProperty.call(x, 'default') ? x['default'] : x;
}

export function getDefaultExportFromNamespaceIfPresent (n) {
	return n && Object.prototype.hasOwnProperty.call(n, 'default') ? n['default'] : n;
}

export function getDefaultExportFromNamespaceIfNotNamed (n) {
	return n && Object.prototype.hasOwnProperty.call(n, 'default') && Object.keys(n).length === 1 ? n['default'] : n;
}

export function getAugmentedNamespace(n) {
  if (Object.prototype.hasOwnProperty.call(n, '__esModule')) return n;
  var f = n.default;
	if (typeof f == "function") {
		var a = function a () {
			var isInstance = false;
      try {
        isInstance = this instanceof a;
      } catch {}
			if (isInstance) {
        return Reflect.construct(f, arguments, this.constructor);
			}
			return f.apply(this, arguments);
		};
		a.prototype = f.prototype;
  } else a = {};
  Object.defineProperty(a, '__esModule', {value: true});
	Object.keys(n).forEach(function (k) {
		var d = Object.getOwnPropertyDescriptor(n, k);
		Object.defineProperty(a, k, d.get ? d : {
			enumerable: true,
			get: function () {
				return n[k];
			}
		});
	});
	return a;
}
`;
function getHelpersModule() {
	return HELPERS;
}
function getUnknownRequireProxy(id, requireReturnsDefault) {
	if (requireReturnsDefault === true || id.endsWith(".json")) return `export { default } from ${JSON.stringify(id)};`;
	const name = getName(id);
	const exported = requireReturnsDefault === "auto" ? `import { getDefaultExportFromNamespaceIfNotNamed } from "${HELPERS_ID}"; export default /*@__PURE__*/getDefaultExportFromNamespaceIfNotNamed(${name});` : requireReturnsDefault === "preferred" ? `import { getDefaultExportFromNamespaceIfPresent } from "${HELPERS_ID}"; export default /*@__PURE__*/getDefaultExportFromNamespaceIfPresent(${name});` : !requireReturnsDefault ? `import { getAugmentedNamespace } from "${HELPERS_ID}"; export default /*@__PURE__*/getAugmentedNamespace(${name});` : `export default ${name};`;
	return `import * as ${name} from ${JSON.stringify(id)}; ${exported}`;
}
async function getStaticRequireProxy(id, requireReturnsDefault, loadModule) {
	const name = getName(id);
	const { meta: { commonjs: commonjsMeta } } = await loadModule({ id });
	if (!commonjsMeta) return getUnknownRequireProxy(id, requireReturnsDefault);
	if (commonjsMeta.isCommonJS) return `export { __moduleExports as default } from ${JSON.stringify(id)};`;
	if (!requireReturnsDefault) return `import { getAugmentedNamespace } from "${HELPERS_ID}"; import * as ${name} from ${JSON.stringify(id)}; export default /*@__PURE__*/getAugmentedNamespace(${name});`;
	if (requireReturnsDefault !== true && (requireReturnsDefault === "namespace" || !commonjsMeta.hasDefaultExport || requireReturnsDefault === "auto" && commonjsMeta.hasNamedExports)) return `import * as ${name} from ${JSON.stringify(id)}; export default ${name};`;
	return `export { default } from ${JSON.stringify(id)};`;
}
function getEntryProxy(id, defaultIsModuleExports, getModuleInfo, shebang) {
	const { meta: { commonjs: commonjsMeta }, hasDefaultExport } = getModuleInfo(id);
	if (!commonjsMeta || commonjsMeta.isCommonJS !== IS_WRAPPED_COMMONJS) {
		const stringifiedId = JSON.stringify(id);
		let code = `export * from ${stringifiedId};`;
		if (hasDefaultExport) code += `export { default } from ${stringifiedId};`;
		return shebang + code;
	}
	const result = getEsImportProxy(id, defaultIsModuleExports, true);
	return {
		...result,
		code: shebang + result.code
	};
}
function getEsImportProxy(id, defaultIsModuleExports, moduleSideEffects) {
	const name = getName(id);
	const exportsName = `${name}Exports`;
	const requireModule = `require${capitalize(name)}`;
	let code = `import { getDefaultExportFromCjs } from "${HELPERS_ID}";\nimport { __require as ${requireModule} } from ${JSON.stringify(id)};\nvar ${exportsName} = ${moduleSideEffects ? "" : "/*@__PURE__*/ "}${requireModule}();\nexport { ${exportsName} as __moduleExports };`;
	if (defaultIsModuleExports === true) code += `\nexport { ${exportsName} as default };`;
	else if (defaultIsModuleExports === false) code += `\nexport default ${exportsName}.default;`;
	else code += `\nexport default /*@__PURE__*/getDefaultExportFromCjs(${exportsName});`;
	return {
		code,
		syntheticNamedExports: "__moduleExports"
	};
}
function getExternalBuiltinRequireProxy(id) {
	return `import { createRequire } from 'node:module';
const require = createRequire(import.meta.url);
export function __require() { return require(${JSON.stringify(id)}); }`;
}
function getCandidatesForExtension(resolved, extension) {
	return [resolved + extension, `${resolved}${sep$1}index${extension}`];
}
function getCandidates(resolved, extensions) {
	return extensions.reduce((paths, extension) => paths.concat(getCandidatesForExtension(resolved, extension)), [resolved]);
}
function resolveExtensions(importee, importer, extensions) {
	if (importee[0] !== "." || !importer) return void 0;
	const candidates = getCandidates(resolve$1(dirname$1(importer), importee), extensions);
	for (let i = 0; i < candidates.length; i += 1) try {
		if (statSync$1(candidates[i]).isFile()) return { id: candidates[i] };
	} catch (err) {}
}
function getResolveId(extensions, isPossibleCjsId) {
	const currentlyResolving = /* @__PURE__ */ new Map();
	return {
		currentlyResolving,
		async resolveId(importee, importer, resolveOptions) {
			if (resolveOptions.custom?.["node-resolve"]?.isRequire) return null;
			const currentlyResolvingForParent = currentlyResolving.get(importer);
			if (currentlyResolvingForParent && currentlyResolvingForParent.has(importee)) {
				this.warn({
					code: "THIS_RESOLVE_WITHOUT_OPTIONS",
					message: "It appears a plugin has implemented a \"resolveId\" hook that uses \"this.resolve\" without forwarding the third \"options\" parameter of \"resolveId\". This is problematic as it can lead to wrong module resolutions especially for the node-resolve plugin and in certain cases cause early exit errors for the commonjs plugin.\nIn rare cases, this warning can appear if the same file is both imported and required from the same mixed ES/CommonJS module, in which case it can be ignored.",
					url: "https://rollupjs.org/guide/en/#resolveid"
				});
				return null;
			}
			if (isWrappedId(importee, WRAPPED_SUFFIX)) return unwrapId(importee, WRAPPED_SUFFIX);
			if (importee.endsWith(ENTRY_SUFFIX) || isWrappedId(importee, MODULE_SUFFIX) || isWrappedId(importee, EXPORTS_SUFFIX) || isWrappedId(importee, PROXY_SUFFIX) || isWrappedId(importee, ES_IMPORT_SUFFIX) || isWrappedId(importee, EXTERNAL_SUFFIX) || importee.startsWith(HELPERS_ID) || importee === DYNAMIC_MODULES_ID) return importee;
			if (importer) {
				if (importer === DYNAMIC_MODULES_ID || isWrappedId(importer, PROXY_SUFFIX) || isWrappedId(importer, ES_IMPORT_SUFFIX) || importer.endsWith(ENTRY_SUFFIX)) return importee;
				if (isWrappedId(importer, EXTERNAL_SUFFIX)) {
					if (!await this.resolve(importee, importer, Object.assign({ skipSelf: true }, resolveOptions))) return null;
					return {
						id: importee,
						external: true
					};
				}
			}
			if (importee.startsWith("\0")) return null;
			const resolved = await this.resolve(importee, importer, Object.assign({ skipSelf: true }, resolveOptions)) || resolveExtensions(importee, importer, extensions);
			if (!resolved || resolved.external || resolved.id.endsWith(ENTRY_SUFFIX) || isWrappedId(resolved.id, ES_IMPORT_SUFFIX) || !isPossibleCjsId(resolved.id)) return resolved;
			const moduleInfo = await this.load(resolved);
			const { meta: { commonjs: commonjsMeta } } = moduleInfo;
			if (commonjsMeta) {
				const { isCommonJS } = commonjsMeta;
				if (isCommonJS) {
					if (resolveOptions.isEntry) {
						moduleInfo.moduleSideEffects = true;
						return resolved.id + ENTRY_SUFFIX;
					}
					if (isCommonJS === IS_WRAPPED_COMMONJS) return {
						id: wrapId(resolved.id, ES_IMPORT_SUFFIX),
						meta: { commonjs: { resolved } }
					};
				}
			}
			return resolved;
		}
	};
}
function getRequireResolver(extensions, detectCyclesAndConditional, currentlyResolving, requireNodeBuiltins) {
	const knownCjsModuleTypes = Object.create(null);
	const requiredIds = Object.create(null);
	const unconditionallyRequiredIds = Object.create(null);
	const dependencies = Object.create(null);
	const getDependencies = (id) => dependencies[id] || (dependencies[id] = /* @__PURE__ */ new Set());
	const isCyclic = (id) => {
		const dependenciesToCheck = new Set(getDependencies(id));
		for (const dependency of dependenciesToCheck) {
			if (dependency === id) return true;
			for (const childDependency of getDependencies(dependency)) dependenciesToCheck.add(childDependency);
		}
		return false;
	};
	const fullyAnalyzedModules = Object.create(null);
	const getTypeForFullyAnalyzedModule = (id) => {
		const knownType = knownCjsModuleTypes[id];
		if (knownType !== true || !detectCyclesAndConditional || fullyAnalyzedModules[id]) return knownType;
		if (isCyclic(id)) return knownCjsModuleTypes[id] = IS_WRAPPED_COMMONJS;
		return knownType;
	};
	const setInitialParentType = (id, initialCommonJSType) => {
		if (fullyAnalyzedModules[id]) return;
		knownCjsModuleTypes[id] = initialCommonJSType;
		if (detectCyclesAndConditional && knownCjsModuleTypes[id] === true && requiredIds[id] && !unconditionallyRequiredIds[id]) knownCjsModuleTypes[id] = IS_WRAPPED_COMMONJS;
	};
	const analyzeRequiredModule = async (parentId, resolved, isConditional, loadModule) => {
		const childId = resolved.id;
		requiredIds[childId] = true;
		if (!(isConditional || knownCjsModuleTypes[parentId] === IS_WRAPPED_COMMONJS)) unconditionallyRequiredIds[childId] = true;
		getDependencies(parentId).add(childId);
		if (!isCyclic(childId)) await loadModule(resolved);
	};
	const getTypeForImportedModule = async (resolved, loadModule) => {
		if (resolved.id in knownCjsModuleTypes) return knownCjsModuleTypes[resolved.id];
		const { meta: { commonjs } } = await loadModule(resolved);
		return commonjs && commonjs.isCommonJS || false;
	};
	return {
		getWrappedIds: () => Object.keys(knownCjsModuleTypes).filter((id) => knownCjsModuleTypes[id] === IS_WRAPPED_COMMONJS),
		isRequiredId: (id) => requiredIds[id],
		async shouldTransformCachedModule({ id: parentId, resolvedSources, meta: { commonjs: parentMeta } }) {
			if (!(parentMeta && parentMeta.isCommonJS)) knownCjsModuleTypes[parentId] = false;
			if (isWrappedId(parentId, ES_IMPORT_SUFFIX)) return false;
			const parentRequires = parentMeta && parentMeta.requires;
			if (parentRequires) {
				setInitialParentType(parentId, parentMeta.initialCommonJSType);
				await Promise.all(parentRequires.map(({ resolved, isConditional }) => analyzeRequiredModule(parentId, resolved, isConditional, this.load)));
				if (getTypeForFullyAnalyzedModule(parentId) !== parentMeta.isCommonJS) return true;
				for (const { resolved: { id } } of parentRequires) if (getTypeForFullyAnalyzedModule(id) !== parentMeta.isRequiredCommonJS[id]) return true;
				fullyAnalyzedModules[parentId] = true;
				for (const { resolved: { id } } of parentRequires) fullyAnalyzedModules[id] = true;
			}
			const parentRequireSet = new Set((parentRequires || []).map(({ resolved: { id } }) => id));
			return (await Promise.all(Object.keys(resolvedSources).map((source) => resolvedSources[source]).filter(({ id, external }) => !(external || parentRequireSet.has(id))).map(async (resolved) => {
				if (isWrappedId(resolved.id, ES_IMPORT_SUFFIX)) return await getTypeForImportedModule((await this.load(resolved)).meta.commonjs.resolved, this.load) !== IS_WRAPPED_COMMONJS;
				return await getTypeForImportedModule(resolved, this.load) === IS_WRAPPED_COMMONJS;
			}))).some((shouldTransform) => shouldTransform);
		},
		resolveRequireSourcesAndUpdateMeta: (rollupContext) => async (parentId, isParentCommonJS, parentMeta, sources) => {
			parentMeta.initialCommonJSType = isParentCommonJS;
			parentMeta.requires = [];
			parentMeta.isRequiredCommonJS = Object.create(null);
			setInitialParentType(parentId, isParentCommonJS);
			const currentlyResolvingForParent = currentlyResolving.get(parentId) || /* @__PURE__ */ new Set();
			currentlyResolving.set(parentId, currentlyResolvingForParent);
			const requireTargets = await Promise.all(sources.map(async ({ source, isConditional }) => {
				if (source.startsWith("\0")) return {
					id: source,
					allowProxy: false
				};
				currentlyResolvingForParent.add(source);
				const resolved = await rollupContext.resolve(source, parentId, {
					skipSelf: false,
					custom: { "node-resolve": { isRequire: true } }
				}) || resolveExtensions(source, parentId, extensions);
				currentlyResolvingForParent.delete(source);
				if (!resolved) return {
					id: wrapId(source, EXTERNAL_SUFFIX),
					allowProxy: false
				};
				const childId = resolved.id;
				if (resolved.external) return {
					id: wrapId(childId, EXTERNAL_SUFFIX),
					allowProxy: false
				};
				parentMeta.requires.push({
					resolved,
					isConditional
				});
				await analyzeRequiredModule(parentId, resolved, isConditional, rollupContext.load);
				return {
					id: childId,
					allowProxy: true
				};
			}));
			parentMeta.isCommonJS = getTypeForFullyAnalyzedModule(parentId);
			fullyAnalyzedModules[parentId] = true;
			return requireTargets.map(({ id: dependencyId, allowProxy }, index) => {
				let isCommonJS = parentMeta.isRequiredCommonJS[dependencyId] = getTypeForFullyAnalyzedModule(dependencyId);
				const isExternalWrapped = isWrappedId(dependencyId, EXTERNAL_SUFFIX);
				let resolvedDependencyId = dependencyId;
				if (requireNodeBuiltins === true) {
					if (parentMeta.isCommonJS === IS_WRAPPED_COMMONJS && !allowProxy && isExternalWrapped) {
						if (unwrapId(dependencyId, EXTERNAL_SUFFIX).startsWith("node:")) {
							isCommonJS = IS_WRAPPED_COMMONJS;
							parentMeta.isRequiredCommonJS[dependencyId] = isCommonJS;
						}
					} else if (isExternalWrapped && !allowProxy) {
						const actualExternalId = unwrapId(dependencyId, EXTERNAL_SUFFIX);
						if (actualExternalId.startsWith("node:")) resolvedDependencyId = actualExternalId;
					}
				}
				const isWrappedCommonJS = isCommonJS === IS_WRAPPED_COMMONJS;
				fullyAnalyzedModules[dependencyId] = true;
				const moduleInfo = isWrappedCommonJS && !isExternalWrapped ? rollupContext.getModuleInfo(dependencyId) : null;
				return {
					wrappedModuleSideEffects: !isWrappedCommonJS ? false : moduleInfo?.moduleSideEffects ?? true,
					source: sources[index].source,
					id: allowProxy ? wrapId(resolvedDependencyId, isWrappedCommonJS ? WRAPPED_SUFFIX : PROXY_SUFFIX) : resolvedDependencyId,
					isCommonJS
				};
			});
		},
		isCurrentlyResolving(source, parentId) {
			const currentlyResolvingForParent = currentlyResolving.get(parentId);
			return currentlyResolvingForParent && currentlyResolvingForParent.has(source);
		}
	};
}
function validateVersion$1(actualVersion, peerDependencyVersion, name) {
	const versionRegexp = /\^(\d+\.\d+\.\d+)/g;
	let minMajor = Infinity;
	let minMinor = Infinity;
	let minPatch = Infinity;
	let foundVersion;
	while (foundVersion = versionRegexp.exec(peerDependencyVersion)) {
		const [foundMajor, foundMinor, foundPatch] = foundVersion[1].split(".").map(Number);
		if (foundMajor < minMajor) {
			minMajor = foundMajor;
			minMinor = foundMinor;
			minPatch = foundPatch;
		}
	}
	if (!actualVersion) throw new Error(`Insufficient ${name} version: "@rollup/plugin-commonjs" requires at least ${name}@${minMajor}.${minMinor}.${minPatch}.`);
	const [major, minor, patch] = actualVersion.split(".").map(Number);
	if (major < minMajor || major === minMajor && (minor < minMinor || minor === minMinor && patch < minPatch)) throw new Error(`Insufficient ${name} version: "@rollup/plugin-commonjs" requires at least ${name}@${minMajor}.${minMinor}.${minPatch} but found ${name}@${actualVersion}.`);
}
const operators = {
	"==": (x) => equals(x.left, x.right, false),
	"!=": (x) => not(operators["=="](x)),
	"===": (x) => equals(x.left, x.right, true),
	"!==": (x) => not(operators["==="](x)),
	"!": (x) => isFalsy(x.argument),
	"&&": (x) => isTruthy(x.left) && isTruthy(x.right),
	"||": (x) => isTruthy(x.left) || isTruthy(x.right)
};
function not(value) {
	return value === null ? value : !value;
}
function equals(a, b, strict) {
	if (a.type !== b.type) return null;
	if (a.type === "Literal") return strict ? a.value === b.value : a.value == b.value;
	return null;
}
function isTruthy(node) {
	if (!node) return false;
	if (node.type === "Literal") return !!node.value;
	if (node.type === "ParenthesizedExpression") return isTruthy(node.expression);
	if (node.operator in operators) return operators[node.operator](node);
	return null;
}
function isFalsy(node) {
	return not(isTruthy(node));
}
function getKeypath(node) {
	const parts = [];
	while (node.type === "MemberExpression") {
		if (node.computed) return null;
		parts.unshift(node.property.name);
		node = node.object;
	}
	if (node.type !== "Identifier") return null;
	const { name } = node;
	parts.unshift(name);
	return {
		name,
		keypath: parts.join(".")
	};
}
const KEY_COMPILED_ESM = "__esModule";
function getDefineCompiledEsmType(node) {
	const definedPropertyWithExports = getDefinePropertyCallName(node, "exports");
	const definedProperty = definedPropertyWithExports || getDefinePropertyCallName(node, "module.exports");
	if (definedProperty && definedProperty.key === KEY_COMPILED_ESM) return isTruthy(definedProperty.value) ? definedPropertyWithExports ? "exports" : "module" : false;
	return false;
}
function getDefinePropertyCallName(node, targetName) {
	const { callee: { object, property } } = node;
	if (!object || object.type !== "Identifier" || object.name !== "Object") return;
	if (!property || property.type !== "Identifier" || property.name !== "defineProperty") return;
	if (node.arguments.length !== 3) return;
	const targetNames = targetName.split(".");
	const [target, key, value] = node.arguments;
	if (targetNames.length === 1) {
		if (target.type !== "Identifier" || target.name !== targetNames[0]) return;
	}
	if (targetNames.length === 2) {
		if (target.type !== "MemberExpression" || target.object.name !== targetNames[0] || target.property.name !== targetNames[1]) return;
	}
	if (value.type !== "ObjectExpression" || !value.properties) return;
	const valueProperty = value.properties.find((p) => p.key && p.key.name === "value");
	if (!valueProperty || !valueProperty.value) return;
	return {
		key: key.value,
		value: valueProperty.value
	};
}
function isShorthandProperty(parent) {
	return parent && parent.type === "Property" && parent.shorthand;
}
function wrapCode(magicString, uses, moduleName, exportsName, indentExclusionRanges) {
	const args = [];
	const passedArgs = [];
	if (uses.module) {
		args.push("module");
		passedArgs.push(moduleName);
	}
	if (uses.exports) {
		args.push("exports");
		passedArgs.push(uses.module ? `${moduleName}.exports` : exportsName);
	}
	magicString.trim().indent("	", { exclude: indentExclusionRanges }).prepend(`(function (${args.join(", ")}) {\n`).append(` \n} (${passedArgs.join(", ")}));`);
}
function rewriteExportsAndGetExportsBlock(magicString, moduleName, exportsName, exportedExportsName, wrapped, moduleExportsAssignments, firstTopLevelModuleExportsAssignment, exportsAssignmentsByName, topLevelAssignments, defineCompiledEsmExpressions, deconflictedExportNames, code, HELPERS_NAME, exportMode, defaultIsModuleExports, usesRequireWrapper, requireName) {
	const exports = [];
	const exportDeclarations = [];
	if (usesRequireWrapper) getExportsWhenUsingRequireWrapper(magicString, wrapped, exportMode, exports, moduleExportsAssignments, exportsAssignmentsByName, moduleName, exportsName, requireName, defineCompiledEsmExpressions);
	else if (exportMode === "replace") getExportsForReplacedModuleExports(magicString, exports, exportDeclarations, moduleExportsAssignments, firstTopLevelModuleExportsAssignment, exportsName, defaultIsModuleExports, HELPERS_NAME);
	else {
		if (exportMode === "module") {
			exportDeclarations.push(`var ${exportedExportsName} = ${moduleName}.exports`);
			exports.push(`${exportedExportsName} as __moduleExports`);
		} else exports.push(`${exportsName} as __moduleExports`);
		if (wrapped) exportDeclarations.push(getDefaultExportDeclaration(exportedExportsName, defaultIsModuleExports, HELPERS_NAME));
		else getExports(magicString, exports, exportDeclarations, moduleExportsAssignments, exportsAssignmentsByName, deconflictedExportNames, topLevelAssignments, moduleName, exportsName, exportedExportsName, defineCompiledEsmExpressions, HELPERS_NAME, defaultIsModuleExports, exportMode);
	}
	if (exports.length) exportDeclarations.push(`export { ${exports.join(", ")} }`);
	return `\n\n${exportDeclarations.join(";\n")};`;
}
function getExportsWhenUsingRequireWrapper(magicString, wrapped, exportMode, exports, moduleExportsAssignments, exportsAssignmentsByName, moduleName, exportsName, requireName, defineCompiledEsmExpressions) {
	exports.push(`${requireName} as __require`);
	if (wrapped) return;
	if (exportMode === "replace") rewriteModuleExportsAssignments(magicString, moduleExportsAssignments, exportsName);
	else {
		rewriteModuleExportsAssignments(magicString, moduleExportsAssignments, `${moduleName}.exports`);
		for (const [exportName, { nodes }] of exportsAssignmentsByName) for (const { node, type } of nodes) magicString.overwrite(node.start, node.left.end, `${exportMode === "module" && type === "module" ? `${moduleName}.exports` : exportsName}.${exportName}`);
		replaceDefineCompiledEsmExpressionsAndGetIfRestorable(defineCompiledEsmExpressions, magicString, exportMode, moduleName, exportsName);
	}
}
function getExportsForReplacedModuleExports(magicString, exports, exportDeclarations, moduleExportsAssignments, firstTopLevelModuleExportsAssignment, exportsName, defaultIsModuleExports, HELPERS_NAME) {
	for (const { left } of moduleExportsAssignments) magicString.overwrite(left.start, left.end, exportsName);
	magicString.prependRight(firstTopLevelModuleExportsAssignment.left.start, "var ");
	exports.push(`${exportsName} as __moduleExports`);
	exportDeclarations.push(getDefaultExportDeclaration(exportsName, defaultIsModuleExports, HELPERS_NAME));
}
function getDefaultExportDeclaration(exportedExportsName, defaultIsModuleExports, HELPERS_NAME) {
	return `export default ${defaultIsModuleExports === true ? exportedExportsName : defaultIsModuleExports === false ? `${exportedExportsName}.default` : `/*@__PURE__*/${HELPERS_NAME}.getDefaultExportFromCjs(${exportedExportsName})`}`;
}
function getExports(magicString, exports, exportDeclarations, moduleExportsAssignments, exportsAssignmentsByName, deconflictedExportNames, topLevelAssignments, moduleName, exportsName, exportedExportsName, defineCompiledEsmExpressions, HELPERS_NAME, defaultIsModuleExports, exportMode) {
	let deconflictedDefaultExportName;
	for (const { left } of moduleExportsAssignments) magicString.overwrite(left.start, left.end, `${moduleName}.exports`);
	for (const [exportName, { nodes }] of exportsAssignmentsByName) {
		const deconflicted = deconflictedExportNames[exportName];
		let needsDeclaration = true;
		for (const { node, type } of nodes) {
			let replacement = `${deconflicted} = ${exportMode === "module" && type === "module" ? `${moduleName}.exports` : exportsName}.${exportName}`;
			if (needsDeclaration && topLevelAssignments.has(node)) {
				replacement = `var ${replacement}`;
				needsDeclaration = false;
			}
			magicString.overwrite(node.start, node.left.end, replacement);
		}
		if (needsDeclaration) magicString.prepend(`var ${deconflicted};\n`);
		if (exportName === "default") deconflictedDefaultExportName = deconflicted;
		else exports.push(exportName === deconflicted ? exportName : `${deconflicted} as ${exportName}`);
	}
	const isRestorableCompiledEsm = replaceDefineCompiledEsmExpressionsAndGetIfRestorable(defineCompiledEsmExpressions, magicString, exportMode, moduleName, exportsName);
	if (defaultIsModuleExports === false || defaultIsModuleExports === "auto" && isRestorableCompiledEsm && moduleExportsAssignments.length === 0) exports.push(`${deconflictedDefaultExportName || exportedExportsName} as default`);
	else if (defaultIsModuleExports === true || !isRestorableCompiledEsm && moduleExportsAssignments.length === 0) exports.push(`${exportedExportsName} as default`);
	else exportDeclarations.push(getDefaultExportDeclaration(exportedExportsName, defaultIsModuleExports, HELPERS_NAME));
}
function rewriteModuleExportsAssignments(magicString, moduleExportsAssignments, exportsName) {
	for (const { left } of moduleExportsAssignments) magicString.overwrite(left.start, left.end, exportsName);
}
function replaceDefineCompiledEsmExpressionsAndGetIfRestorable(defineCompiledEsmExpressions, magicString, exportMode, moduleName, exportsName) {
	let isRestorableCompiledEsm = false;
	for (const { node, type } of defineCompiledEsmExpressions) {
		isRestorableCompiledEsm = true;
		const moduleExportsExpression = node.type === "CallExpression" ? node.arguments[0] : node.left.object;
		magicString.overwrite(moduleExportsExpression.start, moduleExportsExpression.end, exportMode === "module" && type === "module" ? `${moduleName}.exports` : exportsName);
	}
	return isRestorableCompiledEsm;
}
function isRequireExpression(node, scope) {
	if (!node) return false;
	if (node.type !== "CallExpression") return false;
	if (node.arguments.length === 0) return false;
	return isRequire(node.callee, scope);
}
function isRequire(node, scope) {
	return node.type === "Identifier" && node.name === "require" && !scope.contains("require") || node.type === "MemberExpression" && isModuleRequire(node, scope);
}
function isModuleRequire({ object, property }, scope) {
	return object.type === "Identifier" && object.name === "module" && property.type === "Identifier" && property.name === "require" && !scope.contains("module");
}
function hasDynamicArguments(node) {
	return node.arguments.length > 1 || node.arguments[0].type !== "Literal" && (node.arguments[0].type !== "TemplateLiteral" || node.arguments[0].expressions.length > 0);
}
const reservedMethod = {
	resolve: true,
	cache: true,
	main: true
};
function isNodeRequirePropertyAccess(parent) {
	return parent && parent.property && reservedMethod[parent.property.name];
}
function getRequireStringArg(node) {
	return node.arguments[0].type === "Literal" ? node.arguments[0].value : node.arguments[0].quasis[0].value.cooked;
}
function getRequireHandlers() {
	const requireExpressions = [];
	function addRequireExpression(sourceId, node, scope, usesReturnValue, isInsideTryBlock, isInsideConditional, toBeRemoved) {
		requireExpressions.push({
			sourceId,
			node,
			scope,
			usesReturnValue,
			isInsideTryBlock,
			isInsideConditional,
			toBeRemoved
		});
	}
	async function rewriteRequireExpressionsAndGetImportBlock(magicString, topLevelDeclarations, reassignedNames, helpersName, dynamicRequireName, moduleName, exportsName, id, exportMode, resolveRequireSourcesAndUpdateMeta, needsRequireWrapper, isEsModule, isDynamicRequireModulesEnabled, getIgnoreTryCatchRequireStatementMode, commonjsMeta) {
		const imports = [];
		imports.push(`import * as ${helpersName} from "${HELPERS_ID}"`);
		if (dynamicRequireName) imports.push(`import { ${isDynamicRequireModulesEnabled ? CREATE_COMMONJS_REQUIRE_EXPORT : COMMONJS_REQUIRE_EXPORT} as ${dynamicRequireName} } from "${DYNAMIC_MODULES_ID}"`);
		if (exportMode === "module") imports.push(`import { __module as ${moduleName} } from ${JSON.stringify(wrapId(id, MODULE_SUFFIX))}`, `var ${exportsName} = ${moduleName}.exports`);
		else if (exportMode === "exports") imports.push(`import { __exports as ${exportsName} } from ${JSON.stringify(wrapId(id, EXPORTS_SUFFIX))}`);
		const requiresBySource = collectSources(requireExpressions);
		processRequireExpressions(imports, await resolveRequireSourcesAndUpdateMeta(id, needsRequireWrapper ? IS_WRAPPED_COMMONJS : !isEsModule, commonjsMeta, Object.keys(requiresBySource).map((source) => {
			return {
				source,
				isConditional: requiresBySource[source].every((require) => require.isInsideConditional)
			};
		})), requiresBySource, getIgnoreTryCatchRequireStatementMode, magicString);
		return imports.length ? `${imports.join(";\n")};\n\n` : "";
	}
	return {
		addRequireExpression,
		rewriteRequireExpressionsAndGetImportBlock
	};
}
function collectSources(requireExpressions) {
	const requiresBySource = Object.create(null);
	for (const requireExpression of requireExpressions) {
		const { sourceId } = requireExpression;
		if (!requiresBySource[sourceId]) requiresBySource[sourceId] = [];
		requiresBySource[sourceId].push(requireExpression);
	}
	return requiresBySource;
}
function processRequireExpressions(imports, requireTargets, requiresBySource, getIgnoreTryCatchRequireStatementMode, magicString) {
	const generateRequireName = getGenerateRequireName();
	for (const { source, id: resolvedId, isCommonJS, wrappedModuleSideEffects } of requireTargets) {
		const requires = requiresBySource[source];
		const name = generateRequireName(requires);
		let usesRequired = false;
		let needsImport = false;
		for (const { node, usesReturnValue, toBeRemoved, isInsideTryBlock } of requires) {
			const { canConvertRequire, shouldRemoveRequire } = isInsideTryBlock && isWrappedId(resolvedId, EXTERNAL_SUFFIX) ? getIgnoreTryCatchRequireStatementMode(source) : {
				canConvertRequire: true,
				shouldRemoveRequire: false
			};
			if (shouldRemoveRequire) if (usesReturnValue) magicString.overwrite(node.start, node.end, "undefined");
			else magicString.remove(toBeRemoved.start, toBeRemoved.end);
			else if (canConvertRequire) {
				needsImport = true;
				if (isCommonJS === IS_WRAPPED_COMMONJS) magicString.overwrite(node.start, node.end, `${wrappedModuleSideEffects ? "" : "/*@__PURE__*/ "}${name}()`);
				else if (usesReturnValue) {
					usesRequired = true;
					magicString.overwrite(node.start, node.end, name);
				} else magicString.remove(toBeRemoved.start, toBeRemoved.end);
			}
		}
		if (needsImport) if (isCommonJS === IS_WRAPPED_COMMONJS) imports.push(`import { __require as ${name} } from ${JSON.stringify(resolvedId)}`);
		else imports.push(`import ${usesRequired ? `${name} from ` : ""}${JSON.stringify(resolvedId)}`);
	}
}
function getGenerateRequireName() {
	let uid = 0;
	return (requires) => {
		let name;
		const hasNameConflict = ({ scope }) => scope.contains(name);
		do {
			name = `require$$${uid}`;
			uid += 1;
		} while (requires.some(hasNameConflict));
		return name;
	};
}
const exportsPattern = /^(?:module\.)?exports(?:\.([a-zA-Z_$][a-zA-Z_$0-9]*))?$/;
const functionType = /^(?:FunctionDeclaration|FunctionExpression|ArrowFunctionExpression)$/;
async function transformCommonjs(parse, code, id, isEsModule, ignoreGlobal, ignoreRequire, ignoreDynamicRequires, getIgnoreTryCatchRequireStatementMode, sourceMap, isDynamicRequireModulesEnabled, dynamicRequireModules, commonDir, astCache, defaultIsModuleExports, needsRequireWrapper, resolveRequireSourcesAndUpdateMeta, isRequired, checkDynamicRequire, commonjsMeta) {
	const ast = astCache || tryParse(parse, code, id);
	const magicString = new MagicString(code);
	const uses = {
		module: false,
		exports: false,
		global: false,
		require: false
	};
	const virtualDynamicRequirePath = isDynamicRequireModulesEnabled && getVirtualPathForDynamicRequirePath(dirname$1(id), commonDir);
	let scope = attachScopes(ast, "scope");
	let lexicalDepth = 0;
	let programDepth = 0;
	let classBodyDepth = 0;
	let currentTryBlockEnd = null;
	let shouldWrap = false;
	const globals = /* @__PURE__ */ new Set();
	let currentConditionalNodeEnd = null;
	const conditionalNodes = /* @__PURE__ */ new Set();
	const { addRequireExpression, rewriteRequireExpressionsAndGetImportBlock } = getRequireHandlers();
	const reassignedNames = /* @__PURE__ */ new Set();
	const topLevelDeclarations = [];
	const skippedNodes = /* @__PURE__ */ new Set();
	const moduleAccessScopes = new Set([scope]);
	const exportsAccessScopes = new Set([scope]);
	const moduleExportsAssignments = [];
	let firstTopLevelModuleExportsAssignment = null;
	const exportsAssignmentsByName = /* @__PURE__ */ new Map();
	const topLevelAssignments = /* @__PURE__ */ new Set();
	const topLevelDefineCompiledEsmExpressions = [];
	const replacedGlobal = [];
	const replacedThis = [];
	const replacedDynamicRequires = [];
	const importedVariables = /* @__PURE__ */ new Set();
	const indentExclusionRanges = [];
	walk$1(ast, {
		enter(node, parent) {
			if (skippedNodes.has(node)) {
				this.skip();
				return;
			}
			if (currentTryBlockEnd !== null && node.start > currentTryBlockEnd) currentTryBlockEnd = null;
			if (currentConditionalNodeEnd !== null && node.start > currentConditionalNodeEnd) currentConditionalNodeEnd = null;
			if (currentConditionalNodeEnd === null && conditionalNodes.has(node)) currentConditionalNodeEnd = node.end;
			programDepth += 1;
			if (node.scope) ({scope} = node);
			if (functionType.test(node.type)) lexicalDepth += 1;
			if (sourceMap) {
				magicString.addSourcemapLocation(node.start);
				magicString.addSourcemapLocation(node.end);
			}
			switch (node.type) {
				case "AssignmentExpression":
					if (node.left.type === "MemberExpression") {
						const flattened = getKeypath(node.left);
						if (!flattened || scope.contains(flattened.name)) return;
						const exportsPatternMatch = exportsPattern.exec(flattened.keypath);
						if (!exportsPatternMatch || flattened.keypath === "exports") return;
						const [, exportName] = exportsPatternMatch;
						uses[flattened.name] = true;
						if (flattened.keypath === "module.exports") {
							moduleExportsAssignments.push(node);
							if (programDepth > 3) moduleAccessScopes.add(scope);
							else if (!firstTopLevelModuleExportsAssignment) firstTopLevelModuleExportsAssignment = node;
						} else if (exportName === KEY_COMPILED_ESM) if (programDepth > 3) shouldWrap = true;
						else topLevelDefineCompiledEsmExpressions.push({
							node,
							type: flattened.name
						});
						else {
							const exportsAssignments = exportsAssignmentsByName.get(exportName) || {
								nodes: [],
								scopes: /* @__PURE__ */ new Set()
							};
							exportsAssignments.nodes.push({
								node,
								type: flattened.name
							});
							exportsAssignments.scopes.add(scope);
							exportsAccessScopes.add(scope);
							exportsAssignmentsByName.set(exportName, exportsAssignments);
							if (programDepth <= 3) topLevelAssignments.add(node);
						}
						skippedNodes.add(node.left);
					} else for (const name of extractAssignedNames(node.left)) reassignedNames.add(name);
					return;
				case "CallExpression": {
					const defineCompiledEsmType = getDefineCompiledEsmType(node);
					if (defineCompiledEsmType) {
						if (programDepth === 3 && parent.type === "ExpressionStatement") {
							skippedNodes.add(node.arguments[0]);
							topLevelDefineCompiledEsmExpressions.push({
								node,
								type: defineCompiledEsmType
							});
						} else shouldWrap = true;
						return;
					}
					if (isDynamicRequireModulesEnabled && node.callee.object && isRequire(node.callee.object, scope) && node.callee.property.name === "resolve") {
						checkDynamicRequire(node.start);
						uses.require = true;
						const requireNode = node.callee.object;
						replacedDynamicRequires.push(requireNode);
						skippedNodes.add(node.callee);
						return;
					}
					if (!isRequireExpression(node, scope)) {
						const keypath = getKeypath(node.callee);
						if (keypath && importedVariables.has(keypath.name)) currentConditionalNodeEnd = Infinity;
						return;
					}
					skippedNodes.add(node.callee);
					uses.require = true;
					if (hasDynamicArguments(node)) {
						if (isDynamicRequireModulesEnabled) checkDynamicRequire(node.start);
						if (!ignoreDynamicRequires) replacedDynamicRequires.push(node.callee);
						return;
					}
					const requireStringArg = getRequireStringArg(node);
					if (!ignoreRequire(requireStringArg)) {
						const usesReturnValue = parent.type !== "ExpressionStatement";
						const toBeRemoved = parent.type === "ExpressionStatement" && (!currentConditionalNodeEnd || currentTryBlockEnd !== null && currentTryBlockEnd < currentConditionalNodeEnd) ? parent : node;
						addRequireExpression(requireStringArg, node, scope, usesReturnValue, currentTryBlockEnd !== null, currentConditionalNodeEnd !== null, toBeRemoved);
						if (parent.type === "VariableDeclarator" && parent.id.type === "Identifier") for (const name of extractAssignedNames(parent.id)) importedVariables.add(name);
					}
					return;
				}
				case "ClassBody":
					classBodyDepth += 1;
					return;
				case "ConditionalExpression":
				case "IfStatement":
					if (isFalsy(node.test)) skippedNodes.add(node.consequent);
					else if (isTruthy(node.test)) {
						if (node.alternate) skippedNodes.add(node.alternate);
					} else {
						conditionalNodes.add(node.consequent);
						if (node.alternate) conditionalNodes.add(node.alternate);
					}
					return;
				case "ArrowFunctionExpression":
				case "FunctionDeclaration":
				case "FunctionExpression":
					if (currentConditionalNodeEnd === null && !(parent.type === "CallExpression" && parent.callee === node)) currentConditionalNodeEnd = node.end;
					return;
				case "Identifier": {
					const { name } = node;
					if (!isReference(node, parent) || scope.contains(name) || parent.type === "PropertyDefinition" && parent.key === node) return;
					switch (name) {
						case "require":
							uses.require = true;
							if (isNodeRequirePropertyAccess(parent)) return;
							if (!ignoreDynamicRequires) {
								if (isShorthandProperty(parent)) {
									skippedNodes.add(parent.value);
									magicString.prependRight(node.start, "require: ");
								}
								replacedDynamicRequires.push(node);
							}
							return;
						case "module":
						case "exports":
							shouldWrap = true;
							uses[name] = true;
							return;
						case "global":
							uses.global = true;
							if (!ignoreGlobal) replacedGlobal.push(node);
							return;
						case "define":
							magicString.overwrite(node.start, node.end, "undefined", { storeName: true });
							return;
						default:
							globals.add(name);
							return;
					}
				}
				case "LogicalExpression":
					if (node.operator === "&&") {
						if (isFalsy(node.left)) skippedNodes.add(node.right);
						else if (!isTruthy(node.left)) conditionalNodes.add(node.right);
					} else if (node.operator === "||") {
						if (isTruthy(node.left)) skippedNodes.add(node.right);
						else if (!isFalsy(node.left)) conditionalNodes.add(node.right);
					}
					return;
				case "MemberExpression":
					if (!isDynamicRequireModulesEnabled && isModuleRequire(node, scope)) {
						uses.require = true;
						replacedDynamicRequires.push(node);
						skippedNodes.add(node.object);
						skippedNodes.add(node.property);
					}
					return;
				case "ReturnStatement":
					if (lexicalDepth === 0) shouldWrap = true;
					return;
				case "ThisExpression":
					if (lexicalDepth === 0 && !classBodyDepth) {
						uses.global = true;
						if (!ignoreGlobal) replacedThis.push(node);
					}
					return;
				case "TryStatement":
					if (currentTryBlockEnd === null) currentTryBlockEnd = node.block.end;
					if (currentConditionalNodeEnd === null) currentConditionalNodeEnd = node.end;
					return;
				case "UnaryExpression":
					if (node.operator === "typeof") {
						const flattened = getKeypath(node.argument);
						if (!flattened) return;
						if (scope.contains(flattened.name)) return;
						if (!isEsModule && (flattened.keypath === "module.exports" || flattened.keypath === "module" || flattened.keypath === "exports")) magicString.overwrite(node.start, node.end, `'object'`, { storeName: false });
					}
					return;
				case "VariableDeclaration":
					if (!scope.parent) topLevelDeclarations.push(node);
					return;
				case "TemplateElement": if (node.value.raw.includes("\n")) indentExclusionRanges.push([node.start, node.end]);
			}
		},
		leave(node) {
			programDepth -= 1;
			if (node.scope) scope = scope.parent;
			if (functionType.test(node.type)) lexicalDepth -= 1;
			if (node.type === "ClassBody") classBodyDepth -= 1;
		}
	});
	const nameBase = getName(id);
	const exportsName = deconflict([...exportsAccessScopes], globals, nameBase);
	const moduleName = deconflict([...moduleAccessScopes], globals, `${nameBase}Module`);
	const requireName = deconflict([scope], globals, `require${capitalize(nameBase)}`);
	const isRequiredName = deconflict([scope], globals, `hasRequired${capitalize(nameBase)}`);
	const helpersName = deconflict([scope], globals, "commonjsHelpers");
	const dynamicRequireName = replacedDynamicRequires.length > 0 && deconflict([scope], globals, isDynamicRequireModulesEnabled ? CREATE_COMMONJS_REQUIRE_EXPORT : COMMONJS_REQUIRE_EXPORT);
	const deconflictedExportNames = Object.create(null);
	for (const [exportName, { scopes }] of exportsAssignmentsByName) deconflictedExportNames[exportName] = deconflict([...scopes], globals, exportName);
	for (const node of replacedGlobal) magicString.overwrite(node.start, node.end, `${helpersName}.commonjsGlobal`, { storeName: true });
	for (const node of replacedThis) magicString.overwrite(node.start, node.end, exportsName, { storeName: true });
	for (const node of replacedDynamicRequires) magicString.overwrite(node.start, node.end, isDynamicRequireModulesEnabled ? `${dynamicRequireName}(${JSON.stringify(virtualDynamicRequirePath)})` : dynamicRequireName, {
		contentOnly: true,
		storeName: true
	});
	shouldWrap = !isEsModule && (shouldWrap || uses.exports && moduleExportsAssignments.length > 0);
	if (!(shouldWrap || isRequired || needsRequireWrapper || uses.module || uses.exports || uses.require || topLevelDefineCompiledEsmExpressions.length > 0) && (ignoreGlobal || !uses.global)) return { meta: { commonjs: { isCommonJS: false } } };
	let leadingComment = "";
	if (code.startsWith("/*")) {
		const commentEnd = code.indexOf("*/", 2) + 2;
		leadingComment = `${code.slice(0, commentEnd)}\n`;
		magicString.remove(0, commentEnd).trim();
	}
	let shebang = "";
	if (code.startsWith("#!")) {
		const shebangEndPosition = code.indexOf("\n") + 1;
		shebang = code.slice(0, shebangEndPosition);
		magicString.remove(0, shebangEndPosition).trim();
	}
	const exportMode = isEsModule ? "none" : shouldWrap ? uses.module ? "module" : "exports" : firstTopLevelModuleExportsAssignment ? exportsAssignmentsByName.size === 0 && topLevelDefineCompiledEsmExpressions.length === 0 ? "replace" : "module" : moduleExportsAssignments.length === 0 ? "exports" : "module";
	const exportedExportsName = exportMode === "module" ? deconflict([], globals, `${nameBase}Exports`) : exportsName;
	const importBlock = await rewriteRequireExpressionsAndGetImportBlock(magicString, topLevelDeclarations, reassignedNames, helpersName, dynamicRequireName, moduleName, exportsName, id, exportMode, resolveRequireSourcesAndUpdateMeta, needsRequireWrapper, isEsModule, isDynamicRequireModulesEnabled, getIgnoreTryCatchRequireStatementMode, commonjsMeta);
	const usesRequireWrapper = commonjsMeta.isCommonJS === IS_WRAPPED_COMMONJS;
	const exportBlock = isEsModule ? "" : rewriteExportsAndGetExportsBlock(magicString, moduleName, exportsName, exportedExportsName, shouldWrap, moduleExportsAssignments, firstTopLevelModuleExportsAssignment, exportsAssignmentsByName, topLevelAssignments, topLevelDefineCompiledEsmExpressions, deconflictedExportNames, code, helpersName, exportMode, defaultIsModuleExports, usesRequireWrapper, requireName);
	if (shouldWrap) wrapCode(magicString, uses, moduleName, exportsName, indentExclusionRanges);
	if (usesRequireWrapper) {
		magicString.trim().indent("	", { exclude: indentExclusionRanges });
		const exported = exportMode === "module" ? `${moduleName}.exports` : exportsName;
		magicString.prepend(`var ${isRequiredName};

function ${requireName} () {
\tif (${isRequiredName}) return ${exported};
\t${isRequiredName} = 1;
`).append(`
\treturn ${exported};
}`);
		if (exportMode === "replace") magicString.prepend(`var ${exportsName};\n`);
	}
	magicString.trim().prepend(shebang + leadingComment + importBlock).append(exportBlock);
	return {
		code: magicString.toString(),
		map: sourceMap ? magicString.generateMap() : null,
		syntheticNamedExports: isEsModule || usesRequireWrapper ? false : "__moduleExports",
		meta: { commonjs: {
			...commonjsMeta,
			shebang
		} }
	};
}
const PLUGIN_NAME = "commonjs";
function commonjs(options = {}) {
	const { ignoreGlobal, ignoreDynamicRequires, requireReturnsDefault: requireReturnsDefaultOption, defaultIsModuleExports: defaultIsModuleExportsOption, esmExternals, requireNodeBuiltins = false } = options;
	const extensions = options.extensions || [".js"];
	const filter = createFilter$2(options.include, options.exclude);
	const isPossibleCjsId = (id) => {
		const extName = extname$1(id);
		return extName === ".cjs" || extensions.includes(extName) && filter(id);
	};
	const { strictRequiresFilter, detectCyclesAndConditional } = getStrictRequiresFilter(options);
	const getRequireReturnsDefault = typeof requireReturnsDefaultOption === "function" ? requireReturnsDefaultOption : () => requireReturnsDefaultOption;
	let esmExternalIds;
	const isEsmExternal = typeof esmExternals === "function" ? esmExternals : Array.isArray(esmExternals) ? (esmExternalIds = new Set(esmExternals), (id) => esmExternalIds.has(id)) : () => esmExternals;
	const getDefaultIsModuleExports = typeof defaultIsModuleExportsOption === "function" ? defaultIsModuleExportsOption : () => typeof defaultIsModuleExportsOption === "boolean" ? defaultIsModuleExportsOption : "auto";
	const dynamicRequireRoot = typeof options.dynamicRequireRoot === "string" ? resolve$1(options.dynamicRequireRoot) : process.cwd();
	const { commonDir, dynamicRequireModules } = getDynamicRequireModules(options.dynamicRequireTargets, dynamicRequireRoot);
	const isDynamicRequireModulesEnabled = dynamicRequireModules.size > 0;
	const ignoreRequire = typeof options.ignore === "function" ? options.ignore : Array.isArray(options.ignore) ? (id) => options.ignore.includes(id) : () => false;
	const getIgnoreTryCatchRequireStatementMode = (id) => {
		const mode = typeof options.ignoreTryCatch === "function" ? options.ignoreTryCatch(id) : Array.isArray(options.ignoreTryCatch) ? options.ignoreTryCatch.includes(id) : typeof options.ignoreTryCatch !== "undefined" ? options.ignoreTryCatch : true;
		return {
			canConvertRequire: mode !== "remove" && mode !== true,
			shouldRemoveRequire: mode === "remove"
		};
	};
	const { currentlyResolving, resolveId } = getResolveId(extensions, isPossibleCjsId);
	const sourceMap = options.sourceMap !== false;
	let requireResolver;
	function transformAndCheckExports(code, id) {
		const normalizedId = normalizePathSlashes(id);
		const { isEsModule, hasDefaultExport, hasNamedExports, ast } = analyzeTopLevelStatements(this.parse, code, id);
		const commonjsMeta = this.getModuleInfo(id).meta.commonjs || {};
		if (hasDefaultExport) commonjsMeta.hasDefaultExport = true;
		if (hasNamedExports) commonjsMeta.hasNamedExports = true;
		if (!dynamicRequireModules.has(normalizedId) && (!(hasCjsKeywords(code, ignoreGlobal) || requireResolver.isRequiredId(id)) || isEsModule && !options.transformMixedEsModules)) {
			commonjsMeta.isCommonJS = false;
			return { meta: { commonjs: commonjsMeta } };
		}
		const needsRequireWrapper = !isEsModule && (dynamicRequireModules.has(normalizedId) || strictRequiresFilter(id));
		const checkDynamicRequire = (position) => {
			const normalizedDynamicRequireRoot = normalizePathSlashes(dynamicRequireRoot);
			if (normalizedId.indexOf(normalizedDynamicRequireRoot) !== 0) this.error({
				code: "DYNAMIC_REQUIRE_OUTSIDE_ROOT",
				normalizedId,
				normalizedDynamicRequireRoot,
				message: `"${normalizedId}" contains dynamic require statements but it is not within the current dynamicRequireRoot "${normalizedDynamicRequireRoot}". You should set dynamicRequireRoot to "${dirname$1(normalizedId)}" or one of its parent directories.`
			}, position);
		};
		return transformCommonjs(this.parse, code, id, isEsModule, ignoreGlobal || isEsModule, ignoreRequire, ignoreDynamicRequires && !isDynamicRequireModulesEnabled, getIgnoreTryCatchRequireStatementMode, sourceMap, isDynamicRequireModulesEnabled, dynamicRequireModules, commonDir, ast, getDefaultIsModuleExports(id), needsRequireWrapper, requireResolver.resolveRequireSourcesAndUpdateMeta(this), requireResolver.isRequiredId(id), checkDynamicRequire, commonjsMeta);
	}
	return {
		name: PLUGIN_NAME,
		version: version$1,
		options(rawOptions) {
			const plugins = Array.isArray(rawOptions.plugins) ? [...rawOptions.plugins] : rawOptions.plugins ? [rawOptions.plugins] : [];
			plugins.unshift({
				name: "commonjs--resolver",
				resolveId
			});
			return {
				...rawOptions,
				plugins
			};
		},
		buildStart({ plugins }) {
			validateVersion$1(this.meta.rollupVersion, peerDependencies$1.rollup, "rollup");
			const nodeResolve = plugins.find(({ name }) => name === "node-resolve");
			if (nodeResolve) validateVersion$1(nodeResolve.version, "^13.0.6", "@rollup/plugin-node-resolve");
			if (options.namedExports != null) this.warn("The namedExports option from \"@rollup/plugin-commonjs\" is deprecated. Named exports are now handled automatically.");
			requireResolver = getRequireResolver(extensions, detectCyclesAndConditional, currentlyResolving, requireNodeBuiltins);
		},
		buildEnd() {
			if (options.strictRequires === "debug") {
				const wrappedIds = requireResolver.getWrappedIds();
				if (wrappedIds.length) this.warn({
					code: "WRAPPED_IDS",
					ids: wrappedIds,
					message: `The commonjs plugin automatically wrapped the following files:\n[\n${wrappedIds.map((id) => `\t${JSON.stringify(relative$1(process.cwd(), id))}`).join(",\n")}\n]`
				});
				else this.warn({
					code: "WRAPPED_IDS",
					ids: wrappedIds,
					message: "The commonjs plugin did not wrap any files."
				});
			}
		},
		async load(id) {
			if (id === HELPERS_ID) return getHelpersModule();
			if (isWrappedId(id, MODULE_SUFFIX)) {
				const name = getName(unwrapId(id, MODULE_SUFFIX));
				return {
					code: `var ${name} = {exports: {}}; export {${name} as __module}`,
					meta: { commonjs: { isCommonJS: false } }
				};
			}
			if (isWrappedId(id, EXPORTS_SUFFIX)) {
				const name = getName(unwrapId(id, EXPORTS_SUFFIX));
				return {
					code: `var ${name} = {}; export {${name} as __exports}`,
					meta: { commonjs: { isCommonJS: false } }
				};
			}
			if (isWrappedId(id, EXTERNAL_SUFFIX)) {
				const actualId = unwrapId(id, EXTERNAL_SUFFIX);
				if (requireNodeBuiltins === true && actualId.startsWith("node:")) return getExternalBuiltinRequireProxy(actualId);
				return getUnknownRequireProxy(actualId, isEsmExternal(actualId) ? getRequireReturnsDefault(actualId) : true);
			}
			if (id.endsWith(ENTRY_SUFFIX)) {
				const acutalId = id.slice(0, -15);
				const { meta: { commonjs: commonjsMeta } } = this.getModuleInfo(acutalId);
				const shebang = commonjsMeta?.shebang ?? "";
				return getEntryProxy(acutalId, getDefaultIsModuleExports(acutalId), this.getModuleInfo, shebang);
			}
			if (isWrappedId(id, ES_IMPORT_SUFFIX)) {
				const actualId = unwrapId(id, ES_IMPORT_SUFFIX);
				return getEsImportProxy(actualId, getDefaultIsModuleExports(actualId), (await this.load({ id: actualId })).moduleSideEffects);
			}
			if (id === DYNAMIC_MODULES_ID) return getDynamicModuleRegistry(isDynamicRequireModulesEnabled, dynamicRequireModules, commonDir, ignoreDynamicRequires);
			if (isWrappedId(id, PROXY_SUFFIX)) {
				const actualId = unwrapId(id, PROXY_SUFFIX);
				return getStaticRequireProxy(actualId, getRequireReturnsDefault(actualId), this.load);
			}
			return null;
		},
		shouldTransformCachedModule(...args) {
			return requireResolver.shouldTransformCachedModule.call(this, ...args);
		},
		transform(code, id) {
			if (!isPossibleCjsId(id)) return null;
			try {
				return transformAndCheckExports.call(this, code, id);
			} catch (err) {
				return this.error(err, err.pos);
			}
		}
	};
}
function json(options) {
	if (options === void 0) options = {};
	var filter = createFilter$2(options.include, options.exclude);
	var indent = "indent" in options ? options.indent : "	";
	return {
		name: "json",
		transform: function transform(code, id) {
			if (id.slice(-5) !== ".json" || !filter(id)) return null;
			try {
				return {
					code: dataToEsm(JSON.parse(code), {
						preferConst: options.preferConst,
						compact: options.compact,
						namedExports: options.namedExports,
						includeArbitraryNames: options.includeArbitraryNames,
						indent
					}),
					map: { mappings: "" }
				};
			} catch (err) {
				this.error({
					message: "Could not parse JSON file",
					id,
					cause: err
				});
				return null;
			}
		}
	};
}
var require_cjs = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	var isMergeableObject = function isMergeableObject(value) {
		return isNonNullObject(value) && !isSpecial(value);
	};
	function isNonNullObject(value) {
		return !!value && typeof value === "object";
	}
	function isSpecial(value) {
		var stringValue = Object.prototype.toString.call(value);
		return stringValue === "[object RegExp]" || stringValue === "[object Date]" || isReactElement(value);
	}
	var REACT_ELEMENT_TYPE = typeof Symbol === "function" && Symbol.for ? Symbol.for("react.element") : 60103;
	function isReactElement(value) {
		return value.$$typeof === REACT_ELEMENT_TYPE;
	}
	function emptyTarget(val) {
		return Array.isArray(val) ? [] : {};
	}
	function cloneUnlessOtherwiseSpecified(value, options) {
		return options.clone !== false && options.isMergeableObject(value) ? deepmerge(emptyTarget(value), value, options) : value;
	}
	function defaultArrayMerge(target, source, options) {
		return target.concat(source).map(function(element) {
			return cloneUnlessOtherwiseSpecified(element, options);
		});
	}
	function getMergeFunction(key, options) {
		if (!options.customMerge) return deepmerge;
		var customMerge = options.customMerge(key);
		return typeof customMerge === "function" ? customMerge : deepmerge;
	}
	function getEnumerableOwnPropertySymbols(target) {
		return Object.getOwnPropertySymbols ? Object.getOwnPropertySymbols(target).filter(function(symbol) {
			return Object.propertyIsEnumerable.call(target, symbol);
		}) : [];
	}
	function getKeys(target) {
		return Object.keys(target).concat(getEnumerableOwnPropertySymbols(target));
	}
	function propertyIsOnObject(object, property) {
		try {
			return property in object;
		} catch (_) {
			return false;
		}
	}
	function propertyIsUnsafe(target, key) {
		return propertyIsOnObject(target, key) && !(Object.hasOwnProperty.call(target, key) && Object.propertyIsEnumerable.call(target, key));
	}
	function mergeObject(target, source, options) {
		var destination = {};
		if (options.isMergeableObject(target)) getKeys(target).forEach(function(key) {
			destination[key] = cloneUnlessOtherwiseSpecified(target[key], options);
		});
		getKeys(source).forEach(function(key) {
			if (propertyIsUnsafe(target, key)) return;
			if (propertyIsOnObject(target, key) && options.isMergeableObject(source[key])) destination[key] = getMergeFunction(key, options)(target[key], source[key], options);
			else destination[key] = cloneUnlessOtherwiseSpecified(source[key], options);
		});
		return destination;
	}
	function deepmerge(target, source, options) {
		options = options || {};
		options.arrayMerge = options.arrayMerge || defaultArrayMerge;
		options.isMergeableObject = options.isMergeableObject || isMergeableObject;
		options.cloneUnlessOtherwiseSpecified = cloneUnlessOtherwiseSpecified;
		var sourceIsArray = Array.isArray(source);
		if (!(sourceIsArray === Array.isArray(target))) return cloneUnlessOtherwiseSpecified(source, options);
		else if (sourceIsArray) return options.arrayMerge(target, source, options);
		else return mergeObject(target, source, options);
	}
	deepmerge.all = function deepmergeAll(array, options) {
		if (!Array.isArray(array)) throw new Error("first argument should be an array");
		return array.reduce(function(prev, next) {
			return deepmerge(prev, next, options);
		}, {});
	};
	module.exports = deepmerge;
}));
var require_is_module = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	var ES6ImportExportRegExp = /(?:^\s*|[}{\(\);,\n]\s*)(import\s+['"]|(import|module)\s+[^"'\(\)\n;]+\s+from\s+['"]|export\s+(\*|\{|default|function|var|const|let|[_$a-zA-Z\xA0-\uFFFF][_$a-zA-Z0-9\xA0-\uFFFF]*))/;
	var ES6AliasRegExp = /(?:^\s*|[}{\(\);,\n]\s*)(export\s*\*\s*from\s*(?:'([^']+)'|"([^"]+)"))/;
	module.exports = function(sauce) {
		return ES6ImportExportRegExp.test(sauce) || ES6AliasRegExp.test(sauce);
	};
}));
var require_homedir = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	module.exports = __require("os").homedir || function homedir() {
		var home = process.env.HOME;
		var user = process.env.LOGNAME || process.env.USER || process.env.LNAME || process.env.USERNAME;
		if (process.platform === "win32") return process.env.USERPROFILE || process.env.HOMEDRIVE + process.env.HOMEPATH || home || null;
		if (process.platform === "darwin") return home || (user ? "/Users/" + user : null);
		if (process.platform === "linux") return home || (process.getuid() === 0 ? "/root" : user ? "/home/" + user : null);
		return home || null;
	};
}));
var require_caller = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	module.exports = function() {
		var origPrepareStackTrace = Error.prepareStackTrace;
		Error.prepareStackTrace = function(_, stack) {
			return stack;
		};
		var stack = (/* @__PURE__ */ new Error()).stack;
		Error.prepareStackTrace = origPrepareStackTrace;
		return stack[2].getFileName();
	};
}));
var require_path_parse = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	var isWindows = process.platform === "win32";
	var splitWindowsRe = /^(((?:[a-zA-Z]:|[\\\/]{2}[^\\\/]+[\\\/]+[^\\\/]+)?[\\\/]?)(?:[^\\\/]*[\\\/])*)((\.{1,2}|[^\\\/]+?|)(\.[^.\/\\]*|))[\\\/]*$/;
	var win32 = {};
	function win32SplitPath(filename) {
		return splitWindowsRe.exec(filename).slice(1);
	}
	win32.parse = function(pathString) {
		if (typeof pathString !== "string") throw new TypeError("Parameter 'pathString' must be a string, not " + typeof pathString);
		var allParts = win32SplitPath(pathString);
		if (!allParts || allParts.length !== 5) throw new TypeError("Invalid path '" + pathString + "'");
		return {
			root: allParts[1],
			dir: allParts[0] === allParts[1] ? allParts[0] : allParts[0].slice(0, -1),
			base: allParts[2],
			ext: allParts[4],
			name: allParts[3]
		};
	};
	var splitPathRe = /^((\/?)(?:[^\/]*\/)*)((\.{1,2}|[^\/]+?|)(\.[^.\/]*|))[\/]*$/;
	var posix = {};
	function posixSplitPath(filename) {
		return splitPathRe.exec(filename).slice(1);
	}
	posix.parse = function(pathString) {
		if (typeof pathString !== "string") throw new TypeError("Parameter 'pathString' must be a string, not " + typeof pathString);
		var allParts = posixSplitPath(pathString);
		if (!allParts || allParts.length !== 5) throw new TypeError("Invalid path '" + pathString + "'");
		return {
			root: allParts[1],
			dir: allParts[0].slice(0, -1),
			base: allParts[2],
			ext: allParts[4],
			name: allParts[3]
		};
	};
	if (isWindows) module.exports = win32.parse;
	else module.exports = posix.parse;
	module.exports.posix = posix.parse;
	module.exports.win32 = win32.parse;
}));
var require_node_modules_paths = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	var path$4 = __require("path");
	var parse = path$4.parse || require_path_parse();
	var driveLetterRegex = /^([A-Za-z]:)/;
	var uncPathRegex = /^\\\\/;
	var getNodeModulesDirs = function getNodeModulesDirs(absoluteStart, modules) {
		var prefix = "/";
		if (driveLetterRegex.test(absoluteStart)) prefix = "";
		else if (uncPathRegex.test(absoluteStart)) prefix = "\\\\";
		var paths = [absoluteStart];
		var parsed = parse(absoluteStart);
		while (parsed.dir !== paths[paths.length - 1]) {
			paths.push(parsed.dir);
			parsed = parse(parsed.dir);
		}
		return paths.reduce(function(dirs, aPath) {
			return dirs.concat(modules.map(function(moduleDir) {
				return path$4.resolve(prefix, aPath, moduleDir);
			}));
		}, []);
	};
	module.exports = function nodeModulesPaths(start, opts, request) {
		var modules = opts && opts.moduleDirectory ? [].concat(opts.moduleDirectory) : ["node_modules"];
		if (opts && typeof opts.paths === "function") return opts.paths(request, start, function() {
			return getNodeModulesDirs(start, modules);
		}, opts);
		var dirs = getNodeModulesDirs(start, modules);
		return opts && opts.paths ? dirs.concat(opts.paths) : dirs;
	};
}));
var require_normalize_options = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	module.exports = function(x, opts) {
		return opts || {};
	};
}));
var require_implementation = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	var ERROR_MESSAGE = "Function.prototype.bind called on incompatible ";
	var toStr = Object.prototype.toString;
	var max = Math.max;
	var funcType = "[object Function]";
	var concatty = function concatty(a, b) {
		var arr = [];
		for (var i = 0; i < a.length; i += 1) arr[i] = a[i];
		for (var j = 0; j < b.length; j += 1) arr[j + a.length] = b[j];
		return arr;
	};
	var slicy = function slicy(arrLike, offset) {
		var arr = [];
		for (var i = offset || 0, j = 0; i < arrLike.length; i += 1, j += 1) arr[j] = arrLike[i];
		return arr;
	};
	var joiny = function(arr, joiner) {
		var str = "";
		for (var i = 0; i < arr.length; i += 1) {
			str += arr[i];
			if (i + 1 < arr.length) str += joiner;
		}
		return str;
	};
	module.exports = function bind(that) {
		var target = this;
		if (typeof target !== "function" || toStr.apply(target) !== funcType) throw new TypeError(ERROR_MESSAGE + target);
		var args = slicy(arguments, 1);
		var bound;
		var binder = function() {
			if (this instanceof bound) {
				var result = target.apply(this, concatty(args, arguments));
				if (Object(result) === result) return result;
				return this;
			}
			return target.apply(that, concatty(args, arguments));
		};
		var boundLength = max(0, target.length - args.length);
		var boundArgs = [];
		for (var i = 0; i < boundLength; i++) boundArgs[i] = "$" + i;
		bound = Function("binder", "return function (" + joiny(boundArgs, ",") + "){ return binder.apply(this,arguments); }")(binder);
		if (target.prototype) {
			var Empty = function Empty() {};
			Empty.prototype = target.prototype;
			bound.prototype = new Empty();
			Empty.prototype = null;
		}
		return bound;
	};
}));
var require_function_bind = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	var implementation = require_implementation();
	module.exports = Function.prototype.bind || implementation;
}));
var require_hasown = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	var call = Function.prototype.call;
	var $hasOwn = Object.prototype.hasOwnProperty;
	module.exports = require_function_bind().call(call, $hasOwn);
}));
var require_core$2 = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	module.exports = {
		"assert": true,
		"node:assert": [">= 14.18 && < 15", ">= 16"],
		"assert/strict": ">= 15",
		"node:assert/strict": ">= 16",
		"async_hooks": ">= 8",
		"node:async_hooks": [">= 14.18 && < 15", ">= 16"],
		"buffer_ieee754": ">= 0.5 && < 0.9.7",
		"buffer": true,
		"node:buffer": [">= 14.18 && < 15", ">= 16"],
		"child_process": true,
		"node:child_process": [">= 14.18 && < 15", ">= 16"],
		"cluster": ">= 0.5",
		"node:cluster": [">= 14.18 && < 15", ">= 16"],
		"console": true,
		"node:console": [">= 14.18 && < 15", ">= 16"],
		"constants": true,
		"node:constants": [">= 14.18 && < 15", ">= 16"],
		"crypto": true,
		"node:crypto": [">= 14.18 && < 15", ">= 16"],
		"_debug_agent": ">= 1 && < 8",
		"_debugger": "< 8",
		"dgram": true,
		"node:dgram": [">= 14.18 && < 15", ">= 16"],
		"diagnostics_channel": [">= 14.17 && < 15", ">= 15.1"],
		"node:diagnostics_channel": [">= 14.18 && < 15", ">= 16"],
		"dns": true,
		"node:dns": [">= 14.18 && < 15", ">= 16"],
		"dns/promises": ">= 15",
		"node:dns/promises": ">= 16",
		"domain": ">= 0.7.12",
		"node:domain": [">= 14.18 && < 15", ">= 16"],
		"events": true,
		"node:events": [">= 14.18 && < 15", ">= 16"],
		"freelist": "< 6",
		"fs": true,
		"node:fs": [">= 14.18 && < 15", ">= 16"],
		"fs/promises": [">= 10 && < 10.1", ">= 14"],
		"node:fs/promises": [">= 14.18 && < 15", ">= 16"],
		"_http_agent": ">= 0.11.1",
		"node:_http_agent": [">= 14.18 && < 15", ">= 16"],
		"_http_client": ">= 0.11.1",
		"node:_http_client": [">= 14.18 && < 15", ">= 16"],
		"_http_common": ">= 0.11.1",
		"node:_http_common": [">= 14.18 && < 15", ">= 16"],
		"_http_incoming": ">= 0.11.1",
		"node:_http_incoming": [">= 14.18 && < 15", ">= 16"],
		"_http_outgoing": ">= 0.11.1",
		"node:_http_outgoing": [">= 14.18 && < 15", ">= 16"],
		"_http_server": ">= 0.11.1",
		"node:_http_server": [">= 14.18 && < 15", ">= 16"],
		"http": true,
		"node:http": [">= 14.18 && < 15", ">= 16"],
		"http2": ">= 8.8",
		"node:http2": [">= 14.18 && < 15", ">= 16"],
		"https": true,
		"node:https": [">= 14.18 && < 15", ">= 16"],
		"inspector": ">= 8",
		"node:inspector": [">= 14.18 && < 15", ">= 16"],
		"inspector/promises": [">= 19"],
		"node:inspector/promises": [">= 19"],
		"_linklist": "< 8",
		"module": true,
		"node:module": [">= 14.18 && < 15", ">= 16"],
		"net": true,
		"node:net": [">= 14.18 && < 15", ">= 16"],
		"node-inspect/lib/_inspect": ">= 7.6 && < 12",
		"node-inspect/lib/internal/inspect_client": ">= 7.6 && < 12",
		"node-inspect/lib/internal/inspect_repl": ">= 7.6 && < 12",
		"os": true,
		"node:os": [">= 14.18 && < 15", ">= 16"],
		"path": true,
		"node:path": [">= 14.18 && < 15", ">= 16"],
		"path/posix": ">= 15.3",
		"node:path/posix": ">= 16",
		"path/win32": ">= 15.3",
		"node:path/win32": ">= 16",
		"perf_hooks": ">= 8.5",
		"node:perf_hooks": [">= 14.18 && < 15", ">= 16"],
		"process": ">= 1",
		"node:process": [">= 14.18 && < 15", ">= 16"],
		"punycode": ">= 0.5",
		"node:punycode": [">= 14.18 && < 15", ">= 16"],
		"querystring": true,
		"node:querystring": [">= 14.18 && < 15", ">= 16"],
		"readline": true,
		"node:readline": [">= 14.18 && < 15", ">= 16"],
		"readline/promises": ">= 17",
		"node:readline/promises": ">= 17",
		"repl": true,
		"node:repl": [">= 14.18 && < 15", ">= 16"],
		"node:sea": [">= 20.12 && < 21", ">= 21.7"],
		"smalloc": ">= 0.11.5 && < 3",
		"node:sqlite": [">= 22.13 && < 23", ">= 23.4"],
		"_stream_duplex": ">= 0.9.4",
		"node:_stream_duplex": [">= 14.18 && < 15", ">= 16"],
		"_stream_transform": ">= 0.9.4",
		"node:_stream_transform": [">= 14.18 && < 15", ">= 16"],
		"_stream_wrap": ">= 1.4.1",
		"node:_stream_wrap": [">= 14.18 && < 15", ">= 16"],
		"_stream_passthrough": ">= 0.9.4",
		"node:_stream_passthrough": [">= 14.18 && < 15", ">= 16"],
		"_stream_readable": ">= 0.9.4",
		"node:_stream_readable": [">= 14.18 && < 15", ">= 16"],
		"_stream_writable": ">= 0.9.4",
		"node:_stream_writable": [">= 14.18 && < 15", ">= 16"],
		"stream": true,
		"node:stream": [">= 14.18 && < 15", ">= 16"],
		"stream/consumers": ">= 16.7",
		"node:stream/consumers": ">= 16.7",
		"stream/promises": ">= 15",
		"node:stream/promises": ">= 16",
		"stream/web": ">= 16.5",
		"node:stream/web": ">= 16.5",
		"string_decoder": true,
		"node:string_decoder": [">= 14.18 && < 15", ">= 16"],
		"sys": [">= 0.4 && < 0.7", ">= 0.8"],
		"node:sys": [">= 14.18 && < 15", ">= 16"],
		"test/reporters": ">= 19.9 && < 20.2",
		"node:test/reporters": [
			">= 18.17 && < 19",
			">= 19.9",
			">= 20"
		],
		"test/mock_loader": ">= 22.3 && < 22.7",
		"node:test/mock_loader": ">= 22.3 && < 22.7",
		"node:test": [">= 16.17 && < 17", ">= 18"],
		"timers": true,
		"node:timers": [">= 14.18 && < 15", ">= 16"],
		"timers/promises": ">= 15",
		"node:timers/promises": ">= 16",
		"_tls_common": ">= 0.11.13",
		"node:_tls_common": [">= 14.18 && < 15", ">= 16"],
		"_tls_legacy": ">= 0.11.3 && < 10",
		"_tls_wrap": ">= 0.11.3",
		"node:_tls_wrap": [">= 14.18 && < 15", ">= 16"],
		"tls": true,
		"node:tls": [">= 14.18 && < 15", ">= 16"],
		"trace_events": ">= 10",
		"node:trace_events": [">= 14.18 && < 15", ">= 16"],
		"tty": true,
		"node:tty": [">= 14.18 && < 15", ">= 16"],
		"url": true,
		"node:url": [">= 14.18 && < 15", ">= 16"],
		"util": true,
		"node:util": [">= 14.18 && < 15", ">= 16"],
		"util/types": ">= 15.3",
		"node:util/types": ">= 16",
		"v8/tools/arguments": ">= 10 && < 12",
		"v8/tools/codemap": [">= 4.4 && < 5", ">= 5.2 && < 12"],
		"v8/tools/consarray": [">= 4.4 && < 5", ">= 5.2 && < 12"],
		"v8/tools/csvparser": [">= 4.4 && < 5", ">= 5.2 && < 12"],
		"v8/tools/logreader": [">= 4.4 && < 5", ">= 5.2 && < 12"],
		"v8/tools/profile_view": [">= 4.4 && < 5", ">= 5.2 && < 12"],
		"v8/tools/splaytree": [">= 4.4 && < 5", ">= 5.2 && < 12"],
		"v8": ">= 1",
		"node:v8": [">= 14.18 && < 15", ">= 16"],
		"vm": true,
		"node:vm": [">= 14.18 && < 15", ">= 16"],
		"wasi": [
			">= 13.4 && < 13.5",
			">= 18.17 && < 19",
			">= 20"
		],
		"node:wasi": [">= 18.17 && < 19", ">= 20"],
		"worker_threads": ">= 11.7",
		"node:worker_threads": [">= 14.18 && < 15", ">= 16"],
		"zlib": ">= 0.5",
		"node:zlib": [">= 14.18 && < 15", ">= 16"]
	};
}));
var require_is_core_module = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	var hasOwn = require_hasown();
	function specifierIncluded(current, specifier) {
		var nodeParts = current.split(".");
		var parts = specifier.split(" ");
		var op = parts.length > 1 ? parts[0] : "=";
		var versionParts = (parts.length > 1 ? parts[1] : parts[0]).split(".");
		for (var i = 0; i < 3; ++i) {
			var cur = parseInt(nodeParts[i] || 0, 10);
			var ver = parseInt(versionParts[i] || 0, 10);
			if (cur === ver) continue;
			if (op === "<") return cur < ver;
			if (op === ">=") return cur >= ver;
			return false;
		}
		return op === ">=";
	}
	function matchesRange(current, range) {
		var specifiers = range.split(/ ?&& ?/);
		if (specifiers.length === 0) return false;
		for (var i = 0; i < specifiers.length; ++i) if (!specifierIncluded(current, specifiers[i])) return false;
		return true;
	}
	function versionIncluded(nodeVersion, specifierValue) {
		if (typeof specifierValue === "boolean") return specifierValue;
		var current = typeof nodeVersion === "undefined" ? process.versions && process.versions.node : nodeVersion;
		if (typeof current !== "string") throw new TypeError(typeof nodeVersion === "undefined" ? "Unable to determine current node version" : "If provided, a valid node version is required");
		if (specifierValue && typeof specifierValue === "object") {
			for (var i = 0; i < specifierValue.length; ++i) if (matchesRange(current, specifierValue[i])) return true;
			return false;
		}
		return matchesRange(current, specifierValue);
	}
	var data = require_core$2();
	module.exports = function isCore(x, nodeVersion) {
		return hasOwn(data, x) && versionIncluded(nodeVersion, data[x]);
	};
}));
var require_async = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	var fs$2 = __require("fs");
	var getHomedir = require_homedir();
	var path$3 = __require("path");
	var caller = require_caller();
	var nodeModulesPaths = require_node_modules_paths();
	var normalizeOptions = require_normalize_options();
	var isCore = require_is_core_module();
	var realpathFS = process.platform !== "win32" && fs$2.realpath && typeof fs$2.realpath.native === "function" ? fs$2.realpath.native : fs$2.realpath;
	var relativePathRegex = /^(?:\.\.?(?:\/|$)|\/|([A-Za-z]:)?[/\\])/;
	var windowsDriveRegex = /^\w:[/\\]*$/;
	var nodeModulesRegex = /[/\\]node_modules[/\\]*$/;
	var homedir = getHomedir();
	var defaultPaths = function() {
		return [path$3.join(homedir, ".node_modules"), path$3.join(homedir, ".node_libraries")];
	};
	var defaultIsFile = function isFile(file, cb) {
		fs$2.stat(file, function(err, stat) {
			if (!err) return cb(null, stat.isFile() || stat.isFIFO());
			if (err.code === "ENOENT" || err.code === "ENOTDIR") return cb(null, false);
			return cb(err);
		});
	};
	var defaultIsDir = function isDirectory(dir, cb) {
		fs$2.stat(dir, function(err, stat) {
			if (!err) return cb(null, stat.isDirectory());
			if (err.code === "ENOENT" || err.code === "ENOTDIR") return cb(null, false);
			return cb(err);
		});
	};
	var defaultRealpath = function realpath(x, cb) {
		realpathFS(x, function(realpathErr, realPath) {
			if (realpathErr && realpathErr.code !== "ENOENT") cb(realpathErr);
			else cb(null, realpathErr ? x : realPath);
		});
	};
	var maybeRealpath = function maybeRealpath(realpath, x, opts, cb) {
		if (opts && opts.preserveSymlinks === false) realpath(x, cb);
		else cb(null, x);
	};
	var defaultReadPackage = function defaultReadPackage(readFile, pkgfile, cb) {
		readFile(pkgfile, function(readFileErr, body) {
			if (readFileErr) cb(readFileErr);
			else try {
				cb(null, JSON.parse(body));
			} catch (jsonErr) {
				cb(null);
			}
		});
	};
	var getPackageCandidates = function getPackageCandidates(x, start, opts) {
		var dirs = nodeModulesPaths(start, opts, x);
		for (var i = 0; i < dirs.length; i++) dirs[i] = path$3.join(dirs[i], x);
		return dirs;
	};
	module.exports = function resolve(x, options, callback) {
		var cb = callback;
		var opts = options;
		if (typeof options === "function") {
			cb = opts;
			opts = {};
		}
		if (typeof x !== "string") {
			var err = /* @__PURE__ */ new TypeError("Path must be a string.");
			return process.nextTick(function() {
				cb(err);
			});
		}
		opts = normalizeOptions(x, opts);
		var isFile = opts.isFile || defaultIsFile;
		var isDirectory = opts.isDirectory || defaultIsDir;
		var readFile = opts.readFile || fs$2.readFile;
		var realpath = opts.realpath || defaultRealpath;
		var readPackage = opts.readPackage || defaultReadPackage;
		if (opts.readFile && opts.readPackage) {
			var conflictErr = /* @__PURE__ */ new TypeError("`readFile` and `readPackage` are mutually exclusive.");
			return process.nextTick(function() {
				cb(conflictErr);
			});
		}
		var packageIterator = opts.packageIterator;
		var extensions = opts.extensions || [".js"];
		var includeCoreModules = opts.includeCoreModules !== false;
		var basedir = opts.basedir || path$3.dirname(caller());
		var parent = opts.filename || basedir;
		opts.paths = opts.paths || defaultPaths();
		maybeRealpath(realpath, path$3.resolve(basedir), opts, function(err, realStart) {
			if (err) cb(err);
			else init(realStart);
		});
		var res;
		function init(basedir) {
			if (relativePathRegex.test(x)) {
				res = path$3.resolve(basedir, x);
				if (x === "." || x === ".." || x.slice(-1) === "/") res += "/";
				if (x.slice(-1) === "/" && res === basedir) loadAsDirectory(res, opts.package, onfile);
				else loadAsFile(res, opts.package, onfile);
			} else if (includeCoreModules && isCore(x)) return cb(null, x);
			else loadNodeModules(x, basedir, function(err, n, pkg) {
				if (err) cb(err);
				else if (n) return maybeRealpath(realpath, n, opts, function(err, realN) {
					if (err) cb(err);
					else cb(null, realN, pkg);
				});
				else {
					var moduleError = /* @__PURE__ */ new Error("Cannot find module '" + x + "' from '" + parent + "'");
					moduleError.code = "MODULE_NOT_FOUND";
					cb(moduleError);
				}
			});
		}
		function onfile(err, m, pkg) {
			if (err) cb(err);
			else if (m) cb(null, m, pkg);
			else loadAsDirectory(res, function(err, d, pkg) {
				if (err) cb(err);
				else if (d) maybeRealpath(realpath, d, opts, function(err, realD) {
					if (err) cb(err);
					else cb(null, realD, pkg);
				});
				else {
					var moduleError = /* @__PURE__ */ new Error("Cannot find module '" + x + "' from '" + parent + "'");
					moduleError.code = "MODULE_NOT_FOUND";
					cb(moduleError);
				}
			});
		}
		function loadAsFile(x, thePackage, callback) {
			var loadAsFilePackage = thePackage;
			var cb = callback;
			if (typeof loadAsFilePackage === "function") {
				cb = loadAsFilePackage;
				loadAsFilePackage = void 0;
			}
			load([""].concat(extensions), x, loadAsFilePackage);
			function load(exts, x, loadPackage) {
				if (exts.length === 0) return cb(null, void 0, loadPackage);
				var file = x + exts[0];
				var pkg = loadPackage;
				if (pkg) onpkg(null, pkg);
				else loadpkg(path$3.dirname(file), onpkg);
				function onpkg(err, pkg_, dir) {
					pkg = pkg_;
					if (err) return cb(err);
					if (dir && pkg && opts.pathFilter) {
						var rfile = path$3.relative(dir, file);
						var rel = rfile.slice(0, rfile.length - exts[0].length);
						var r = opts.pathFilter(pkg, x, rel);
						if (r) return load([""].concat(extensions.slice()), path$3.resolve(dir, r), pkg);
					}
					isFile(file, onex);
				}
				function onex(err, ex) {
					if (err) return cb(err);
					if (ex) return cb(null, file, pkg);
					load(exts.slice(1), x, pkg);
				}
			}
		}
		function loadpkg(dir, cb) {
			if (dir === "" || dir === "/") return cb(null);
			if (process.platform === "win32" && windowsDriveRegex.test(dir)) return cb(null);
			if (nodeModulesRegex.test(dir)) return cb(null);
			maybeRealpath(realpath, dir, opts, function(unwrapErr, pkgdir) {
				if (unwrapErr) return loadpkg(path$3.dirname(dir), cb);
				var pkgfile = path$3.join(pkgdir, "package.json");
				isFile(pkgfile, function(err, ex) {
					if (!ex) return loadpkg(path$3.dirname(dir), cb);
					readPackage(readFile, pkgfile, function(err, pkgParam) {
						if (err) cb(err);
						var pkg = pkgParam;
						if (pkg && opts.packageFilter) pkg = opts.packageFilter(pkg, pkgfile);
						cb(null, pkg, dir);
					});
				});
			});
		}
		function loadAsDirectory(x, loadAsDirectoryPackage, callback) {
			var cb = callback;
			var fpkg = loadAsDirectoryPackage;
			if (typeof fpkg === "function") {
				cb = fpkg;
				fpkg = opts.package;
			}
			maybeRealpath(realpath, x, opts, function(unwrapErr, pkgdir) {
				if (unwrapErr) return cb(unwrapErr);
				var pkgfile = path$3.join(pkgdir, "package.json");
				isFile(pkgfile, function(err, ex) {
					if (err) return cb(err);
					if (!ex) return loadAsFile(path$3.join(x, "index"), fpkg, cb);
					readPackage(readFile, pkgfile, function(err, pkgParam) {
						if (err) return cb(err);
						var pkg = pkgParam;
						if (pkg && opts.packageFilter) pkg = opts.packageFilter(pkg, pkgfile);
						if (pkg && pkg.main) {
							if (typeof pkg.main !== "string") {
								var mainError = /* @__PURE__ */ new TypeError("package “" + pkg.name + "” `main` must be a string");
								mainError.code = "INVALID_PACKAGE_MAIN";
								return cb(mainError);
							}
							if (pkg.main === "." || pkg.main === "./") pkg.main = "index";
							loadAsFile(path$3.resolve(x, pkg.main), pkg, function(err, m, pkg) {
								if (err) return cb(err);
								if (m) return cb(null, m, pkg);
								if (!pkg) return loadAsFile(path$3.join(x, "index"), pkg, cb);
								loadAsDirectory(path$3.resolve(x, pkg.main), pkg, function(err, n, pkg) {
									if (err) return cb(err);
									if (n) return cb(null, n, pkg);
									loadAsFile(path$3.join(x, "index"), pkg, cb);
								});
							});
							return;
						}
						loadAsFile(path$3.join(x, "/index"), pkg, cb);
					});
				});
			});
		}
		function processDirs(cb, dirs) {
			if (dirs.length === 0) return cb(null, void 0);
			var dir = dirs[0];
			isDirectory(path$3.dirname(dir), isdir);
			function isdir(err, isdir) {
				if (err) return cb(err);
				if (!isdir) return processDirs(cb, dirs.slice(1));
				loadAsFile(dir, opts.package, onfile);
			}
			function onfile(err, m, pkg) {
				if (err) return cb(err);
				if (m) return cb(null, m, pkg);
				loadAsDirectory(dir, opts.package, ondir);
			}
			function ondir(err, n, pkg) {
				if (err) return cb(err);
				if (n) return cb(null, n, pkg);
				processDirs(cb, dirs.slice(1));
			}
		}
		function loadNodeModules(x, start, cb) {
			var thunk = function() {
				return getPackageCandidates(x, start, opts);
			};
			processDirs(cb, packageIterator ? packageIterator(x, start, thunk, opts) : thunk());
		}
	};
}));
var require_core$1 = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	module.exports = {
		"assert": true,
		"node:assert": [">= 14.18 && < 15", ">= 16"],
		"assert/strict": ">= 15",
		"node:assert/strict": ">= 16",
		"async_hooks": ">= 8",
		"node:async_hooks": [">= 14.18 && < 15", ">= 16"],
		"buffer_ieee754": ">= 0.5 && < 0.9.7",
		"buffer": true,
		"node:buffer": [">= 14.18 && < 15", ">= 16"],
		"child_process": true,
		"node:child_process": [">= 14.18 && < 15", ">= 16"],
		"cluster": ">= 0.5",
		"node:cluster": [">= 14.18 && < 15", ">= 16"],
		"console": true,
		"node:console": [">= 14.18 && < 15", ">= 16"],
		"constants": true,
		"node:constants": [">= 14.18 && < 15", ">= 16"],
		"crypto": true,
		"node:crypto": [">= 14.18 && < 15", ">= 16"],
		"_debug_agent": ">= 1 && < 8",
		"_debugger": "< 8",
		"dgram": true,
		"node:dgram": [">= 14.18 && < 15", ">= 16"],
		"diagnostics_channel": [">= 14.17 && < 15", ">= 15.1"],
		"node:diagnostics_channel": [">= 14.18 && < 15", ">= 16"],
		"dns": true,
		"node:dns": [">= 14.18 && < 15", ">= 16"],
		"dns/promises": ">= 15",
		"node:dns/promises": ">= 16",
		"domain": ">= 0.7.12",
		"node:domain": [">= 14.18 && < 15", ">= 16"],
		"events": true,
		"node:events": [">= 14.18 && < 15", ">= 16"],
		"freelist": "< 6",
		"fs": true,
		"node:fs": [">= 14.18 && < 15", ">= 16"],
		"fs/promises": [">= 10 && < 10.1", ">= 14"],
		"node:fs/promises": [">= 14.18 && < 15", ">= 16"],
		"_http_agent": ">= 0.11.1",
		"node:_http_agent": [">= 14.18 && < 15", ">= 16"],
		"_http_client": ">= 0.11.1",
		"node:_http_client": [">= 14.18 && < 15", ">= 16"],
		"_http_common": ">= 0.11.1",
		"node:_http_common": [">= 14.18 && < 15", ">= 16"],
		"_http_incoming": ">= 0.11.1",
		"node:_http_incoming": [">= 14.18 && < 15", ">= 16"],
		"_http_outgoing": ">= 0.11.1",
		"node:_http_outgoing": [">= 14.18 && < 15", ">= 16"],
		"_http_server": ">= 0.11.1",
		"node:_http_server": [">= 14.18 && < 15", ">= 16"],
		"http": true,
		"node:http": [">= 14.18 && < 15", ">= 16"],
		"http2": ">= 8.8",
		"node:http2": [">= 14.18 && < 15", ">= 16"],
		"https": true,
		"node:https": [">= 14.18 && < 15", ">= 16"],
		"inspector": ">= 8",
		"node:inspector": [">= 14.18 && < 15", ">= 16"],
		"inspector/promises": [">= 19"],
		"node:inspector/promises": [">= 19"],
		"_linklist": "< 8",
		"module": true,
		"node:module": [">= 14.18 && < 15", ">= 16"],
		"net": true,
		"node:net": [">= 14.18 && < 15", ">= 16"],
		"node-inspect/lib/_inspect": ">= 7.6 && < 12",
		"node-inspect/lib/internal/inspect_client": ">= 7.6 && < 12",
		"node-inspect/lib/internal/inspect_repl": ">= 7.6 && < 12",
		"os": true,
		"node:os": [">= 14.18 && < 15", ">= 16"],
		"path": true,
		"node:path": [">= 14.18 && < 15", ">= 16"],
		"path/posix": ">= 15.3",
		"node:path/posix": ">= 16",
		"path/win32": ">= 15.3",
		"node:path/win32": ">= 16",
		"perf_hooks": ">= 8.5",
		"node:perf_hooks": [">= 14.18 && < 15", ">= 16"],
		"process": ">= 1",
		"node:process": [">= 14.18 && < 15", ">= 16"],
		"punycode": ">= 0.5",
		"node:punycode": [">= 14.18 && < 15", ">= 16"],
		"querystring": true,
		"node:querystring": [">= 14.18 && < 15", ">= 16"],
		"readline": true,
		"node:readline": [">= 14.18 && < 15", ">= 16"],
		"readline/promises": ">= 17",
		"node:readline/promises": ">= 17",
		"repl": true,
		"node:repl": [">= 14.18 && < 15", ">= 16"],
		"node:sea": [">= 20.12 && < 21", ">= 21.7"],
		"smalloc": ">= 0.11.5 && < 3",
		"node:sqlite": [">= 22.13 && < 23", ">= 23.4"],
		"_stream_duplex": ">= 0.9.4",
		"node:_stream_duplex": [">= 14.18 && < 15", ">= 16"],
		"_stream_transform": ">= 0.9.4",
		"node:_stream_transform": [">= 14.18 && < 15", ">= 16"],
		"_stream_wrap": ">= 1.4.1",
		"node:_stream_wrap": [">= 14.18 && < 15", ">= 16"],
		"_stream_passthrough": ">= 0.9.4",
		"node:_stream_passthrough": [">= 14.18 && < 15", ">= 16"],
		"_stream_readable": ">= 0.9.4",
		"node:_stream_readable": [">= 14.18 && < 15", ">= 16"],
		"_stream_writable": ">= 0.9.4",
		"node:_stream_writable": [">= 14.18 && < 15", ">= 16"],
		"stream": true,
		"node:stream": [">= 14.18 && < 15", ">= 16"],
		"stream/consumers": ">= 16.7",
		"node:stream/consumers": ">= 16.7",
		"stream/promises": ">= 15",
		"node:stream/promises": ">= 16",
		"stream/web": ">= 16.5",
		"node:stream/web": ">= 16.5",
		"string_decoder": true,
		"node:string_decoder": [">= 14.18 && < 15", ">= 16"],
		"sys": [">= 0.4 && < 0.7", ">= 0.8"],
		"node:sys": [">= 14.18 && < 15", ">= 16"],
		"test/reporters": ">= 19.9 && < 20.2",
		"node:test/reporters": [
			">= 18.17 && < 19",
			">= 19.9",
			">= 20"
		],
		"test/mock_loader": ">= 22.3 && < 22.7",
		"node:test/mock_loader": ">= 22.3 && < 22.7",
		"node:test": [">= 16.17 && < 17", ">= 18"],
		"timers": true,
		"node:timers": [">= 14.18 && < 15", ">= 16"],
		"timers/promises": ">= 15",
		"node:timers/promises": ">= 16",
		"_tls_common": ">= 0.11.13",
		"node:_tls_common": [">= 14.18 && < 15", ">= 16"],
		"_tls_legacy": ">= 0.11.3 && < 10",
		"_tls_wrap": ">= 0.11.3",
		"node:_tls_wrap": [">= 14.18 && < 15", ">= 16"],
		"tls": true,
		"node:tls": [">= 14.18 && < 15", ">= 16"],
		"trace_events": ">= 10",
		"node:trace_events": [">= 14.18 && < 15", ">= 16"],
		"tty": true,
		"node:tty": [">= 14.18 && < 15", ">= 16"],
		"url": true,
		"node:url": [">= 14.18 && < 15", ">= 16"],
		"util": true,
		"node:util": [">= 14.18 && < 15", ">= 16"],
		"util/types": ">= 15.3",
		"node:util/types": ">= 16",
		"v8/tools/arguments": ">= 10 && < 12",
		"v8/tools/codemap": [">= 4.4 && < 5", ">= 5.2 && < 12"],
		"v8/tools/consarray": [">= 4.4 && < 5", ">= 5.2 && < 12"],
		"v8/tools/csvparser": [">= 4.4 && < 5", ">= 5.2 && < 12"],
		"v8/tools/logreader": [">= 4.4 && < 5", ">= 5.2 && < 12"],
		"v8/tools/profile_view": [">= 4.4 && < 5", ">= 5.2 && < 12"],
		"v8/tools/splaytree": [">= 4.4 && < 5", ">= 5.2 && < 12"],
		"v8": ">= 1",
		"node:v8": [">= 14.18 && < 15", ">= 16"],
		"vm": true,
		"node:vm": [">= 14.18 && < 15", ">= 16"],
		"wasi": [
			">= 13.4 && < 13.5",
			">= 18.17 && < 19",
			">= 20"
		],
		"node:wasi": [">= 18.17 && < 19", ">= 20"],
		"worker_threads": ">= 11.7",
		"node:worker_threads": [">= 14.18 && < 15", ">= 16"],
		"zlib": ">= 0.5",
		"node:zlib": [">= 14.18 && < 15", ">= 16"]
	};
}));
var require_core = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	var isCoreModule = require_is_core_module();
	var data = require_core$1();
	var core = {};
	for (var mod in data) if (Object.prototype.hasOwnProperty.call(data, mod)) core[mod] = isCoreModule(mod);
	module.exports = core;
}));
var require_is_core = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	var isCoreModule = require_is_core_module();
	module.exports = function isCore(x) {
		return isCoreModule(x);
	};
}));
var require_sync = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	var isCore = require_is_core_module();
	var fs$1 = __require("fs");
	var path$2 = __require("path");
	var getHomedir = require_homedir();
	var caller = require_caller();
	var nodeModulesPaths = require_node_modules_paths();
	var normalizeOptions = require_normalize_options();
	var realpathFS = process.platform !== "win32" && fs$1.realpathSync && typeof fs$1.realpathSync.native === "function" ? fs$1.realpathSync.native : fs$1.realpathSync;
	var relativePathRegex = /^(?:\.\.?(?:\/|$)|\/|([A-Za-z]:)?[/\\])/;
	var windowsDriveRegex = /^\w:[/\\]*$/;
	var nodeModulesRegex = /[/\\]node_modules[/\\]*$/;
	var homedir = getHomedir();
	var defaultPaths = function() {
		return [path$2.join(homedir, ".node_modules"), path$2.join(homedir, ".node_libraries")];
	};
	var defaultIsFile = function isFile(file) {
		try {
			var stat = fs$1.statSync(file, { throwIfNoEntry: false });
		} catch (e) {
			if (e && (e.code === "ENOENT" || e.code === "ENOTDIR")) return false;
			throw e;
		}
		return !!stat && (stat.isFile() || stat.isFIFO());
	};
	var defaultIsDir = function isDirectory(dir) {
		try {
			var stat = fs$1.statSync(dir, { throwIfNoEntry: false });
		} catch (e) {
			if (e && (e.code === "ENOENT" || e.code === "ENOTDIR")) return false;
			throw e;
		}
		return !!stat && stat.isDirectory();
	};
	var defaultRealpathSync = function realpathSync(x) {
		try {
			return realpathFS(x);
		} catch (realpathErr) {
			if (realpathErr.code !== "ENOENT") throw realpathErr;
		}
		return x;
	};
	var maybeRealpathSync = function maybeRealpathSync(realpathSync, x, opts) {
		if (opts && opts.preserveSymlinks === false) return realpathSync(x);
		return x;
	};
	var defaultReadPackageSync = function defaultReadPackageSync(readFileSync, pkgfile) {
		var body = readFileSync(pkgfile);
		try {
			return JSON.parse(body);
		} catch (jsonErr) {}
	};
	var getPackageCandidates = function getPackageCandidates(x, start, opts) {
		var dirs = nodeModulesPaths(start, opts, x);
		for (var i = 0; i < dirs.length; i++) dirs[i] = path$2.join(dirs[i], x);
		return dirs;
	};
	module.exports = function resolveSync(x, options) {
		if (typeof x !== "string") throw new TypeError("Path must be a string.");
		var opts = normalizeOptions(x, options);
		var isFile = opts.isFile || defaultIsFile;
		var readFileSync = opts.readFileSync || fs$1.readFileSync;
		var isDirectory = opts.isDirectory || defaultIsDir;
		var realpathSync = opts.realpathSync || defaultRealpathSync;
		var readPackageSync = opts.readPackageSync || defaultReadPackageSync;
		if (opts.readFileSync && opts.readPackageSync) throw new TypeError("`readFileSync` and `readPackageSync` are mutually exclusive.");
		var packageIterator = opts.packageIterator;
		var extensions = opts.extensions || [".js"];
		var includeCoreModules = opts.includeCoreModules !== false;
		var basedir = opts.basedir || path$2.dirname(caller());
		var parent = opts.filename || basedir;
		opts.paths = opts.paths || defaultPaths();
		var absoluteStart = maybeRealpathSync(realpathSync, path$2.resolve(basedir), opts);
		if (relativePathRegex.test(x)) {
			var res = path$2.resolve(absoluteStart, x);
			if (x === "." || x === ".." || x.slice(-1) === "/") res += "/";
			var m = loadAsFileSync(res) || loadAsDirectorySync(res);
			if (m) return maybeRealpathSync(realpathSync, m, opts);
		} else if (includeCoreModules && isCore(x)) return x;
		else {
			var n = loadNodeModulesSync(x, absoluteStart);
			if (n) return maybeRealpathSync(realpathSync, n, opts);
		}
		var err = /* @__PURE__ */ new Error("Cannot find module '" + x + "' from '" + parent + "'");
		err.code = "MODULE_NOT_FOUND";
		throw err;
		function loadAsFileSync(x) {
			var pkg = loadpkg(path$2.dirname(x));
			if (pkg && pkg.dir && pkg.pkg && opts.pathFilter) {
				var rfile = path$2.relative(pkg.dir, x);
				var r = opts.pathFilter(pkg.pkg, x, rfile);
				if (r) x = path$2.resolve(pkg.dir, r);
			}
			if (isFile(x)) return x;
			for (var i = 0; i < extensions.length; i++) {
				var file = x + extensions[i];
				if (isFile(file)) return file;
			}
		}
		function loadpkg(dir) {
			if (dir === "" || dir === "/") return;
			if (process.platform === "win32" && windowsDriveRegex.test(dir)) return;
			if (nodeModulesRegex.test(dir)) return;
			var pkgfile = path$2.join(maybeRealpathSync(realpathSync, dir, opts), "package.json");
			if (!isFile(pkgfile)) return loadpkg(path$2.dirname(dir));
			var pkg = readPackageSync(readFileSync, pkgfile);
			if (pkg && opts.packageFilter) pkg = opts.packageFilter(pkg, dir);
			return {
				pkg,
				dir
			};
		}
		function loadAsDirectorySync(x) {
			var pkgfile = path$2.join(maybeRealpathSync(realpathSync, x, opts), "/package.json");
			if (isFile(pkgfile)) {
				try {
					var pkg = readPackageSync(readFileSync, pkgfile);
				} catch (e) {}
				if (pkg && opts.packageFilter) pkg = opts.packageFilter(pkg, x);
				if (pkg && pkg.main) {
					if (typeof pkg.main !== "string") {
						var mainError = /* @__PURE__ */ new TypeError("package “" + pkg.name + "” `main` must be a string");
						mainError.code = "INVALID_PACKAGE_MAIN";
						throw mainError;
					}
					if (pkg.main === "." || pkg.main === "./") pkg.main = "index";
					try {
						var m = loadAsFileSync(path$2.resolve(x, pkg.main));
						if (m) return m;
						var n = loadAsDirectorySync(path$2.resolve(x, pkg.main));
						if (n) return n;
					} catch (e) {}
				}
			}
			return loadAsFileSync(path$2.join(x, "/index"));
		}
		function loadNodeModulesSync(x, start) {
			var thunk = function() {
				return getPackageCandidates(x, start, opts);
			};
			var dirs = packageIterator ? packageIterator(x, start, thunk, opts) : thunk();
			for (var i = 0; i < dirs.length; i++) {
				var dir = dirs[i];
				if (isDirectory(path$2.dirname(dir))) {
					var m = loadAsFileSync(dir);
					if (m) return m;
					var n = loadAsDirectorySync(dir);
					if (n) return n;
				}
			}
		}
	};
}));
var require_resolve = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	var async = require_async();
	async.core = require_core();
	async.isCore = require_is_core();
	async.sync = require_sync();
	module.exports = async;
}));
var import_cjs = /* @__PURE__ */ __toESM(require_cjs(), 1);
var import_is_module = /* @__PURE__ */ __toESM(require_is_module(), 1);
var import_resolve = /* @__PURE__ */ __toESM(require_resolve(), 1);
var version = "16.0.3";
var peerDependencies = { rollup: "^2.78.0||^3.0.0||^4.0.0" };
promisify$1(nativeFs.access);
const readFile$1 = promisify$1(nativeFs.readFile);
const realpath$1 = promisify$1(nativeFs.realpath);
const stat$2 = promisify$1(nativeFs.stat);
async function fileExists(filePath) {
	try {
		return (await stat$2(filePath)).isFile();
	} catch {
		return false;
	}
}
async function resolveSymlink(path) {
	return await fileExists(path) ? realpath$1(path) : path;
}
const onError = (error) => {
	if (error.code === "ENOENT") return false;
	throw error;
};
const makeCache = (fn) => {
	const cache = /* @__PURE__ */ new Map();
	const wrapped = async (param, done) => {
		if (cache.has(param) === false) cache.set(param, fn(param).catch((err) => {
			cache.delete(param);
			throw err;
		}));
		try {
			return done(null, await cache.get(param));
		} catch (error) {
			return done(error);
		}
	};
	wrapped.clear = () => cache.clear();
	return wrapped;
};
const isDirCached = makeCache(async (file) => {
	try {
		return (await stat$2(file)).isDirectory();
	} catch (error) {
		return onError(error);
	}
});
const isFileCached = makeCache(async (file) => {
	try {
		return (await stat$2(file)).isFile();
	} catch (error) {
		return onError(error);
	}
});
const readCachedFile = makeCache(readFile$1);
function handleDeprecatedOptions(opts) {
	const warnings = [];
	if (opts.customResolveOptions) {
		const { customResolveOptions } = opts;
		if (customResolveOptions.moduleDirectory) {
			opts.moduleDirectories = Array.isArray(customResolveOptions.moduleDirectory) ? customResolveOptions.moduleDirectory : [customResolveOptions.moduleDirectory];
			warnings.push("node-resolve: The `customResolveOptions.moduleDirectory` option has been deprecated. Use `moduleDirectories`, which must be an array.");
		}
		if (customResolveOptions.preserveSymlinks) throw new Error("node-resolve: `customResolveOptions.preserveSymlinks` is no longer an option. We now always use the rollup `preserveSymlinks` option.");
		[
			"basedir",
			"package",
			"extensions",
			"includeCoreModules",
			"readFile",
			"isFile",
			"isDirectory",
			"realpath",
			"packageFilter",
			"pathFilter",
			"paths",
			"packageIterator"
		].forEach((resolveOption) => {
			if (customResolveOptions[resolveOption]) throw new Error(`node-resolve: \`customResolveOptions.${resolveOption}\` is no longer an option. If you need this, please open an issue.`);
		});
	}
	return { warnings };
}
function getPackageName(id) {
	if (id.startsWith(".") || id.startsWith("/")) return null;
	const split = id.split("/");
	if (split[0][0] === "@") return `${split[0]}/${split[1]}`;
	return split[0];
}
function getMainFields(options) {
	let mainFields;
	if (options.mainFields) ({mainFields} = options);
	else mainFields = ["module", "main"];
	if (options.browser && mainFields.indexOf("browser") === -1) return ["browser"].concat(mainFields);
	if (!mainFields.length) throw new Error("Please ensure at least one `mainFields` value is specified");
	return mainFields;
}
function getPackageInfo(options) {
	const { cache, extensions, pkg, mainFields, preserveSymlinks, useBrowserOverrides, rootDir, ignoreSideEffectsForRoot } = options;
	let { pkgPath } = options;
	if (cache.has(pkgPath)) return cache.get(pkgPath);
	if (!preserveSymlinks) pkgPath = realpathSync$1(pkgPath);
	const pkgRoot = dirname$1(pkgPath);
	const packageInfo = {
		packageJson: { ...pkg },
		packageJsonPath: pkgPath,
		root: pkgRoot,
		resolvedMainField: "main",
		browserMappedMain: false,
		resolvedEntryPoint: ""
	};
	let overriddenMain = false;
	for (let i = 0; i < mainFields.length; i++) {
		const field = mainFields[i];
		if (typeof pkg[field] === "string") {
			pkg.main = pkg[field];
			packageInfo.resolvedMainField = field;
			overriddenMain = true;
			break;
		}
	}
	const internalPackageInfo = {
		cachedPkg: pkg,
		hasModuleSideEffects: () => null,
		hasPackageEntry: overriddenMain !== false || mainFields.indexOf("main") !== -1,
		packageBrowserField: useBrowserOverrides && typeof pkg.browser === "object" && Object.keys(pkg.browser).reduce((browser, key) => {
			let resolved = pkg.browser[key];
			if (resolved && resolved[0] === ".") resolved = resolve$1(pkgRoot, resolved);
			browser[key] = resolved;
			if (key[0] === ".") {
				const absoluteKey = resolve$1(pkgRoot, key);
				browser[absoluteKey] = resolved;
				if (!extname$1(key)) extensions.reduce((subBrowser, ext) => {
					subBrowser[absoluteKey + ext] = subBrowser[key];
					return subBrowser;
				}, browser);
			}
			return browser;
		}, {}),
		packageInfo
	};
	const browserMap = internalPackageInfo.packageBrowserField;
	if (useBrowserOverrides && typeof pkg.browser === "object" && browserMap.hasOwnProperty(pkg.main)) {
		packageInfo.resolvedEntryPoint = browserMap[pkg.main];
		packageInfo.browserMappedMain = true;
	} else {
		packageInfo.resolvedEntryPoint = resolve$1(pkgRoot, pkg.main || "index.js");
		packageInfo.browserMappedMain = false;
	}
	if (!ignoreSideEffectsForRoot || rootDir !== pkgRoot) {
		const packageSideEffects = pkg.sideEffects;
		if (typeof packageSideEffects === "boolean") internalPackageInfo.hasModuleSideEffects = () => packageSideEffects;
		else if (Array.isArray(packageSideEffects)) internalPackageInfo.hasModuleSideEffects = createFilter$2(packageSideEffects.map((sideEffect) => {
			if (sideEffect.includes("/")) return sideEffect;
			return `**/${sideEffect}`;
		}), null, { resolve: pkgRoot });
	}
	cache.set(pkgPath, internalPackageInfo);
	return internalPackageInfo;
}
function normalizeInput(input) {
	if (Array.isArray(input)) return input;
	else if (typeof input === "object") return Object.values(input);
	return [input];
}
function isModuleDir(current, moduleDirs) {
	return moduleDirs.some((dir) => current.endsWith(dir));
}
async function findPackageJson(base, moduleDirs) {
	const { root } = path$1.parse(base);
	let current = base;
	while (current !== root && !isModuleDir(current, moduleDirs)) {
		const pkgJsonPath = path$1.join(current, "package.json");
		if (await fileExists(pkgJsonPath)) {
			const pkgJsonString = nativeFs.readFileSync(pkgJsonPath, "utf-8");
			return {
				pkgJson: JSON.parse(pkgJsonString),
				pkgPath: current,
				pkgJsonPath
			};
		}
		current = path$1.resolve(current, "..");
	}
	return null;
}
function isUrl(str) {
	try {
		return !!new URL(str);
	} catch (_) {
		return false;
	}
}
function isConditions(exports) {
	return typeof exports === "object" && Object.keys(exports).every((k) => !k.startsWith("."));
}
function isMappings(exports) {
	return typeof exports === "object" && !isConditions(exports);
}
function isMixedExports(exports) {
	const keys = Object.keys(exports);
	return keys.some((k) => k.startsWith(".")) && keys.some((k) => !k.startsWith("."));
}
function createBaseErrorMsg(importSpecifier, importer) {
	return `Could not resolve import "${importSpecifier}" in ${importer}`;
}
function createErrorMsg(context, reason, isImports) {
	const { importSpecifier, importer, pkgJsonPath } = context;
	return `${createBaseErrorMsg(importSpecifier, importer)} using ${isImports ? "imports" : "exports"} defined in ${pkgJsonPath}.${reason ? ` ${reason}` : ""}`;
}
var ResolveError = class extends Error {};
var InvalidConfigurationError = class extends ResolveError {
	constructor(context, reason) {
		super(createErrorMsg(context, `Invalid "exports" field. ${reason}`));
	}
};
var InvalidModuleSpecifierError = class extends ResolveError {
	constructor(context, isImports, reason) {
		super(createErrorMsg(context, reason, isImports));
	}
};
var InvalidPackageTargetError = class extends ResolveError {
	constructor(context, reason) {
		super(createErrorMsg(context, reason));
	}
};
function includesInvalidSegments(pathSegments, moduleDirs) {
	const invalidSegments = [
		"",
		".",
		"..",
		...moduleDirs
	];
	return pathSegments.some((v) => invalidSegments.includes(v) || invalidSegments.includes(decodeURI(v)));
}
async function resolvePackageTarget(context, { target, patternMatch, isImports }) {
	if (typeof target === "string") {
		if (!target.startsWith("./")) {
			if (!isImports || ["/", "../"].some((p) => target.startsWith(p)) || isUrl(target)) throw new InvalidPackageTargetError(context, `Invalid mapping: "${target}".`);
			if (typeof patternMatch === "string") {
				const result = await context.resolveId(target.replace(/\*/g, patternMatch), context.pkgURL.href);
				return result ? pathToFileURL$1(result.location).href : null;
			}
			const result = await context.resolveId(target, context.pkgURL.href);
			return result ? pathToFileURL$1(result.location).href : null;
		}
		if (context.allowExportsFolderMapping) target = target.replace(/\/$/, "/*");
		{
			const pathSegments = target.split(/\/|\\/);
			const firstDot = pathSegments.indexOf(".");
			firstDot !== -1 && pathSegments.slice(firstDot);
			if (firstDot !== -1 && firstDot < pathSegments.length - 1 && includesInvalidSegments(pathSegments.slice(firstDot + 1), context.moduleDirs)) throw new InvalidPackageTargetError(context, `Invalid mapping: "${target}".`);
		}
		const resolvedTarget = new URL(target, context.pkgURL);
		if (!resolvedTarget.href.startsWith(context.pkgURL.href)) throw new InvalidPackageTargetError(context, `Resolved to ${resolvedTarget.href} which is outside package ${context.pkgURL.href}`);
		if (!patternMatch) return resolvedTarget;
		if (includesInvalidSegments(patternMatch.split(/\/|\\/), context.moduleDirs)) throw new InvalidModuleSpecifierError(context);
		return resolvedTarget.href.replace(/\*/g, patternMatch);
	}
	if (Array.isArray(target)) {
		if (target.length === 0) return null;
		let lastError = null;
		for (const item of target) try {
			const resolved = await resolvePackageTarget(context, {
				target: item,
				patternMatch,
				isImports
			});
			if (resolved !== void 0) return resolved;
		} catch (error) {
			if (!(error instanceof InvalidPackageTargetError)) throw error;
			else lastError = error;
		}
		if (lastError) throw lastError;
		return null;
	}
	if (target && typeof target === "object") {
		for (const [key, value] of Object.entries(target)) if (key === "default" || context.conditions.includes(key)) {
			const resolved = await resolvePackageTarget(context, {
				target: value,
				patternMatch,
				isImports
			});
			if (resolved !== void 0) return resolved;
		}
		return;
	}
	if (target === null) return null;
	throw new InvalidPackageTargetError(context, `Invalid exports field.`);
}
function nodePatternKeyCompare(keyA, keyB) {
	const baseLengthA = keyA.includes("*") ? keyA.indexOf("*") + 1 : keyA.length;
	const rval = (keyB.includes("*") ? keyB.indexOf("*") + 1 : keyB.length) - baseLengthA;
	if (rval !== 0) return rval;
	if (!keyA.includes("*")) return 1;
	if (!keyB.includes("*")) return -1;
	return keyB.length - keyA.length;
}
async function resolvePackageImportsExports(context, { matchKey, matchObj, isImports }) {
	if (!matchKey.includes("*") && matchKey in matchObj) {
		const target = matchObj[matchKey];
		return await resolvePackageTarget(context, {
			target,
			patternMatch: "",
			isImports
		});
	}
	const expansionKeys = Object.keys(matchObj).filter((k) => k.endsWith("/") || k.includes("*")).sort(nodePatternKeyCompare);
	for (const expansionKey of expansionKeys) {
		const indexOfAsterisk = expansionKey.indexOf("*");
		const patternBase = indexOfAsterisk === -1 ? expansionKey : expansionKey.substring(0, indexOfAsterisk);
		if (matchKey.startsWith(patternBase) && matchKey !== patternBase) {
			const patternTrailer = indexOfAsterisk !== -1 ? expansionKey.substring(indexOfAsterisk + 1) : "";
			if (patternTrailer.length === 0 || matchKey.endsWith(patternTrailer) && matchKey.length >= expansionKey.length) {
				const target = matchObj[expansionKey];
				return await resolvePackageTarget(context, {
					target,
					patternMatch: matchKey.substring(patternBase.length, matchKey.length - patternTrailer.length),
					isImports
				});
			}
		}
	}
	throw new InvalidModuleSpecifierError(context, isImports);
}
async function resolvePackageExports(context, subpath, exports) {
	if (isMixedExports(exports)) throw new InvalidConfigurationError(context, "All keys must either start with ./, or without one.");
	if (subpath === ".") {
		let mainExport;
		if (typeof exports === "string" || Array.isArray(exports) || isConditions(exports)) mainExport = exports;
		else if (isMappings(exports)) mainExport = exports["."];
		if (mainExport) {
			const resolved = await resolvePackageTarget(context, {
				target: mainExport,
				patternMatch: "",
				isImports: false
			});
			if (resolved) return resolved;
		}
	} else if (isMappings(exports)) {
		const resolvedMatch = await resolvePackageImportsExports(context, {
			matchKey: subpath,
			matchObj: exports,
			isImports: false
		});
		if (resolvedMatch) return resolvedMatch;
	}
	throw new InvalidModuleSpecifierError(context);
}
async function resolvePackageImports({ importSpecifier, importer, moduleDirs, conditions, resolveId }) {
	const result = await findPackageJson(importer, moduleDirs);
	if (!result) throw new Error(`${createBaseErrorMsg(importSpecifier, importer)}. Could not find a parent package.json.`);
	const { pkgPath, pkgJsonPath, pkgJson } = result;
	const context = {
		importer,
		importSpecifier,
		moduleDirs,
		pkgURL: pathToFileURL$1(`${pkgPath}/`),
		pkgJsonPath,
		conditions,
		resolveId
	};
	if (!importSpecifier.startsWith("#")) throw new InvalidModuleSpecifierError(context, true, "Invalid import specifier.");
	if (importSpecifier === "#" || importSpecifier.startsWith("#/")) throw new InvalidModuleSpecifierError(context, true, "Invalid import specifier.");
	const { imports } = pkgJson;
	if (!imports) throw new InvalidModuleSpecifierError(context, true);
	return resolvePackageImportsExports(context, {
		matchKey: importSpecifier,
		matchObj: imports,
		isImports: true
	});
}
const resolveImportPath = promisify$1(import_resolve.default);
const readFile$2 = promisify$1(nativeFs.readFile);
async function getPackageJson(importer, pkgName, resolveOptions, moduleDirectories) {
	if (importer) {
		const selfPackageJsonResult = await findPackageJson(importer, moduleDirectories);
		if (selfPackageJsonResult && selfPackageJsonResult.pkgJson.name === pkgName) return selfPackageJsonResult;
	}
	try {
		const pkgJsonPath = await resolveImportPath(`${pkgName}/package.json`, resolveOptions);
		return {
			pkgJsonPath,
			pkgJson: JSON.parse(await readFile$2(pkgJsonPath, "utf-8")),
			pkgPath: dirname$1(pkgJsonPath)
		};
	} catch (_) {
		return null;
	}
}
async function resolveIdClassic({ importSpecifier, packageInfoCache, extensions, mainFields, preserveSymlinks, useBrowserOverrides, baseDir, moduleDirectories, modulePaths, rootDir, ignoreSideEffectsForRoot }) {
	let hasModuleSideEffects = () => null;
	let hasPackageEntry = true;
	let packageBrowserField = false;
	let packageInfo;
	const filter = (pkg, pkgPath) => {
		const info = getPackageInfo({
			cache: packageInfoCache,
			extensions,
			pkg,
			pkgPath,
			mainFields,
			preserveSymlinks,
			useBrowserOverrides,
			rootDir,
			ignoreSideEffectsForRoot
		});
		({packageInfo, hasModuleSideEffects, hasPackageEntry, packageBrowserField} = info);
		return info.cachedPkg;
	};
	const resolveOptions = {
		basedir: baseDir,
		readFile: readCachedFile,
		isFile: isFileCached,
		isDirectory: isDirCached,
		extensions,
		includeCoreModules: false,
		moduleDirectory: moduleDirectories,
		paths: modulePaths,
		preserveSymlinks,
		packageFilter: filter
	};
	let location;
	try {
		location = await resolveImportPath(importSpecifier, resolveOptions);
	} catch (error) {
		if (error.code !== "MODULE_NOT_FOUND") throw error;
		return null;
	}
	return {
		location: preserveSymlinks ? location : await resolveSymlink(location),
		hasModuleSideEffects,
		hasPackageEntry,
		packageBrowserField,
		packageInfo
	};
}
async function resolveWithExportMap({ importer, importSpecifier, exportConditions, packageInfoCache, extensions, mainFields, preserveSymlinks, useBrowserOverrides, baseDir, moduleDirectories, modulePaths, rootDir, ignoreSideEffectsForRoot, allowExportsFolderMapping }) {
	if (importSpecifier.startsWith("#")) {
		const resolveResult = await resolvePackageImports({
			importSpecifier,
			importer,
			moduleDirs: moduleDirectories,
			conditions: exportConditions,
			resolveId(id) {
				return resolveImportSpecifiers({
					importer,
					importSpecifierList: [id],
					exportConditions,
					packageInfoCache,
					extensions,
					mainFields,
					preserveSymlinks,
					useBrowserOverrides,
					baseDir,
					moduleDirectories,
					modulePaths,
					rootDir,
					ignoreSideEffectsForRoot,
					allowExportsFolderMapping
				});
			}
		});
		if (resolveResult == null) throw new ResolveError(`Could not resolve import "${importSpecifier}" in ${importer} using imports.`);
		const location = fileURLToPath$1(resolveResult);
		return {
			location: preserveSymlinks ? location : await resolveSymlink(location),
			hasModuleSideEffects: () => null,
			hasPackageEntry: true,
			packageBrowserField: false,
			packageInfo: void 0
		};
	}
	const pkgName = getPackageName(importSpecifier);
	if (pkgName) {
		let hasModuleSideEffects = () => null;
		let hasPackageEntry = true;
		let packageBrowserField = false;
		let packageInfo;
		const filter = (pkg, pkgPath) => {
			const info = getPackageInfo({
				cache: packageInfoCache,
				extensions,
				pkg,
				pkgPath,
				mainFields,
				preserveSymlinks,
				useBrowserOverrides,
				rootDir,
				ignoreSideEffectsForRoot
			});
			({packageInfo, hasModuleSideEffects, hasPackageEntry, packageBrowserField} = info);
			return info.cachedPkg;
		};
		const result = await getPackageJson(importer, pkgName, {
			basedir: baseDir,
			readFile: readCachedFile,
			isFile: isFileCached,
			isDirectory: isDirCached,
			extensions,
			includeCoreModules: false,
			moduleDirectory: moduleDirectories,
			paths: modulePaths,
			preserveSymlinks,
			packageFilter: filter
		}, moduleDirectories);
		if (result && result.pkgJson.exports) {
			const { pkgJson, pkgJsonPath } = result;
			const subpath = pkgName === importSpecifier ? "." : `.${importSpecifier.substring(pkgName.length)}`;
			const location = fileURLToPath$1(await resolvePackageExports({
				importer,
				importSpecifier,
				moduleDirs: moduleDirectories,
				pkgURL: pathToFileURL$1(pkgJsonPath.replace("package.json", "")),
				pkgJsonPath,
				allowExportsFolderMapping,
				conditions: exportConditions
			}, subpath, pkgJson.exports));
			if (location) return {
				location: preserveSymlinks ? location : await resolveSymlink(location),
				hasModuleSideEffects,
				hasPackageEntry,
				packageBrowserField,
				packageInfo
			};
		}
	}
	return null;
}
async function resolveWithClassic({ importer, importSpecifierList, exportConditions, warn, packageInfoCache, extensions, mainFields, preserveSymlinks, useBrowserOverrides, baseDir, moduleDirectories, modulePaths, rootDir, ignoreSideEffectsForRoot }) {
	for (let i = 0; i < importSpecifierList.length; i++) {
		const result = await resolveIdClassic({
			importer,
			importSpecifier: importSpecifierList[i],
			exportConditions,
			warn,
			packageInfoCache,
			extensions,
			mainFields,
			preserveSymlinks,
			useBrowserOverrides,
			baseDir,
			moduleDirectories,
			modulePaths,
			rootDir,
			ignoreSideEffectsForRoot
		});
		if (result) return result;
	}
	return null;
}
async function resolveImportSpecifiers({ importer, importSpecifierList, exportConditions, warn, packageInfoCache, extensions, mainFields, preserveSymlinks, useBrowserOverrides, baseDir, moduleDirectories, modulePaths, rootDir, ignoreSideEffectsForRoot, allowExportsFolderMapping }) {
	try {
		const exportMapRes = await resolveWithExportMap({
			importer,
			importSpecifier: importSpecifierList[0],
			exportConditions,
			packageInfoCache,
			extensions,
			mainFields,
			preserveSymlinks,
			useBrowserOverrides,
			baseDir,
			moduleDirectories,
			modulePaths,
			rootDir,
			ignoreSideEffectsForRoot,
			allowExportsFolderMapping
		});
		if (exportMapRes) return exportMapRes;
	} catch (error) {
		if (error instanceof ResolveError) {
			warn(error);
			return null;
		}
		throw error;
	}
	return resolveWithClassic({
		importer,
		importSpecifierList,
		exportConditions,
		warn,
		packageInfoCache,
		extensions,
		mainFields,
		preserveSymlinks,
		useBrowserOverrides,
		baseDir,
		moduleDirectories,
		modulePaths,
		rootDir,
		ignoreSideEffectsForRoot
	});
}
const versionRegexp = /\^(\d+\.\d+\.\d+)/g;
function validateVersion(actualVersion, peerDependencyVersion) {
	let minMajor = Infinity;
	let minMinor = Infinity;
	let minPatch = Infinity;
	let foundVersion;
	while (foundVersion = versionRegexp.exec(peerDependencyVersion)) {
		const [foundMajor, foundMinor, foundPatch] = foundVersion[1].split(".").map(Number);
		if (foundMajor < minMajor) {
			minMajor = foundMajor;
			minMinor = foundMinor;
			minPatch = foundPatch;
		}
	}
	if (!actualVersion) throw new Error(`Insufficient Rollup version: "@rollup/plugin-node-resolve" requires at least rollup@${minMajor}.${minMinor}.${minPatch}.`);
	const [major, minor, patch] = actualVersion.split(".").map(Number);
	if (major < minMajor || major === minMajor && (minor < minMinor || minor === minMinor && patch < minPatch)) throw new Error(`Insufficient rollup version: "@rollup/plugin-node-resolve" requires at least rollup@${minMajor}.${minMinor}.${minPatch} but found rollup@${actualVersion}.`);
}
const ES6_BROWSER_EMPTY = "\0node-resolve:empty.js";
const deepFreeze = (object) => {
	Object.freeze(object);
	for (const value of Object.values(object)) if (typeof value === "object" && !Object.isFrozen(value)) deepFreeze(value);
	return object;
};
const baseConditions = ["default", "module"];
const baseConditionsEsm = [...baseConditions, "import"];
const baseConditionsCjs = [...baseConditions, "require"];
const defaults = {
	dedupe: [],
	extensions: [
		".mjs",
		".js",
		".json",
		".node"
	],
	resolveOnly: [],
	moduleDirectories: ["node_modules"],
	modulePaths: [],
	ignoreSideEffectsForRoot: false,
	allowExportsFolderMapping: true
};
const nodeImportPrefix = /^node:/;
deepFreeze((0, import_cjs.default)({}, defaults));
function nodeResolve(opts = {}) {
	const { warnings } = handleDeprecatedOptions(opts);
	const options = {
		...defaults,
		...opts
	};
	const { extensions, jail, moduleDirectories, modulePaths, ignoreSideEffectsForRoot } = options;
	const exportConditions = options.exportConditions || [];
	const devProdCondition = exportConditions.includes("development") || exportConditions.includes("production") ? [] : [process.env.NODE_ENV && process.env.NODE_ENV !== "production" ? "development" : "production"];
	const conditionsEsm = [
		...baseConditionsEsm,
		...exportConditions,
		...devProdCondition
	];
	const conditionsCjs = [
		...baseConditionsCjs,
		...exportConditions,
		...devProdCondition
	];
	const packageInfoCache = /* @__PURE__ */ new Map();
	const idToPackageInfo = /* @__PURE__ */ new Map();
	const mainFields = getMainFields(options);
	const useBrowserOverrides = mainFields.indexOf("browser") !== -1;
	const isPreferBuiltinsSet = Object.prototype.hasOwnProperty.call(options, "preferBuiltins");
	const preferBuiltins = isPreferBuiltinsSet ? options.preferBuiltins : true;
	const rootDir = resolve$1(options.rootDir || process.cwd());
	let { dedupe } = options;
	let rollupOptions;
	if (moduleDirectories.some((name) => name.includes("/"))) throw new Error("`moduleDirectories` option must only contain directory names. If you want to load modules from somewhere not supported by the default module resolution algorithm, see `modulePaths`.");
	if (typeof dedupe !== "function") dedupe = (importee) => options.dedupe.includes(importee) || options.dedupe.includes(getPackageName(importee));
	const allowPatterns = (patterns) => {
		const regexPatterns = patterns.map((pattern) => {
			if (pattern instanceof RegExp) return pattern;
			const normalized = pattern.replace(/[\\^$*+?.()|[\]{}]/g, "\\$&");
			return new RegExp(`^${normalized}$`);
		});
		return (id) => !regexPatterns.length || regexPatterns.some((pattern) => pattern.test(id));
	};
	const resolveOnly = typeof options.resolveOnly === "function" ? options.resolveOnly : allowPatterns(options.resolveOnly);
	const browserMapCache = /* @__PURE__ */ new Map();
	let preserveSymlinks;
	const resolveLikeNode = async (context, importee, importer, custom) => {
		const [importPath, params] = importee.split("?");
		const importSuffix = `${params ? `?${params}` : ""}`;
		importee = importPath;
		const baseDir = !importer || dedupe(importee) ? rootDir : dirname$1(importer);
		const browser = browserMapCache.get(importer);
		if (useBrowserOverrides && browser) {
			const resolvedImportee = resolve$1(baseDir, importee);
			if (browser[importee] === false || browser[resolvedImportee] === false) return { id: ES6_BROWSER_EMPTY };
			const browserImportee = importee[0] !== "." && browser[importee] || browser[resolvedImportee] || browser[`${resolvedImportee}.js`] || browser[`${resolvedImportee}.json`];
			if (browserImportee) importee = browserImportee;
		}
		const parts = importee.split(/[/\\]/);
		let id = parts.shift();
		let isRelativeImport = false;
		if (id[0] === "@" && parts.length > 0) id += `/${parts.shift()}`;
		else if (id[0] === ".") {
			id = resolve$1(baseDir, importee);
			isRelativeImport = true;
		}
		if (!isRelativeImport && !resolveOnly(id)) {
			if (normalizeInput(rollupOptions.input).includes(importee)) return null;
			return false;
		}
		const importSpecifierList = [importee];
		if (importer === void 0 && importee[0] && !importee[0].match(/^\.?\.?\//)) importSpecifierList.push(`./${importee}`);
		if (importer && /\.(ts|mts|cts|tsx)$/.test(importer)) {
			for (const [importeeExt, resolvedExt] of [
				[".js", ".ts"],
				[".js", ".tsx"],
				[".jsx", ".tsx"],
				[".mjs", ".mts"],
				[".cjs", ".cts"]
			]) if (importee.endsWith(importeeExt) && extensions.includes(resolvedExt)) importSpecifierList.push(importee.slice(0, -importeeExt.length) + resolvedExt);
		}
		const warn = (...args) => context.warn(...args);
		const exportConditions = custom && custom["node-resolve"] && custom["node-resolve"].isRequire ? conditionsCjs : conditionsEsm;
		if (useBrowserOverrides && !exportConditions.includes("browser")) exportConditions.push("browser");
		const resolvedWithoutBuiltins = await resolveImportSpecifiers({
			importer,
			importSpecifierList,
			exportConditions,
			warn,
			packageInfoCache,
			extensions,
			mainFields,
			preserveSymlinks,
			useBrowserOverrides,
			baseDir,
			moduleDirectories,
			modulePaths,
			rootDir,
			ignoreSideEffectsForRoot,
			allowExportsFolderMapping: options.allowExportsFolderMapping
		});
		const importeeIsBuiltin = builtinModules$1.includes(importee.replace(nodeImportPrefix, ""));
		const preferImporteeIsBuiltin = typeof preferBuiltins === "function" ? preferBuiltins(importee) : preferBuiltins;
		const resolved = importeeIsBuiltin && preferImporteeIsBuiltin ? {
			packageInfo: void 0,
			hasModuleSideEffects: () => null,
			hasPackageEntry: true,
			packageBrowserField: false
		} : resolvedWithoutBuiltins;
		if (!resolved) return null;
		const { packageInfo, hasModuleSideEffects, hasPackageEntry, packageBrowserField } = resolved;
		let { location } = resolved;
		if (packageBrowserField) {
			if (Object.prototype.hasOwnProperty.call(packageBrowserField, location)) {
				if (!packageBrowserField[location]) {
					browserMapCache.set(location, packageBrowserField);
					return { id: ES6_BROWSER_EMPTY };
				}
				location = packageBrowserField[location];
			}
			browserMapCache.set(location, packageBrowserField);
		}
		if (hasPackageEntry && !preserveSymlinks) {
			if (await fileExists(location)) location = await realpath$1(location);
		}
		idToPackageInfo.set(location, packageInfo);
		if (hasPackageEntry) {
			if (importeeIsBuiltin && preferImporteeIsBuiltin) {
				if (!isPreferBuiltinsSet && resolvedWithoutBuiltins && resolved !== importee) context.warn({
					message: `preferring built-in module '${importee}' over local alternative at '${resolvedWithoutBuiltins.location}', pass 'preferBuiltins: false' to disable this behavior or 'preferBuiltins: true' to disable this warning.or passing a function to 'preferBuiltins' to provide more fine-grained control over which built-in modules to prefer.`,
					pluginCode: "PREFER_BUILTINS"
				});
				return false;
			} else if (jail && location.indexOf(normalize$1(jail.trim(sep$1))) !== 0) return null;
		}
		if (options.modulesOnly && await fileExists(location)) {
			if ((0, import_is_module.default)(await readFile$1(location, "utf-8"))) return {
				id: `${location}${importSuffix}`,
				moduleSideEffects: hasModuleSideEffects(location)
			};
			return null;
		}
		return {
			id: `${location}${importSuffix}`,
			moduleSideEffects: hasModuleSideEffects(location)
		};
	};
	return {
		name: "node-resolve",
		version,
		buildStart(buildOptions) {
			validateVersion(this.meta.rollupVersion, peerDependencies.rollup);
			rollupOptions = buildOptions;
			for (const warning of warnings) this.warn(warning);
			({preserveSymlinks} = buildOptions);
		},
		generateBundle() {
			readCachedFile.clear();
			isFileCached.clear();
			isDirCached.clear();
		},
		resolveId: {
			order: "post",
			async handler(importee, importer, resolveOptions) {
				if (importee === ES6_BROWSER_EMPTY) return importee;
				if (importee && importee.includes("\0")) return null;
				const { custom = {} } = resolveOptions;
				const { "node-resolve": { resolved: alreadyResolved } = {} } = custom;
				if (alreadyResolved) return alreadyResolved;
				if (importer && importer.includes("\0")) importer = void 0;
				const resolved = await resolveLikeNode(this, importee, importer, custom);
				if (resolved) {
					const resolvedResolved = await this.resolve(resolved.id, importer, {
						...resolveOptions,
						skipSelf: false,
						custom: {
							...custom,
							"node-resolve": {
								...custom["node-resolve"],
								resolved,
								importee
							}
						}
					});
					if (resolvedResolved) {
						if (resolvedResolved.external) return false;
						if (resolvedResolved.id !== resolved.id) return resolvedResolved;
						return {
							...resolved,
							meta: resolvedResolved.meta
						};
					}
				}
				return resolved;
			}
		},
		load(importee) {
			if (importee === ES6_BROWSER_EMPTY) return "export default {};";
			return null;
		},
		getPackageInfoForId(id) {
			return idToPackageInfo.get(id);
		}
	};
}
export { escapeStringRegexp as A, a$1 as B, compileRouterToString as C, findRoute as D, findAllRoutes as E, dist_exports$4 as F, json5_exports as H, loadConfig as I, watchConfig as L, formatCompatibilityDate as M, resolveCompatibilityDates as N, TSConfckCache as O, resolveCompatibilityDatesFromEnv as P, i as R, dist_exports$3 as S, createRouter as T, yaml_exports as V, z$1 as _, detect_acorn_exports as a, watch$1 as b, es_exports as c, dist_exports$2 as d, runtime_exports as f, P$1 as g, runMain as h, unplugin_exports as i, klona as j, parse$2 as k, inject as l, defineCommand as m, json as n, dist_exports as o, assetsPlugin as p, commonjs as r, ohash_exports as s, nodeResolve as t, alias as u, debounce as v, addRoute as w, createProxyServer as x, chokidar_exports as y, toml_exports as z };
