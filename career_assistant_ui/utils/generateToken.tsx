import { jwt } from "twilio";
const AccessToken = jwt.AccessToken;
const VoiceGrant = AccessToken.VoiceGrant;

function generateToken(identity: string) {
    const accountSid = process.env.TWILIO_ACCOUNT_SID;
    const apiKey = process.env.TWILIO_API_KEY;
    const apiSecret = process.env.TWILIO_API_SECRET;
    const twimlAppSid = process.env.TWILIO_TWIML_APP_SID;

    if (accountSid && apiKey && apiSecret) {
        const token = new AccessToken(accountSid, apiKey, apiSecret, { identity: identity });
        token.identity = identity;

        const voiceGrant = new VoiceGrant({
            outgoingApplicationSid: twimlAppSid,
            incomingAllow: true, // Allow incoming calls
        });

        token.addGrant(voiceGrant);

        return token.toJwt();
    }
}

export default generateToken;
