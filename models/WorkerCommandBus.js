var logger = require("./Logger");
var events = require('events');
var util = require('util');

var WorkerCommandBus = function() {

    logger.debug("CommandBus created");
    events.EventEmitter.call(this);
    var me = this;

    process.on("message", function(busdata) {
        logger.debug("message for worker");
        if (busdata.event) {
            logger.debug("emit data", busdata.event, busdata.data);
            me.emit(busdata.event, busdata.data);
        }
    });
};

util.inherits(WorkerCommandBus, events.EventEmitter);

/**
 * Accepts and forwards commands on a central bus to facilitate Inter Process Communication
 */

WorkerCommandBus.prototype.send = function(event, payload) {
    var busdata = {
        "event": event,
        "data": payload
    };
    process.send(busdata);
};

module.exports = WorkerCommandBus;
