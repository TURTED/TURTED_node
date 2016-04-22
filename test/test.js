//pull all test in here

var tests = [
    //"example",
    "UserTest",
    "MockSockTest",
    "MockServTest",
    "SocketioClientConnectorTest",
    "ConnectionTest",
    "RawDataTest",
    "TokenAuthenticatorTest",
    "DispatchTest",
    "DispatcherTest",
    "ChannelTest",
    "ChannelManagerTest",
    "UserManagerTest",
    "IdentTest",
    "ConnectionManagerTest",
    "CollectionTest",
];

//tests = ["ConnectionTest"];

for (var i = 0; i < tests.length; i++) {
    var testName = tests[i];
    exports[testName] = require('./' + testName);
}


