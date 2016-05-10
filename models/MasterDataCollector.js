var logger = require("./Logger");
var events = require('events');
var util = require('util');

var MasterDataCollector = function(cluster) {

    logger.debug("Master Datacollector created");
    events.EventEmitter.call(this);
    var me = this;
    me.data = {};

    cluster.on('online', function(worker) {
        var w = worker;
        worker.on("message", function(data) {
            if (data.dataset) {
                var ds;
                if (worker.id in me.data) {
                    ds = me.data[worker.id];
                } else {
                    ds = {};
                    me.data[worker.id] = ds;
                }
                ds[data.dataset] = data.data;
            }
        });
    });
    
    cluster.on('disconnect', function(worker) {
        delete me.data[worker.id];
        
    });
};
util.inherits(MasterDataCollector, events.EventEmitter);

module.exports = MasterDataCollector;
