#!/usr/bin/env node
const mineflayer = require("mineflayer");
const bot = mineflayer.createBot({
	host: process.env.HOST,
	username: process.env.USER,
	password: process.env.PASS,
});
bot.once("login", () => console.log("LOGGED IN"));
bot.once("spawn", onSpawn);
bot.once("end", onEnd);
bot.on("error", console.error);
bot.once("kicked", console.log);
console.log("BOT STARTED");

function onSpawn() {
	console.log("BOT SPAWNED");
}
function onEnd() {
	console.log("BOT END");
}
