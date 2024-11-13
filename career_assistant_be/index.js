const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const app = express();

dotenv.config();

var corsOptions = {
  origin: ["https://localhost:3001"],
  credentials: true,
};

app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api", require("./src/routes"));

const port = process.env.PORT;
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
