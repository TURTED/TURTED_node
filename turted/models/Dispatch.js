var Collection = require('./Collection');

/**
 * A paket to deliver to the intended targets. Consists of an event and a payload
 * Internally, it keeps a list of connections to be delivered to
 * @param e
 * @param payload
 * @param targets
 * @constructor
 */
var Dispatch = function(e,payload,targets) {
    this._connections = new Collection();
    this._payload = payload;
    this._targets = targets;
	console.log("This event " + e + " goes to:");
	console.log(targets);
	console.log("Its payload: ");
	console.log(payload);
};

module.exports = Dispatch;
