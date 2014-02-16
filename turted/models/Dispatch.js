var Dispatch = function(e,payload,targets) {
	console.log("This event " + e + " goes to:");
	console.log(targets);
	console.log("Its payload: ");
	console.log(payload);
};


module.exports = Dispatch;
