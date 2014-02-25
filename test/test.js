//pull all test in here

var tests = [
    //"example",
    "ConnectionTest",
    "ConnectionHandlerTest",
    "RawDataTest",
    "MockSockTest",
    "TokenAuthenticatorTest",
    "ConnectionManagerTest",
    "UserTest",
    "UserManagerTest",
    "ChannelTest",
    "ChannelManagerTest",
];

//tests = ["ChannelManagerTest"];

for (var i = 0; i<tests.length;i++) {
    var testName = tests[i];
    exports[testName] = require('./'+testName);
}


