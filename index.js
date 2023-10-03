const express = require("express");
const nodemailer = require("nodemailer");
const { Octokit } = require("@octokit/rest");
const cron = require("node-cron");
const axios = require("axios");
require("dotenv").config();

const app = express();

const path = "README.md";
const owner = "leanhvu5501412";
const repo = "leanhvu5501412";
const token = process.env.token;
const email_auth_user = "leanhvu550@gmail.com";
const email_auth_pass = process.env.email_auth_pass;

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: email_auth_user,
    pass: email_auth_pass,
  },
});

const octokit = new Octokit({
  auth: token,
});

const getQuoteToday = async () => {
  const response = await axios.get("https://zenquotes.io/api/today");
  return response.data[0];
};

// Update every night
cron.schedule("* * * * *", async () => {
  try {
    const quote = await getQuoteToday();

    // Get the existing file content
    const {
      data: { _content, sha },
    } = await octokit.rest.repos.getContent({
      owner,
      repo,
      path,
    });

    const dateString = new Date().toLocaleString();
    const defaultContent = `# Hi there 👋\n\n\n## ${quote?.h}\n\n\n<img width="50%" src="https://zenquotes.io/api/image" alt="zenquotes-image-each-day" />\n\n\n ## 📫 How to reach me: https://www.facebook.com/nhatcungtom\n\n\n ## 🌱 **Languages and Tools:**\t<code><img height="20" src="https://raw.githubusercontent.com/github/explore/80688e429a7d4ef2fca1e82350fe8e3517d3494d/topics/javascript/javascript.png"></code><code><img height="20" src="https://raw.githubusercontent.com/github/explore/80688e429a7d4ef2fca1e82350fe8e3517d3494d/topics/react/react.png"></code><code><img height="20" src="https://raw.githubusercontent.com/github/explore/80688e429a7d4ef2fca1e82350fe8e3517d3494d/topics/nodejs/nodejs.png"></code>\n\n\n![leanhvu21042001 Github Stats](https://github-readme-stats.vercel.app/api?username=leanhvu21042001&show_icons=true&theme=tokyonight)\n\n\n![Top Langs](https://github-readme-stats.vercel.app/api/top-langs/?username=leanhvu21042001&layout=compact&theme=tokyonight)`;

    // Modify the file content
    const message = `Update file content ${dateString}`;
    const newContent = `${defaultContent}\n\n\nNew file content (${dateString})`;
    const content = Buffer.from(newContent).toString("base64");

    // Update the file on GitHub
    await octokit.rest.repos.createOrUpdateFileContents({
      owner,
      repo,
      path,
      message,
      content,
      sha,
    });

    const mailOptions = {
      from: email_auth_user,
      to: email_auth_user,
      subject: "Sending Email using Node.js",
      text: "That was easy!" + dateString,
    };

    transporter.sendMail(mailOptions, function (error, info) {
      if (error) {
        console.log(error);
      } else {
        console.log("Email sent: " + info.response);
      }
    });
  } catch (error) {
    process.exit(1);
  }
});

const port = process.env.PORT || 5000;

app.listen(port, () => {});
