//pull all test in here

var tests = [
    //"example",
    "ConnectionTest",
    "RawDataTest",
    "MockSockTest",
    "TokenAuthenticatorTest",
    "ConnectionManagerTest",
    "UserTest",
    "UserManagerTest",
    "ChannelTest",
    "ChannelManagerTest",
    "DispatchTest",
    "DispatcherTest",
    "ConnectionHandlerTest",
];

//tests = ["ChannelManagerTest"];

for (var i = 0; i<tests.length;i++) {
    var testName = tests[i];
    exports[testName] = require('./'+testName);
}


