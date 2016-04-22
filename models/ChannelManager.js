var logger = require("./Logger");
var Channel = require('./Channel');
var Collection = require('./Collection');

var ChannelManager = function() {
    this.channels = new Collection();
};

ChannelManager.prototype.handleJoin = function(channelName, conn) {

    var me = this;
    if (!(typeof channelName === "string")) {
        logger.error("channelName", channelName, "is not a string");
        return false;
    }
    if (!(typeof conn === "object")) {
        logger.error("conn", conn, "is not an object");
        return false;
    }
    if (channelName === "") {
        return false;
    }

    var channel;
    if (this.channels.exists(channelName)) {
        channel = this.channels.get(channelName);
    } else {
        channel = new Channel(channelName);
        this.channels.add(channelName, channel);

        channel.on("empty", function() {
            this.channels.remove(channelName);
            logger.info("Channel ", channelName, " is empty");
            channel = undefined;
        }.bind(this));
    }
    channel.join(conn);
};

ChannelManager.prototype.handleLeave = function(channelName, conn) {
    var channel;
    if (this.channels.exists(channelName)) {
        channel = this.channels.get(channelName);
        channel.leave(conn);
    }
};

ChannelManager.prototype.getChannelConnections = function(channel) {
    if (this.channels.has(channel)) {
        logger.debug("Hab den channel");
        return this.channels.get(channel).getConnections();
    } else {
        logger.debug("Nix channel");
        return {};
    }
};

module.exports = ChannelManager;