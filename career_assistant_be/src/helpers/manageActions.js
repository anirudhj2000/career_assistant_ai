const {
  getCurrentConversationState,
  generateResumeObject,
} = require("./manageConversation");
const { generateResumePdf } = require("../controller/controller");
const { generatePDF } = require("./generatePdf");
const { sendEmail } = require("../utils/sendEmail");

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

  console.log(
    "Current stage: ",
    conversationState,
    stage == "job_search_activation" || stage == "job_search_execution"
  );

  if (actions.includes(stage)) {
    if (stage == "email_id_confirmation") {
      try {
        const resume = await generateResumeObject(transcript);

        if (resume.personalDetails.email) {
          const pdf = await generatePDF(resume);
          console.log("PDF: ", pdf);
          await sendEmail(resume.personalDetails.email, pdf);
        } else {
          throw new Error("Email not found in the resume");
        }

        return {
          ...conversationState,
          action: "send_email",
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
        ...conversationState,
        action: "get_jobs",
      };
    } else {
      return { action: NO_ACTION, ...conversationState };
    }
  } else {
    return { action: NO_ACTION, ...conversationState };
  }
};

exports.manageJobData = async (transcript) => {
  //   const conversationState = await getCurrent
};
