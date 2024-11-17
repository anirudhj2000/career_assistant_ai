// Import the Nodemailer library
const nodemailer = require("nodemailer");
const { path } = require("../../app");
const fs = require("fs");

// Create a transporter object
const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false, // use false for STARTTLS; true for SSL on port 465
  auth: {
    user: process.env.EMAIL_ID,
    pass: process.env.EMAIL_PASS,
  },
});

// Configure the mailoptions object

exports.sendEmail = async (email, resume) => {
  const mailOptions = {
    from: "anirudhjoshi985@email.com",
    to: email,
    subject: "Your Resume created with AI Career assist",
    text: "Please find attached your resume created using AI Career Assist. We hope this helps you in your job search. Best of luck",
    attachments: [
      {
        filename: resume,
        path: `${__dirname}/../../${resume}`,
      },
    ],
  };

  // Send the email
  transporter.sendMail(mailOptions, function (error, info) {
    if (error) {
      console.log("Error:", error);
    } else {
      fs.unlink(path.join(__dirname, `../../${resume}`), (err) => {
        if (err) {
          console.error("Error deleting file:", err);
        } else {
          console.log("File deleted successfully");
        }
      });
      console.log("Email sent: ", info.response);
    }
  });
};
