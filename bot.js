if (!process.send) {
	console.log("This process must be forked with child_process.");
	process.exit();
}
const { Webhook, MessageBuilder } = require("discord-webhook-node");
const mineflayer = require("mineflayer");
function userEmbed(player = bot.player) {
	return new MessageBuilder().setAuthor(
		player.username,
		`https://mc-heads.net/avatar/${player.uuid}/512`
	);
}
function unsafe_parse(json) {
	let data;
	try {
		data = JSON.parse(json);
	} catch {}
	return data;
}
function getText(o) {
	let obj;
	if ((obj = unsafe_parse(o)))
		return (obj.extra?.map(ex => ex.text).join("") || "") + (o.text || "");
	else return o;
}

process.once("message", cfg => {
	const bot = mineflayer.createBot(cfg);
	bot._client.once("");
	bot.once("login", () => {
		console.log("LOGGED IN");
		hook.send("Logged in to " + process.env.HOST);
		rl.on("line", bot.chat);
	});
	bot.once("spawn", () => {
		console.log("BOT SPAWNED");
		hook.send("Bot Spawned");
	});
	bot.once("end", () => {
		console.log("BOT END");
		hook.send("Bot End");
	});
	bot.on("error", err => console.error(err));
	bot.once("kicked", reason => {
		console.log(reason);
		hook.send(`Bot Kicked for reason: ${getText()}`);
	});

	bot.on("playerJoined", async p => {
		console.log("[+] " + p.username);
		hook.send(
			userEmbed(p).setDescription("joined the game.").setColor(0x00ff00)
		);
	});
	bot.on("playerLeft", async p => {
		console.log("[-] " + p.username);
		hook.send(userEmbed(p).setDescription("left the game.").setColor(0xff0000));
	});
	bot.on("chat", async (u, s) => {
		let player = bot.players[u];
		if (!player) return;
		let filtered = s
			//.replace(/(@everyone)|(@here)|(<@.{0,1}[0-9]{18}>)/g, "[PING]")
			.substr(0, 2000);
		console.log(u, s);
		hook.send(userEmbed(player).setDescription(filtered).setColor(0x00ffff));
	});
});
