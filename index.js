const express = require("express");
const { Octokit } = require("@octokit/rest");
const cron = require("node-cron");
const axios = require("axios");
require("dotenv").config();

const app = express();
const token = process.env.token;

const octokit = new Octokit({
  auth: token,
});

const owner = "leanhvu5501412";
const repo = "leanhvu5501412";
const path = "README.md";

const getQuoteToday = async () => {
  const response = await axios.get("https://zenquotes.io/api/today");
  return response.data[0];
};

// Update every night
cron.schedule("0 0 * * *", async () => {
  try {
    const quote = await getQuoteToday();

    // Get the existing file content
    const {
      data: { _content, sha },
    } = await octokit.rest.repos.getContent({
      owner,
      repo,
      path: path,
    });

    const defaultContent = `# Hi there 👋\n\n\n## ${quote?.h}\n\n\n<img width="50%" src="https://zenquotes.io/api/image" alt="zenquotes-image-each-day" />\n\n\n ## 📫 How to reach me: https://www.facebook.com/nhatcungtom\n\n\n ## 🌱 **Languages and Tools:**\t<code><img height="20" src="https://raw.githubusercontent.com/github/explore/80688e429a7d4ef2fca1e82350fe8e3517d3494d/topics/javascript/javascript.png"></code><code><img height="20" src="https://raw.githubusercontent.com/github/explore/80688e429a7d4ef2fca1e82350fe8e3517d3494d/topics/react/react.png"></code><code><img height="20" src="https://raw.githubusercontent.com/github/explore/80688e429a7d4ef2fca1e82350fe8e3517d3494d/topics/nodejs/nodejs.png"></code>\n\n\n![leanhvu21042001 Github Stats](https://github-readme-stats.vercel.app/api?username=leanhvu21042001&show_icons=true&theme=tokyonight)\n\n\n![Top Langs](https://github-readme-stats.vercel.app/api/top-langs/?username=leanhvu21042001&layout=compact&theme=tokyonight)`;

    // Modify the file content
    const commitMessage = `Update file content ${new Date().toLocaleString()}`;
    const newContent = `${defaultContent}\n\n\nNew file content (${new Date().toLocaleString()})`;
    const newContentEncoded = Buffer.from(newContent).toString("base64");

    // Update the file on GitHub
    await octokit.rest.repos.createOrUpdateFileContents({
      owner,
      repo,
      path: path,
      message: commitMessage,
      content: newContentEncoded,
      sha,
    });
  } catch (error) {
    process.exit(1);
  }
});

const port = progress.env.PORT || 5000;

app.listen(port, () => {});

