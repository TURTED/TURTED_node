var TURTED = function (sockjs_url) {
    var me = this;
    this.callbacks = {};
    this.nativeConnection = {};

    this.reconnect = function () {
        var sockjs = new SockJS(sockjs_url);
        sockjs.onopen = function () {
            print('[*] open', sockjs.protocol);
            this.send("Bin jetzt da: " + navigator.userAgent.replace(/\(.*?\)/g, ''));
        };
        sockjs.onmessage = function (e) {
            var type = "";
            var data = {};
            if (e.hasOwnProperty("type")) {
                type = e.type;
            }

            if (e.hasOwnProperty("data")) {
                data = JSON.parse(e.data);
            }

            if (typeof me.callbacks[type] === "object") {
                var l = me.callbacks[type].length;
                for (var i = 0; i < l; i++) {
                    me.callbacks[type][i].call(me, data);
                }
            }
        };

        sockjs.onerror = function (e) {
            console.log("Error", e)

        }
        sockjs.onclose = function () {
            print('[*] close');
            setTimeout(this.reconnect.bind(this),1000);
            print('[-] retry');
        }.bind(this);;

        this.nativeConnection = sockjs;
    }

    this.reconnect();
}

TURTED.prototype.on = function (on, f) {
    if (typeof this.callbacks[on] === "undefined") {
        this.callbacks[on] = [];
    }
    this.callbacks[on].push(f);
};

TURTED.prototype.send = function (message) {
    this.nativeConnection.send(this.encode("message", message));
    console.log(this.encode("message", message));
}

TURTED.prototype.echo = function (message) {
    this.nativeConnection.send(this.encode("echo", message));
}

TURTED.prototype.encode = function (type, data) {
    return JSON.stringify({
        type: type,
        data: data
    });
}

