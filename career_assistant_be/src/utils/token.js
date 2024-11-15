const { jwt } = require("twilio");
const AccessToken = jwt.AccessToken;
const VoiceGrant = AccessToken.VoiceGrant;

exports.generateApiToken = (identity) => {
  const accountSid = process.env.TWILIO_ACCOUNT_SID;
  const authToken = process.env.TWILIO_AUTH_TOKEN;
  const apiKey = process.env.TWILIO_API_KEY;
  const apiSecret = process.env.TWILIO_API_SECRET;
  const twimlAppSid = process.env.TWILIO_TWIML_APP_SID;

  const token = new AccessToken(accountSid, apiKey, apiSecret, {
    identity: identity,
  });
  token.identity = identity;

  const voiceGrant = new VoiceGrant({
    outgoingApplicationSid: twimlAppSid,
    incomingAllow: true, // Allow incoming calls
  });

  token.addGrant(voiceGrant);

  return token.toJwt();
};
