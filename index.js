#!/usr/bin/env node
const { bots, options } = require("./config");
const { log, progress } = require("./logging");
const { fork } = require("child_process");
let processes = [];
progress("Loading bots...", false, true);
bots.forEach((bot, idx) => {
	progress(`Loading bots... (${idx}/${bots.length})`, false, true);
	let proc = fork("bot.js");
	proc.on("message", console.log);
	processes[idx] = proc;
});
progress("Loading bots... Done!", true, true);
