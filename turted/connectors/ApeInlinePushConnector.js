var url = require('url');

var ApeInlinePushConnector = function (dispatcher, prefix, authToken) {
    console.log("Init push connector server")
    this.dispatcher = dispatcher;
    this.prefix = prefix
    this.authToken = authToken;

    //take parameters from request, create a dispatch and send it to dispatcher
}

ApeInlinePushConnector.prototype.push = function(req) {
    var pushUrl = req.url.replace(this.prefix,'');

    //for the time being, this is oriented on the old sfTurtedPlugin/APE inline push structure, see ape-project.org
    if (/%7B/.test(pushUrl)) {
        pushUrl = decodeURIComponent(pushUrl);
    }

    console.log(pushUrl);
    try {
        var pushData = JSON.parse(pushUrl);
    } catch (ex) {
        console.log("Unexpected format");
        return false;
        pushData = pushUrl;
    }
    console.log(pushData);

    //expect an array of objects with cmd and params
    var l = pushData.length;
    if ((l == 0) || (l>10)) {
        console.log("Error handliing");
        return false;
    }

    for (var i = 0; i<l; i++) {
        var cmdData = pushData[i];

        var cmd = cmdData.cmd || "";
        var password = cmdData.params.password || "";
        var event = cmdData.params.raw || "";
        var channel = cmdData.params.channel || "";
        var data = cmdData.params.data || {};

        //check password here
        if (password !== this.authToken) {
            console.log("Wrong password/auth token for push");
            return false;
        }

        console.log(cmd, password, event, channel, data);
        //create dispatch
        if (cmd === "notifyChannel") {
            var targets = {
                channels: channel
            }

            this.dispatcher.dispatchEventDataTarget(event,data,targets);
        }
    }

}

module.exports = ApeInlinePushConnector;