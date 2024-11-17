const {
  getCurrentConversationState,
  generateResumeObject,
} = require("./manageConversation");
const { generateResumePdf } = require("../controller/controller");
const { generatePDF } = require("./generatePdf");

const actions = [
  "initial_conversation",
  "language_selection",
  "resume_building",
  "resume_confirmation",
  "email_id_confirmation",
  "job_search_activation",
  "job_search_execution",
];

const NO_ACTION = "no_action";

exports.manageActions = async (transcript) => {
  const conversationState = await getCurrentConversationState(transcript);
  let stage = conversationState.stage;

  if (!actions.includes(stage)) {
    if (stage === "email_id_confirmation") {
      try {
        const resume = await generateResumeObject(transcript);
        const pdf = await generatePDF(resume);
        await sendEmail("", pdf);

        return {
          stage: "email_id_confirmation",
          description:
            "The user's email address is confirmed, and the resume has been sent via email.",
        };
      } catch (error) {
        console.error("Error during email_id_confirmation stage:", error);

        return {
          stage: "email_id_confirmation",
          description:
            "An error occurred during the email confirmation process.",
          error: error.message,
        };
      }
    } else if (
      stage == "job_search_activation" ||
      stage == "job_search_execution"
    ) {
      return {
        stage: "job_search_activation",
        description: "The job search process has been activated.",
      };
    } else {
      return { action: NO_ACTION, stage: stage };
    }
  } else {
    return { action: NO_ACTION, stage: stage };
  }
};

const sendEmail = async (email, resume) => {
  // Send email with resume
  console.log("Sending email to: ", email);
  console.log("Resume: ", resume);
};
