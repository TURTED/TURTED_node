//pull all test in here

var tests = [
    //"example",
    "ConnectionTest",
    "CoreTest",
];

for (var i = 0; i<tests.length;i++) {
    var testName = tests[i];
    exports[testName] = require('./'+testName);
}



