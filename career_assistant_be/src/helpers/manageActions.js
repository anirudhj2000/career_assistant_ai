const {
  getCurrentConversationState,
  generateResumeObject,
} = require("./manageConversation");
const { generatePDF } = require("./generatePdf");
const { sendEmail } = require("../utils/sendEmail");
const {
  updateUserData,
  getUserData,
} = require("../controller/user.controller");
const { isWsCallReady } = require("../utils/readyEvent");
const { userTypes } = require("../utils/consts");

const actions = [
  "initial_conversation",
  "language_selection",
  "resume_building",
  "resume_confirmation",
  "email_id_confirmation",
  "send_user_email",
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
    if (stage == "send_user_email") {
      try {
        const userdata = await generateResumeObject(transcript);
        const resume = userdata.resume;
        if (resume.personalDetails.email) {
          const pdf = await generatePDF(resume);
          console.log("PDF: ", pdf);
          await sendEmail(resume.personalDetails.email, pdf);

          getUserData(isWsCallReady.user).then((user) => {
            let userData = { ...user, type: userTypes.EXISTING_USER };
            updateUserData(
              isWsCallReady.user,
              userData,
              userTypes.EXISTING_USER
            );
          });
        } else {
          throw new Error("Email not found in the resume");
        }

        return {
          ...conversationState,
          action: "send_email",
        };
      } catch (error) {
        console.error("Error during send_user_email stage:", error);

        return {
          stage: "send_user_email",
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

exports.updateUserDataAction = async (transcript, type) => {
  const resumeObject = await generateResumeObject(transcript);
  await updateUserData(isWsCallReady.user, resumeObject, type);
};
