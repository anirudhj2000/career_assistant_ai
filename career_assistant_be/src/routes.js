const express = require("express");
const router = express.Router();
const controller = require("./controller/controller");

router.post("/auth", controller.initializeUser);
router.post("/jobs/:id", controller.getJobs);
router.get("/incoming-call", controller.handleIncomingCall);
router.post("/transcripts/:id", controller.getTranscriptData);
module.exports = router;
