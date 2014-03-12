var winston = require("winston");

var loglevel = process.env.npm_package_config_loglevel;
if (typeof loglevel === "undefined") {
    loglevel = "error";
}

console.log("Using loglevel ", loglevel);

var logger = new (winston.Logger)({
    transports: [
        //new (winston.transports.Console)({ level: 'error' }),
        new (winston.transports.Console)({ level: loglevel }),
        //new (winston.transports.File)({ filename: 'somefile.log' })
    ]
});

//logger.add(winston.transports.File, { filename: "../logs/production.log" });

/*
 var print = function() {
 console.log.call(this,arguments);
 }
 var logger = {
 info: print,
 warn: print,
 error: print,
 debug: print
 }
 */

module.exports = logger;
