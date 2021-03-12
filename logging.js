module.exports = {
	/**
	 * @param {*} [message]
	 * @param {Boolean} [debug]
	 */
	log: function log(message, debug = false) {
		if (!global.debug && debug) return false;
		return console.log(message) || true;
	},

	/**
	 * @param {String} message
	 * @param {Boolean} [final]
	 * @param {Boolean} [debug]
	 */
	progress(message, final = false, debug = false, out = process.stdout) {
		if (!global.debug && debug) return false;
		if (!out.isTTY) return this.log(message, debug) || true;
		else {
			let windowLength = out.getWindowSize()[0];
			let lines = Math.ceil(message.length / windowLength);
			let padding = " ".repeat(lines * windowLength - message.length);
			let outString = message + padding;
			out.lastProgressLength = final ? 0 : outString.length;
			return out.write(
				`\r${" ".repeat(out.lastProgressLength)}\r${outString}${
					final ? "\n" : ""
				}`
			);
		}
	},
};
