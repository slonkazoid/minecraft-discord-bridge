#!/usr/bin/env node
const mineflayer = require("mineflayer");
const bot = mineflayer.createBot({
	host: process.env.HOST,
	username: process.env.USER,
	password: process.env.PASS,
});
