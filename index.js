#!/usr/bin/env node
require("dotenv").config();
const mineflayer = require("mineflayer");
const bot = mineflayer.createBot({
	host: process.env.HOST,
	username: process.env.USER,
	password: process.env.PASS,
});
const { Webhook, MessageBuilder } = require("discord-webhook-node");
const hook = new Webhook(process.env.HOOK);

function setSystem() {
	hook.setAvatar();
	hook.setUsername("<SYSTEM>");
}
function unsafe_parse(json) {
	let data;
	try {
		data = JSON.parse(json);
	} catch {}
	return data;
}

setSystem();
hook.send("Starting Bot");

const rl = require("readline").createInterface({ input: process.stdin, output: process.stdout });
bot.once("login", () => {
	console.log("LOGGED IN");
	setSystem();
	hook.send("Logged in to " + process.env.HOST);
});
bot.once("spawn", onSpawn);
bot.once("end", () => {
	console.log("BOT END");
	setSystem();
	hook.send("Bot End");
	process.exit();
});
bot.on("error", (err) => console.error(err));
bot.once("kicked", (reason) => {
	console.log(reason);
	setSystem();
	hook.send(`Bot Kicked for reason: ${unsafe_parse(reason)?.text || reason}`);
});
console.log("BOT STARTED");

async function onSpawn() {
	console.log("BOT SPAWNED");
	hook.setUsername("<SYSTEM>");
	hook.send("Bot Spawned");
	rl.on("line", bot.chat);
	bot.on("chat", async (u, s) => {
		let player = bot.players[u];
		if (!player) return;
		let filtered = s
			.replace(/(@everyone)|(@here)|(<@.{0,1}[0-9]{18}>)/g, "[PING]")
			.substr(0, 2000);
		console.log(u, s);
		hook.setAvatar(`https://mc-heads.net/avatar/${player.uuid}/512`);
		hook.setUsername(u);
		hook.send(filtered);
	});
}
