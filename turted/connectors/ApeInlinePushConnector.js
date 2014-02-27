var url = require('url');

var ApeInlinePushConnector = function (dispatcher, prefix, authToken) {
    console.log("Init push connector server")
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

    console.log(pushUrl);
    try {
        var pushData = JSON.parse(pushUrl);
    } catch (ex) {
        console.log("Unexpected format: ", ex.message);
        return this.fail(req, res, 404, "Unexpected format: " + ex.message);
    }
    console.log(pushData);

    //expect an array of objects with cmd and params
    var l = pushData.length;
    if ((l == 0) || (l > 10)) {
        console.log("Too many commands at once");
        return this.fail(req, res, 404, "Too many commands at once: " + l);
    }

    for (var i = 0; i < l; i++) {
        var cmdData = pushData[i];

        var cmd = cmdData.cmd || "";
        var password = cmdData.params.password || "";
        var event = cmdData.params.raw || "";
        var channel = cmdData.params.channel || "";
        var data = cmdData.params.data || {};

        //check password here
        if (password !== this.authToken) {
            console.log("Wrong password/auth token for push");
            return this.fail(req, res, 401, "Wrong password");
        }

        console.log(cmd, password, event, channel, data);
        //create dispatch
        if (cmd === "notifyChannel") {
            var targets = {
                channels: channel
            }

            this.dispatcher.dispatchEventDataTarget(event, data, targets);
        }
    }
    this.success(req,res,200,"OK");

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