const dotenv = require("dotenv");
const http = require("http");
const { WebSocketServer } = require("ws");
const app = require("./app");
const setupWebSocket = require("./src/controller/twilioWebSocket");
const setupUIWebSocket = require("./src/controller/uiWebSocket");
const { wsEvents, isWsCallReady } = require("./src/utils/readyEvent");
const {
  generateInitialPrompt,
} = require("./src/helpers/generateInitialPrompt");

dotenv.config();

const PORT = process.env.PORT || 5050;

// Create HTTP server
const server = http.createServer(app);

// WebSocket
const wsCall = new WebSocketServer({ noServer: true });
const wsUI = new WebSocketServer({ noServer: true });
const wsUIClients = [];
let initialPromptString = "";

server.on("upgrade", (request, socket, head) => {
  if (request.url === "/media-stream") {
    if (isWsCallReady.ready) {
      // generateInitialPrompt()
      //   .then((initialPrompt) => {
      //     initialPromptString = initialPrompt;
      //     wsCall.handleUpgrade(request, socket, head, (ws) => {
      //       wsCall.emit("connection", ws, request);
      //     });
      //   })
      //   .catch((err) => {
      //     socket.destroy();
      //     wsEvents.emit("resetWs");
      //   });
      wsCall.handleUpgrade(request, socket, head, (ws) => {
        wsCall.emit("connection", ws, request);
      });
    }
  } else if (request.url === "/ui") {
    wsUI.handleUpgrade(request, socket, head, (ws) => {
      wsUI.emit("connection", ws, request);
    });
  } else {
    socket.destroy();
  }
});

setupWebSocket(wsCall, wsUIClients);
setupUIWebSocket(wsUI, wsUIClients);

// Start the server
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
