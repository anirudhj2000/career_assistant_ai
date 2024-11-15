const { jwt } = require("twilio");
const AccessToken = jwt.AccessToken;
const VoiceGrant = AccessToken.VoiceGrant;
const twilio = require("twilio");
const ffmpeg = require("fluent-ffmpeg");
const { PassThrough } = require("stream");
const ffmpegPath = require("@ffmpeg-installer/ffmpeg").path;
ffmpeg.setFfmpegPath(ffmpegPath);

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

exports.getTwilioClient = () => {
  const accountSid = process.env.TWILIO_ACCOUNT_SID;
  const authToken = process.env.TWILIO_AUTH_TOKEN;
  return twilio(accountSid, authToken);
};

exports.convertAudioBuffer = (audioBuffer) => {
  return new Promise((resolve, reject) => {
    const inputStream = new PassThrough();
    inputStream.end(audioBuffer);

    const outputStream = new PassThrough();
    const audioChunks = [];

    outputStream.on("data", (chunk) => audioChunks.push(chunk));
    outputStream.on("end", () => resolve(Buffer.concat(audioChunks)));
    outputStream.on("error", (error) => reject(error));

    ffmpeg(inputStream)
      .inputFormat("mp3") // Specify input format if known
      .audioFrequency(24000) // Set sample rate to 24kHz
      .audioChannels(1) // Mono channel
      .audioCodec("pcm_s16le") // 16-bit PCM
      .audioBitrate("128k") // Set bitrate to 128 kbps
      .format("wav") // Output format
      .pipe(outputStream, { end: true });
  });
};
