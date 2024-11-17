const fs = require("fs");
const ejs = require("ejs");
const puppeteer = require("puppeteer");

exports.generatePDF = async (jsonData) => {
  try {
    // Render the EJS template
    const template = fs.readFileSync(
      __dirname + "/../templates/resume-template.ejs",
      "utf8"
    );
    const htmlContent = ejs.render(template, jsonData);

    // Launch Puppeteer
    const browser = await puppeteer.launch();
    const page = await browser.newPage();

    // Set content and generate PDF
    await page.setContent(htmlContent);
    await page.pdf({
      path: `resume_${Date.now()}.pdf`,
      format: "A4",
      printBackground: true,
    });

    console.log("PDF generated successfully!");
    await browser.close();
  } catch (error) {
    console.error("Error generating PDF:", error);
  }
};
