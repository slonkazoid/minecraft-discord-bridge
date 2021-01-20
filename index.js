#!/usr/bin/env node
const { Webhook, MessageBuilder } = require("discord-webhook-node");
let hook = new Webhook(process.env.HOOK);
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
bot.on("error", console.error);
bot.once("kicked", console.log);
console.log("BOT STARTED");

function onSpawn() {
	console.log("BOT SPAWNED");
	rl.on("line", bot.chat);
	bot.on("chat", (u, s) => {
		console.log(u, s);
		if (hook) {
			hook.setUsername(u);
			hook.send(s.replace(/(@everyone)|(@here)|(<@.{0,1}[0-9]{18}>)/g, "[PING]"));
		}
	});
}
function onEnd() {
	console.log("BOT END");
}
