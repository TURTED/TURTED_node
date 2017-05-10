console.log(process.env);
var loglevel = process.env.TURTED_LOGLEVEL;
if (!loglevel) {
    console.log("No env TURTED_LOGLEVEL, default to error");
    loglevel = "error"
}

var logLevels = [
    "debug",
    "info",
    "warn",
    "error"
]

console.log("Using loglevel", loglevel);

var Logger = function() {

    this.log = function(level) {
        if (logLevels.indexOf(level) >= logLevels.indexOf(loglevel)) {
            console.log.apply(this, arguments);
        }
    }
}
var logger = new Logger();

logLevels.forEach(function(lvl) {
    logger[lvl] = logger.log.bind(this, lvl);
})
module.exports = logger;
