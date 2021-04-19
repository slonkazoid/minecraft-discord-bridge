const { Webhook } = require("discord-webhook-node");
const hooks = {};
module.exports = /**
 * @param {String} hook
 * @returns {Webhook}
 */ hook => (hooks[hook] ? hooks[hook] : (hooks[hook] = new Webhook(hook)));
