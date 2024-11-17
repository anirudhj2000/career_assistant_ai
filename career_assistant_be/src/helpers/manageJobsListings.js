const { scrapeJobs } = require("../utils/scraper");
const { resume_dummy } = require("../utils/consts");
const { wsEvents, isWsCallReady } = require("../utils/readyEvent");
const { getUserData } = require("../controller/user.controller");
const OpenAI = require("openai");
const openai = new OpenAI();

exports.generateJobsListings = async () => {
  let response = await getUserData(isWsCallReady.user);
  let role = response.role;
  if (!role) {
    role = await this.generateUserRoleFromResume(response.resume);
  }

  let jobs = await scrapeJobs(role);
  let firstThreeJobs = jobs.slice(0, 3);
  return firstThreeJobs;

  // let summary = await generateJobSummary(jobs);
};

exports.generateUserRoleFromResume = async (resume) => {
  const prompt = `Given the following resume, determine the user's role: ${JSON.stringify(
    resume
  )}`;
  const completion = await openai.chat.completions.create({
    model: "gpt-4o-2024-08-06",
    messages: [
      {
        role: "system",
        content: prompt,
      },
      {
        role: "user",
        content:
          "Return only the user's role based on the resume provided and nothing else , the out should maximum 2-3 words tops",
      },
    ],
  });

  return completion.choices[0].message.content;
};

exports.generateJobSummary = async (jobs) => {
  const prompt = `Given the following job listings, generate a summary: ${JSON.stringify(
    jobs
  )}
  
  for each lisitng in the json array create a summary of the listings each listing and tell user that they will be able to see the full listing on their screen and they can ask to search for few more"
  
  this summary should be in a paragraph format and should be concise and to the point and should not exceed 3-4 lines per listing , generate it as an assistant role , the summary generated will be read to the assistant
  `;
  const completion = await openai.chat.completions.create({
    model: "gpt-4o-2024-08-06",
    messages: [
      {
        role: "system",
        content: prompt,
      },
      {
        role: "assistant",
        content:
          "A summary for the assistant to read to the user based on the job listings provided",
      },
    ],
  });

  return completion.choices[0].message.content;
};
