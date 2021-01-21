#!/usr/bin/env node
const { Webhook, MessageBuilder } = require("discord-webhook-node");
const hook = new Webhook(process.env.HOOK);
const mineflayer = require("mineflayer");
const bot = mineflayer.createBot({
	host: process.env.HOST,
	username: process.env.USER,
	password: process.env.PASS,
});
const rl = require("readline").createInterface({ input: process.stdin, output: process.stdout });
bot.once("login", () => console.log("LOGGED IN"));
bot.once("spawn", onSpawn);
bot.once("end", onEnd);
bot.on("error", (err) => console.error(err));
bot.once("kicked", (reason) => console.log(reason));
console.log("BOT STARTED");

async function onSpawn() {
	console.log("BOT SPAWNED");
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
function onEnd() {
	console.log("BOT END");
}
