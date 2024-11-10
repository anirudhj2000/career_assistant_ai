// const express = require("express");
// const dotenv = require("dotenv");
// const VoiceResponse = require("twilio").twiml.VoiceResponse;

// dotenv.config();
// const app = express();
// const port = process.env.PORT;

// const response = new VoiceResponse();
// const connect = response.connect();
// connect.stream({ url: "wss://ccbd-110-235-236-221.ngrok-free.app/abcd" });

// response.say(
//   "This TwiML instruction is unreachable unless the Stream is ended by your WebSocket server."
// );

// console.log(response.toString());

// app.get("/", (req, res) => {
//   res.send("Express Server");
// });

// app.listen(port, () => {
//   console.log(`[server]: Server is running at http://localhost:${port}`);
// });

const express = require("express");
const { VoiceResponse } = require("twilio").twiml;
const dotenv = require("dotenv");
const cors = require("cors");
const app = express();

dotenv.config();

var corsOptions = {
  origin: ["https://2567-110-235-236-221.ngrok-free.app"],
  credentials: true,
};

app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const port = process.env.PORT;

app.post("/twilio-voice", (req, res) => {
  const twiml = new VoiceResponse();

  // Stream the call audio to a WebSocket
  twiml.connect().stream({
    url: "wss://2567-110-235-236-221.ngrok-free.app/abcd", // Replace with your WebSocket server address
    track: "both_tracks", // 'both_tracks' streams both caller and receiver audio
  });

  res.type("text/xml");
  res.send(twiml.toString());
});

app.get("/", (req, res) => {
  res.send("Express Server");
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
