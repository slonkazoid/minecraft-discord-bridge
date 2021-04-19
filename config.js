const { existsSync } = require("fs");
const { join } = require("path");
const { log, progress } = require("./logging");
if (!existsSync(join(__dirname, "./config.json"))) {
	throw new Error(
		"Configuration file not found. Please consult the README.md file."
	);
}

/**
 * @typedef {Object} BotReference
 * @property {String} username
 * @property {String|null} [password]
 * @property {Boolean} [autoReconnect]
 * @property {Object} server
 * @property {String} webhook
 * @property {Boolean} [setNameToServer]
 * @property {String} [messageType]
 * @property {Boolean} [storeSession]
 *
 * @typedef {Object} LoginInfo
 * @property {String} username
 * @property {String|Boolean} password
 * @property {String} host
 * @property {Number} port
 * @property {String|Boolean} version
 *
 * @typedef {Object} Bot
 * @property {LoginInfo} login
 * @property {Boolean} autoReconnect
 * @property {String} host
 * @property {Number} port
 * @property {String} webhook
 * @property {Boolean} setNameToServer
 * @property {String} messageType
 * @property {Boolean} storeSession
 *
 * @typedef {Object} Options
 * @property {Boolean} debug
 * @property {Boolean} daemonize
 * @property {Boolean} shell
 *
 * @typedef {Object} Config
 * @property {Object} hooks
 * @property {Object} servers
 * @property {BotReference[]} bots
 * @property {BotReference} global
 * @property {Options} options
 */

log("Loading configuration...");

/**
 * @type {Config}
 */
const conf = require("./config.json");

/**
 * @type {Options}
 */
let options = {};
options.debug = conf.options?.debug || false;
options.debug = conf.options?.daemonize || false;
options.debug = conf.options?.shell || true;
global.debug = options.debug;
// Debug messages will work after this point

if (
	!conf.hooks ||
	!(conf.hooks instanceof Object) ||
	Object.keys(conf.hooks)?.length === 0
)
	throw new Error("No webhooks found.");
if (
	!conf.servers ||
	!(conf.servers instanceof Object) ||
	Object.keys(conf.servers)?.length === 0
)
	throw new Error("No servers found.");
if (!conf.bots || !(conf.bots instanceof Array) || conf.bots?.length === 0)
	throw new Error("No bots found.");

let servers = {};
for (key in conf.servers) {
	if (conf.servers.hasOwnProperty(key)) {
		let server = conf.servers[key];
		if (typeof server !== "object" || !server.host)
			throw new Error("Invalid server " + key + ".");
		servers[key] = server;
	}
}

/**
 * @param {BotReference} _bot
 * @returns {Bot}
 */
function parseBot(_bot) {
	let bot = Object.assign({}, _bot);
	let server = servers[bot.server] || servers[conf.global.server];
	bot.login = {
		username: bot.username || conf.global.username,
		password: bot.password || conf.global.password || false,
		host: server.host,
		port: server.port || 25565,
		version: server.version || false,
	};
	delete bot.server;
	bot.webhook = conf.hooks[bot.webhook] || conf.hooks[conf.global.webhook];
	bot.autoReconnect = bot.autoReconnect || conf.global.autoReconnect || true;
	bot.reconnectDelay = bot.reconnectDelay || conf.global.reconnectDelay || 5000;
	bot.setNameToServer =
		bot.setNameToServer || conf.global.setNameToServer || false;
	bot.messageType = bot.messageType || conf.global.messageType || "embed";
	bot.storeSession = bot.storeSession || conf.global.storeSession || true;
	console.log(bot.webhook.send);
	if (!bot.login.username || !bot.login.host || !bot.webhook)
		throw new Error("Invalid bot object");
	log("Parsed bot", true);
	return bot;
}

/**
 * @type {Bot[]}
 */
let bots = conf.bots.map(parseBot);

module.exports = {
	bots: bots,
	options: conf.options,
};
log("Loading configuration... Done!");
