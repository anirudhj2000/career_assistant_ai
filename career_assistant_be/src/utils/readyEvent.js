const EventEmitter = require("events");
const { read } = require("fs");
const wsEvents = new EventEmitter();

let isWsCallReady = {
  ready: false,
  user: null,
  userType: null,
};

wsEvents.on("initializeWs", (data) => {
  isWsCallReady.ready = true;
  isWsCallReady.user = data.id;
  isWsCallReady.userType = data.type;
  console.log("WebSocket is ready for connections.");
});

wsEvents.on("resetWs", () => {
  isWsCallReady = {
    ready: false,
    user: null,
    userType: null,
  };
  console.log("WebSocket is reset and unavailable.");
});

module.exports = { wsEvents, isWsCallReady };
