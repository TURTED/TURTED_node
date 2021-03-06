var logger = require("../models/Logger");
var url = require('url');

var RestPushConnector = function(dispatcher, prefix, authenticator) {
    logger.info("Init REST push connector server");
    this.dispatcher = dispatcher;
    this.prefix = prefix;
    this.authenticator = authenticator;

    //take parameters from request, create a dispatch and send it to dispatcher
};


RestPushConnector.prototype.cors = function(req, res) {
    var origin = req.headers.origin || "*";
    res.setHeader('Access-Control-Allow-Origin', origin);
    res.setHeader('Access-Control-Request-Method', '*');
    res.setHeader('Access-Control-Allow-Methods', 'OPTIONS, POST');
    res.setHeader('Access-Control-Allow-Headers', 'content-type');
};

RestPushConnector.prototype.push = function(req, res, callback) {
    var pushUrl = req.url.replace(this.prefix, '');

    //preflight request
    if (req.method == "OPTIONS") {
        this.cors(req, res);
        res.end();
        return;
    }

    //here comes the push data
    var chunks = [];
    if (req.method == 'POST') {

        //allow CORS
        this.cors(req, res);

        var me = this;
        req.on('data', function(chunk) {
            chunks.push(chunk);
        });
        req.on('end', function(chunk) {
            //console.log("Received body data:");
            var rawdata = Buffer.concat(chunks);
            //console.log(rawdata);

            try {
                var pushData = JSON.parse(rawdata);
            } catch (e) {
                logger.info(rawdata, "is not json");
                return me.fail(req, res, 400, "Data was not json");
            }


            var authData = pushData.auth || {};
            var event = pushData.event || "";
            var targets = pushData.targets || {};
            var payload = pushData.payload || {};

            //check auth here
            //only if an authenticator is defined
            if (me.authenticator) {
                if (!(me.authenticator.verify(authData))) {
                    logger.debug("Authenticator denied PUSH");
                    return me.fail(req, res, 401, "Wrong auth data");
                }
            }

            me.dispatcher.dispatchEventDataTarget(event, payload, targets);
            me.success(req, res, 200, "OK");
            // use the optional callback to send data back after the request is done
            if (typeof callback === "function") {
                callback(pushData);
            }
            return true;
        });
    } else {
        logger.info("[405] " + req.method + " to " + req.url);
        res.writeHead(405, "Method not supported", {'Content-Type': 'text/html'});
        res.end('<html><head><title>405 - Method not supported</title></head><body><h1>Method not supported.</h1></body></html>');
        return false;
    }
};

RestPushConnector.prototype.success = function(req, res, code, message) {
    res.statusCode = code;
    res.end(message);
    return true;
};

RestPushConnector.prototype.fail = function(req, res, code, message) {
    res.statusCode = code;
    res.end(message);
    return false;
};

module.exports = RestPushConnector;
