if (!process.send) {
	console.log("This process must be forked with child_process.");
	process.exit();
}
const { MessageBuilder, Webhook } = require("discord-webhook-node");
const mineflayer = require("mineflayer");

const COLORS = {
	join: 0x00ff00,
	leave: 0xff0000,
	message: 0x00ffff,
};
const HOOK_MAXLEN = 2000;
const TEXT_MAXLEN = 2048;

/**
 * @param {*} [message]
 * @param {Boolean} [debug]
 */
function logAs(message, debug = false) {
	process.send({
		type: "log",
		debug: debug,
		message: message,
	});
}
/**
 * @param {String} uuid
 * @returns {String}
 */
function getAvatar(uuid) {
	return `https://mc-heads.net/avatar/${player.uuid}/512`;
}
/**
 * @param {mineflayer.Player} player
 * @returns {MessageBuilder}
 */
function userEmbed(player) {
	return new MessageBuilder().setAuthor(
		player.username,
		getAvatar(player.uuid)
	);
}
/**
 * @param {mineflayer.Player} player
 * @param {Webhook} hook
 * @returns {Webhook}
 */
Webhook.prototype.personalize = function (player, hook = this) {
	hook.setAvatar(getAvatar(player.uuid));
	hook.setUsername(player.username);
};
/**
 * @param {String} json
 * @returns {Object}
 */
function unsafe_parse(json) {
	let data;
	try {
		data = JSON.parse(json);
	} catch {}
	return data;
}

/**
 * @param {Object|String} o
 * @returns {String}
 */
function getText(o) {
	let obj;
	if ((obj = unsafe_parse(o)))
		return (obj.extra?.map(ex => ex.text).join("") || "") + (o.text || "");
	else return o;
}

process.once(
	"message",
	/** @param {import("./config").Bot} botConfig */ botConfig => {
		let hook = botConfig.webhook;
		const bot = mineflayer.createBot(botConfig.login);
		if (botConfig.storeSession)
			bot._client.once("session", s => {
				process.send({ type: "session", session: s });
			});
		bot.once("login", () => {
			process.send({ type: "login" });
			hook.send("Logged in to " + process.env.HOST);
		});
		bot.once("spawn", () => {
			process.send({ type: "spawn" });
			hook.send("Bot Spawned");
		});
		bot.once("end", () => {
			process.send({ type: "end" });
			hook.send("Bot Ended");
			process.exit();
		});
		bot.on("error", err => console.error(err));
		bot.once("kicked", reason => {
			process.send({ type: "kicked", reason: getText(reason) });
			hook.send(
				`Bot Kicked for reason: ${getText(reason)}`.substring(0, TEXT_MAXLEN)
			);
		});

		bot.on("playerJoined", async p => {
			process.send({ type: "join", username: p.username });
			if (botConfig.messageType === "embed")
				hook.send(
					userEmbed(p).setDescription("Joined the game").setColor(COLORS.join)
				);
			else {
				hook.setAvatar();
				hook.setUsername("Server");
				hook.send(p.username + " joined the game");
			}
		});
		bot.on("playerLeft", async p => {
			process.send({ type: "leave", username: p.username });
			if (botConfig.messageType === "embed")
				hook.send(
					userEmbed(p).setDescription("Left the game").setColor(COLORS.leave)
				);
			else {
				hook.setAvatar();
				hook.setUsername("Server");
				hook.send(p.username + " left the game");
			}
		});
		bot.on("chat", async (u, s) => {
			let player = bot.players[u];
			if (!player) return;
			process.send({ type: "chat", username: u, message: s });
			if (botConfig.messageType === "embed")
				hook.send(
					userEmbed(player)
						.setDescription(s.substr(0, HOOK_MAXLEN))
						.setColor(COLORS.message)
				);
			else {
				hook.personalize(player);
				hook.send(s.substring(0, TEXT_MAXLEN));
			}
		});
	}
);
