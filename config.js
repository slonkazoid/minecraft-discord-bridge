const { existsSync } = require("fs");
const { join } = require("path");
if (!existsSync(join(__dirname, "./config.json"))) {
	throw new Error(
		"Configuration file not found. Please consult the README.md file."
	);
}
const conf = require("./config.json");
if(!conf.hooks) {
    throw new Error("No webhooks found.")
}
module.exports = {
    
}