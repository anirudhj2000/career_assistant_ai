const express = require("express");
const router = express.Router();
const controller = require("./controller/controller");

router.post("/auth", controller.initializeUser);
router.get("/jobs", controller.getJobs);
router.get("/incoming-call", controller.handleIncomingCall);
router.get("/transcripts/:id", controller.getTranscriptData);
module.exports = router;
