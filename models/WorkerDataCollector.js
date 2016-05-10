var logger = require("./Logger");

var WorkerDataCollector = function() {
};

/**
 * Accepts and forwards commands on a central bus to facilitate Inter Process Communication
 */

WorkerDataCollector.prototype.set = function(dataset, payload) {
    var busdata = {
        "dataset": dataset,
        "data": payload
    };
    process.send(busdata);
};

module.exports = WorkerDataCollector;
