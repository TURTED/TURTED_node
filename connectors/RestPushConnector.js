var logger = require("../models/Logger");
var url = require('url');

var RestPushConnector = function(dispatcher, prefix, authToken) {
    logger.info("Init REST push connector server")
    this.dispatcher = dispatcher;
    this.prefix = prefix
    this.authToken = authToken;

    //take parameters from request, create a dispatch and send it to dispatcher
};


RestPushConnector.prototype.cors = function(req, res) {
    var origin = req.headers.origin || "*";
    res.setHeader('Access-Control-Allow-Origin', origin);
    res.setHeader('Access-Control-Request-Method', '*');
    res.setHeader('Access-Control-Allow-Methods', 'OPTIONS, POST');
    res.setHeader('Access-Control-Allow-Headers', 'content-type');
};

RestPushConnector.prototype.push = function(req, res) {
    var pushUrl = req.url.replace(this.prefix, '');

    //preflight request
    if (req.method == "OPTIONS") {
        this.cors(req, res);
        res.end();
        return;
    }

    //here comes the push data
    if (req.method == 'POST') {

        //allow CORS
        this.cors(req, res);

        var me = this;
        req.on('data', function(chunk) {
            //console.log("Received body data:");
            var rawdata = chunk.toString();
            //console.log(rawdata);

            try {
                var pushData = JSON.parse(rawdata);
            } catch (e) {
                console.log(rawdata, "is not json");
                me.fail(req, res, 404, "Data was not json");
                return;
            }


            var cmd = pushData.cmd || "";
            var password = pushData.password || "";

            if (!("data" in pushData)) {
                console.log("data parameter missing in pushdata");
                me.fail(req, res, 404, "data missing")
                return;
            }

            var event = pushData.data.event || "";
            var channel = pushData.data.channels || [];
            var user = pushData.data.user || [];
            var payload = pushData.data.payload || {};

            //check password here
            if (password !== me.authToken) {
                //logger.info(password + "!=" + me.authToken);
                logger.info("Wrong password/auth token for push");
                return me.fail(req, res, 401, "Wrong password");
            }

            //console.log(cmd, password, event, "CHANNEL", channel, "USER", user, payload);
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
            me.dispatcher.dispatchEventDataTarget(event, payload, targets);
            me.success(req, res, 200, "OK");
            return true;
        });
    } else {
        console.log("[405] " + req.method + " to " + req.url);
        res.writeHead(405, "Method not supported", {'Content-Type': 'text/html'});
        res.end('<html><head><title>405 - Method not supported</title></head><body><h1>Method not supported.</h1></body></html>');
        return;
    }
};

RestPushConnector.prototype.success = function(req, res, code, message) {
    res.statusCode = code;
    res.end(message);
};

RestPushConnector.prototype.fail = function(req, res, code, message) {
    res.statusCode = code;
    res.end(message);
};

module.exports = RestPushConnector;
