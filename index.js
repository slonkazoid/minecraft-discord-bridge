#!/usr/bin/env node
const { bots, options } = require("./config");
const { log, progress } = require("./logging");
const { Worker } = require("worker_threads");
const readline = require("readline");
/**
 * @typedef {Object} ClientMessage
 * @property {String} type
 * @property {String} [players]
 * @property {String} [username]
 * @property {String} [message]
 *
 * @typedef {Object} ServerMessage
 * @property {String} [message]
 * @property
 */
const activeBot = 0;
const chatActiveBot = -1;
const rl = readline.createInterface({
	input: process.stdin,
	output: process.stdout,
	/** @param {String} line  */ completer(line) {
		let arr = line.trim().split();
		if (arr.length === 0) return [["list", "ping", "chat"], line];
		if (arr[0] === "ping") {
			return activeBot[(bot.players, line)];
		} else return [[line], line];
	},
	prompt: "[" + activeBot + "] BOT> ",
});
const procs = [];
progress("Loading bots...", false, true);
bots.forEach((bot, idx) => {
	progress(`Loading bots... (${idx}/${bots.length})`, false, true);
	bot.players = [];
	let proc = new Worker("./bot.js");
	proc.postMessage(bot);
	proc.on(
		"message",
		/** @param {ClientMessage} msg */ msg => {
			log(msg, true);
			switch (msg.type) {
				case "list":
					log("Player list: " + msg.players);
					break;
				case "join":
					bot.players.push(msg.username);
					break;
				case "leave":
					let i = bot.players.findIndex(username => username === msg.username);
					if (i > -1) bot.players.splice(i, 1);
					break;
				case "ping":
					break;
			}
		}
	);
});
progress("Loading bots... Done!", true, true);
