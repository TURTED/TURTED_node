var logger = require("./Logger");
var Collection = require('./Collection');

/**
 * A packet to deliver to the intended targets. Consists of an event and a payload
 * Internally, it keeps a list of connections to be delivered to
 * @param e
 * @param payload
 * @param targets
 * @constructor
 */
var Dispatch = function (event, payload, targets) {
    this._connections = new Collection();
    this._event = event
    this._payload = payload;
    this._targets = targets;
    logger.debug("This event " + event + " goes to:",targets);
    logger.debug("Its payload: ",payload);
};

Dispatch.prototype.isBroadcast = function () {
    return this._targets.hasOwnProperty("broadcast");
}

Dispatch.prototype.getTargetUsers = function () {
    if (this._targets.hasOwnProperty("users")) {
        return this._targets.users;
    } else {
        return [];
    }
}

Dispatch.prototype.getTargetChannels = function () {
    if (this._targets.hasOwnProperty("channels")) {
        return this._targets.channels;
    } else {
        return [];
    }
}

Dispatch.prototype.getTargetConnections = function() {
    return this._connections.getItems();
}

Dispatch.prototype.addTargetConnections = function(conns) {
    for (connId in conns) {
        this._connections.add(connId, conns[connId]);
    }
}

module.exports = Dispatch;
