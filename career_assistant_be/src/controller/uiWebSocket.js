module.exports = (wss2, ws2Clients) => {
  wss2.on("connection", (ws) => {
    console.log("Frontend client connected");
    ws2Clients.push(ws); // Add to ws 2 clients array

    ws.on("close", () => {
      console.log("Frontend client disconnected");
      // Remove disconnected client from ws 2 clients array
      ws2Clients.splice(ws2Clients.indexOf(ws), 1);
    });
  });
};
