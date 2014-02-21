var Collection = require('./Collection');

var ChannelManager = function() {
    this.channels = new Collection();

}

ChannelManager.prototype.addConnection = function (conn) {
    conn.on("RX:JOIN", this.handleJoin);
    conn.on("RX:LEAVE", this.handleLeave);
}

ChannelManager.prototype.handleJoin = function() {

}

ChannelManager.prototype.handleLeave = function() {

}

module.exports = ChannelManager;