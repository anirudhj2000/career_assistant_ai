const express = require("express");
const router = express.Router();
const controller = require("./controller/controller");

router.post("/token", controller.generateToken);
router.get("/jobs", controller.getJobs);
router.post("/create-user", controller.createUser);
router.get("/incoming-call", controller.handleIncomingCall);
router.post("/generate-pdf", controller.generateResumePdf);

module.exports = router;
