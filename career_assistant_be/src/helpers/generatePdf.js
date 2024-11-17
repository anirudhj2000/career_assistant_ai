const fs = require("fs");
const ejs = require("ejs");
const puppeteer = require("puppeteer");

let pdfSkeleton = {
  personalDetails: {},
  summary: "",
  workExperience: [],
  education: [],
  skills: [],
  certifications: [],
  awards: [],
  projects: [],
};

exports.generatePDF = async (jsonData) => {
  try {
    // Render the EJS template
    const template = fs.readFileSync(
      __dirname + "/../templates/resume-template.ejs",
      "utf8"
    );

    let resumeData = { ...pdfSkeleton, ...jsonData };

    console.log("Resume data: ", resumeData);

    const htmlContent = ejs.render(template, resumeData);

    // Launch Puppeteer
    const browser = await puppeteer.launch();
    const page = await browser.newPage();

    // Set content and generate PDF

    let fileName = `resume_${Date.now()}.pdf`;

    await page.setContent(htmlContent);
    await page.pdf({
      path: fileName,
      format: "A4",
      printBackground: true,
    });

    console.log("PDF generated successfully!");

    return fileName;
    await browser.close();
  } catch (error) {
    console.error("Error generating PDF:", error);
  }
};
