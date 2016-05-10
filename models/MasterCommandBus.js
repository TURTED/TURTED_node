var logger = require("./Logger");
var events = require('events');
var util = require('util');

var MasterCommandBus = function(cluster) {

    logger.debug("CommandBus created");
    events.EventEmitter.call(this);

    var me = this;

    cluster.on('online', function(worker) {
        console.log('Commandbus sagt Worker ' + worker.process.pid + ' is online');
        var w = worker;
        worker.on("message", function(data) {
            if (data.event) {
                console.log("Distribute event", data.event);
                for (var wid in cluster.workers) {
                    var wk = cluster.workers[wid];
                    wk.send(data);
                }
            }
        });
    });
    console.log("Ich bin der Busfahrer");
}
util.inherits(MasterCommandBus, events.EventEmitter);

/**
 * Accepts and forwards commands on a central bus to facilitate Inter Process Communication
 */

MasterCommandBus.prototype.send = function(event, payload) {
    var busdata = {
        "event": event,
        "data": payload
    };
    process.send(busdata, null, function(data) {
        console.log("RR", data);
    });
};

module.exports = MasterCommandBus;
