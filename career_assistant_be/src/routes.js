const express = require("express");
const router = express.Router();
const controller = require("./controller");

router.post("/token", controller.generateToken);
router.get("/voice-response", controller.voiceResponse);
router.post("/handle-response", controller.handleResponse);
router.post("/save-recording", controller.saveRecording);
router.get("/jobs", controller.getJobs);

module.exports = router;
