const { Webhook } = require("discord-webhook-node");
const { existsSync } = require("fs");
const { join } = require("path");
if (!existsSync(join(__dirname, "./config.json"))) {
	throw new Error(
		"Configuration file not found. Please consult the README.md file."
	);
}

/**
 * @typedef {Object} Bot
 * @property {String} username
 * @property {String|null} password
 * @property {Boolean} autoReconnect
 * @property {Object} server
 * @property {String} host
 * @property {Number} port
 * @property {String} webhook
 * @property {Boolean} setNameToServer
 * @property {String} messageType
 *
 * @typedef {Object} Options
 * @property {Boolean} debug
 * @property {Boolean} daemonize
 * @property {Boolean} shell
 *
 * @typedef {Object} Config
 * @property {Object} hooks
 * @property {Object} servers
 * @property {Bot[]} bots
 * @property {Bot} global
 * @property {Options} options
 */

/**
 * @type {Config}
 */
const conf = require("./config.json");
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

let hooks = {};
for (key in conf.hooks) {
	if (conf.hooks.hasOwnProperty(key)) {
		let hook = conf.keys[key];
		if (
			typeof hook !== "string" ||
			!hook.match(/https:\/\/discord.com\/api\/webhooks\/\d{18}\/[\w-]{68}/)
		)
			throw new Error("Invalid webhook " + key + ".");
		try {
			hooks[key] = new Webhook(hook);
		} catch {
			throw new Error("Invalid webhook " + key + ".");
		}
	}
}

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
 * @param {Bot} bot
 */
function parseBot(bot) {
	bot.username = bot.username || conf.global.username;
	bot.password = bot.password || conf.global.password;
	let server = servers[bot.server] || servers[conf.global.server];
	bot.host = server.host;
	bot.port = server.port || 25565;
	bot.version = server.version || false;
	delete bot.server;
	bot.webhook = bot.webhook || conf.global.webhook;
	bot.autoReconnect = bot.autoReconnect || conf.global.autoReconnect || true;
	bot.reconnectDelay = bot.reconnectDelay || conf.global.reconnectDelay || 5000;
	bot.setNameToServer =
		bot.setNameToServer || conf.global.setNameToServer || false;
	bot.messageType = bot.messageType || conf.global.messageType || "embed";
	bot.storeSession = bot.storeSession || conf.global.storeSession || true;
	if (!bot.username || !bot.server || !bot.webhook)
		throw new Error("Invalid bot object");
	return bot;
}

/**
 * @type {Bot[]}
 */
let bots = conf.bots.map(parseBot);

/**
 * @type {Options}
 */
let options = {};
options.debug = conf.options?.debug || false;
options.debug = conf.options?.daemonize || false;
options.debug = conf.options?.shell || true;

module.exports = {
	bots: bots,
	options: conf.options,
};
