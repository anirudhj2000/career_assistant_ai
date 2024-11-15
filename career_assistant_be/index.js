const dotenv = require("dotenv");
const http = require("http");
const { WebSocketServer } = require("ws");
const app = require("./app");
const setupWebSocket = require("./src/config/websocketConfig");

dotenv.config();

const PORT = process.env.PORT || 5050;

// Create HTTP server
const server = http.createServer(app);

// WebSocket
const wss = new WebSocketServer({ noServer: true });
server.on("upgrade", (request, socket, head) => {
  if (request.url === "/media-stream") {
    wss.handleUpgrade(request, socket, head, (ws) => {
      wss.emit("connection", ws, request);
    });
  } else {
    socket.destroy();
  }
});

setupWebSocket(wss);

// Start the server
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
