#!/usr/bin/env node
require("dotenv").config();
const mineflayer = require("mineflayer");
const bot = mineflayer.createBot({
	host: process.env.HOST,
	username: process.env.USERNAME,
	password: process.env.PASS,
});
const { Webhook, MessageBuilder } = require("discord-webhook-node");
const hook = new Webhook(process.env.HOOK);

/*function setSystem() {
	hook.setAvatar();
	hook.setUsername("<SYSTEM>");
}*/
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

hook.send("Starting Bot");

const rl = require("readline").createInterface({ input: process.stdin, output: process.stdout });
bot.once("login", () => {
	console.log("LOGGED IN");
	hook.send("Logged in to " + process.env.HOST);
});
bot.once("spawn", onSpawn);
bot.once("end", () => {
	console.log("BOT END");
	hook.send("Bot End");
});
bot.on("error", (err) => console.error(err));
bot.once("kicked", (reason) => {
	console.log(reason);
	hook.send(`Bot Kicked for reason: ${unsafe_parse(reason)?.text || reason}`);
});
console.log("BOT STARTED");

async function onSpawn() {
	console.log("BOT SPAWNED");
	hook.send("Bot Spawned");
	rl.on("line", bot.chat);
	bot.on("chat", async (u, s) => {
		let player = bot.players[u];
		if (!player) return;
		let filtered = s
			//.replace(/(@everyone)|(@here)|(<@.{0,1}[0-9]{18}>)/g, "[PING]")
			.substr(0, 2000);
		console.log(u, s);
		hook.send(userEmbed(player).setDescription(filtered).setColor(0x00ffff));
	});
	bot.on("playerJoined", async (p) => {
		console.log("[+] " + p.username);
		hook.send(userEmbed(p).setDescription("joined the game.").setColor(0x00ff00));
	});
	bot.on("playerLeft", async (p) => {
		console.log("[-] " + p.username);
		hook.send(userEmbed(p).setDescription("left the game.").setColor(0xff0000));
	});
}
