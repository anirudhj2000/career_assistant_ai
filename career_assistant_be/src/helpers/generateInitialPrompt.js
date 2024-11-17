const {
  SYSTEM_MESSAGE_EXISTING_USER,
  SYSTEM_MESSAGE_EXISTING_USER_NO_RESUME,
  SYSTEM_MESSAGE_NEW_USER,
} = require("../utils/consts");
const { getUserData } = require("../controller/user.controller");
const { wsEvents, isWsCallReady } = require("../utils/readyEvent");
const { userTypes } = require("../utils/consts");
const { generateResumeSummary } = require("./manageConversation");

exports.generateInitialPrompt = async () => {
  let response = await getUserData(isWsCallReady.user);

  console.log("User data response prompt: ", response, isWsCallReady.userType);

  let resumeSummary = "";
  if (isWsCallReady.userType == userTypes.NEW_USER) {
    return SYSTEM_MESSAGE_NEW_USER;
  } else if (
    isWsCallReady.userType == userTypes.EXISTING_USER &&
    response.resume
  ) {
    resumeSummary = await generateResumeSummary(response.resume);
    return SYSTEM_MESSAGE_EXISTING_USER + JSON.stringify(resumeSummary);
  } else if (
    isWsCallReady.userType == userTypes.EXISTING_USER_NO_RESUME ||
    !response.resume ||
    !response.name
  ) {
    resumeSummary = await generateResumeSummary(response.resume);
    return (
      SYSTEM_MESSAGE_EXISTING_USER_NO_RESUME + JSON.stringify(resumeSummary)
    );
  }
};
