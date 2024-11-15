const puppeteer = require("puppeteer");
require("dotenv").config();

function delay(time) {
  return new Promise((resolve) => setTimeout(resolve, time));
}

exports.scrapeJobs = async () => {
  const browser = await puppeteer.launch({ headless: false });
  const page = await browser.newPage();
  const jobs = [];
  await page.setViewport({ width: 1200, height: 800 });
  await page.setUserAgent(
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/87.0.4280.88 Safari/537.36"
  );

  try {
    // Function to log in
    async function loginToLinkedIn(page, username, password) {
      await page.goto("https://www.linkedin.com/login", {
        waitUntil: "networkidle2",
      });
      await page.type("#username", username);
      await page.type("#password", password);
      await page.click('button[type="submit"]');
      console.log("Logging in to LinkedIn...");
      await page.waitForNavigation();
      console.log("Successfully logged in to LinkedIn");
    }

    await loginToLinkedIn(
      page,
      process.env.LINKEDIN_ID,
      process.env.LINKEDIN_PASS
    );

    // Navigate to jobs page
    await page.goto(
      "https://www.linkedin.com/jobs/search/?keywords=Software%20Engineer",
      { waitUntil: "domcontentloaded" }
    );
    console.log("Navigated to jobs page");
    await page.waitForSelector(".job-card-container", {
      visible: true,
    });
    await delay(5000);

    // Scrape job data

    const jobs = await page.evaluate(async () => {
      const jobElements = document.querySelectorAll(".job-card-container");
      console.log("Scraping job data...", jobElements);
      const jobData = [];
      jobElements.forEach((jobElement) => {
        const title = jobElement.querySelector(
          ".job-card-list__title"
        )?.innerText;
        const company = jobElement.querySelector(
          ".job-card-container__primary-description"
        )?.innerText;
        const location = jobElement.querySelector(
          ".job-card-container__metadata-item"
        )?.innerText;
        const link = jobElement.querySelector("a")?.href;

        console.log("scraape", title, company, location, link);

        if (title && company && location && link) {
          jobData.push({ title, company, location, link });
        }
      });

      console.log("Scraping job data...", jobData);
      return jobData;
    });

    console.log("Scraping job data...done");
    console.log(jobs);

    return jobs;
  } catch (error) {
    console.error("Error scraping jobs:", error);
    return [];
  } finally {
    await browser.close();
  }
};
