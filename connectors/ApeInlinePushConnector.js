var logger = require("../models/Logger");
var url = require('url');

var ApeInlinePushConnector = function (dispatcher, prefix, authToken) {
    logger.info("Init push connector server")
    this.dispatcher = dispatcher;
    this.prefix = prefix
    this.authToken = authToken;

    //take parameters from request, create a dispatch and send it to dispatcher
}

ApeInlinePushConnector.prototype.push = function (req, res) {
    var pushUrl = req.url.replace(this.prefix, '');

    //for the time being, this is oriented on the old sfTurtedPlugin/APE inline push structure, see ape-project.org
    if (/%7B/.test(pushUrl)) {
        pushUrl = decodeURIComponent(pushUrl);
    }

    logger.debug(pushUrl);
    try {
        var pushData = JSON.parse(pushUrl);
    } catch (ex) {
        logger.warn("Unexpected format: ", ex.message);
        return this.fail(req, res, 404, "Unexpected format: " + ex.message);
    }
    logger.debug(pushData);

    //expect an array of objects with cmd and params
    var l = pushData.length;
    if ((l == 0) || (l > 10)) {
        logger.error("Too many commands at once");
        return this.fail(req, res, 404, "Too many commands at once: " + l);
    }

    for (var i = 0; i < l; i++) {
        var cmdData = pushData[i];

        var cmd = cmdData.cmd || "";
        var password = cmdData.params.password || "";
        var raw = cmdData.params.raw || "";
        var channel = cmdData.params.channel || "";
        var user = cmdData.params.user || "";
        var data = cmdData.params.data || {};

        //check password here
        if (password !== this.authToken) {
            logger.info("Wrong password/auth token for push");
            return this.fail(req, res, 401, "Wrong password");
        }

        console.log(cmd, password, raw, "CHANNEL", channel, "USER", user, data);
        //create dispatch
        var targets = {};
        if (cmd === "notifyChannel") {
            targets = {
                channels: [channel]
            }
        } else if (cmd === "notifyUser") {
            targets = {
                users: [user]
            }
        } else if (cmd === "notifyAll") {
            targets = {
                broadcast: true
            };
        }
        this.dispatcher.dispatchEventDataTarget(raw, data, targets);
    }
    this.success(req, res, 200, "OK");

}
ApeInlinePushConnector.prototype.success = function (req, res, code, message) {
    res.statusCode = code;
    res.end(message);
}

ApeInlinePushConnector.prototype.fail = function (req, res, code, message) {
    res.statusCode = code;
    res.end(message);
}

module.exports = ApeInlinePushConnector;
