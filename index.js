const { Octokit } = require("@octokit/rest");
const cron = require("node-cron");
require("dotenv").config();

const token = process.env.token;

const octokit = new Octokit({
  auth: token,
});

const owner = "leanhvu21042001";
const repo = "leanhvu21042001";
const path = "tasks.md";

cron.schedule("1-59 * * * *", async () => {
  try {
    // Get the existing file content
    const {
      data: { _content, sha },
    } = await octokit.rest.repos.getContent({
      owner,
      repo,
      path: path,
    });

    const defaultContent = `# Hi there 👋\n\n\nMy name is LAV. I love many things, but programming has had a special place in my heart ever since a young age. Here is some info on me.\n\n\n🌱 I’m currently learning ReactJS, NodeJS, ExpressJS, NestJS, Laravel, Java, C# ...\n\n\n📫 How to reach me: https://www.facebook.com/nhatcungtom\n\n\n**Languages and Tools:**\t<code><img height="20" src="https://raw.githubusercontent.com/github/explore/80688e429a7d4ef2fca1e82350fe8e3517d3494d/topics/javascript/javascript.png"></code><code><img height="20" src="https://raw.githubusercontent.com/github/explore/80688e429a7d4ef2fca1e82350fe8e3517d3494d/topics/react/react.png"></code><code><img height="20" src="https://raw.githubusercontent.com/github/explore/80688e429a7d4ef2fca1e82350fe8e3517d3494d/topics/nodejs/nodejs.png"></code>\n\n\n![leanhvu21042001 Github Stats](https://github-readme-stats.vercel.app/api?username=leanhvu21042001&show_icons=true&theme=tokyonight)\n\n\n![Top Langs](https://github-readme-stats.vercel.app/api/top-langs/?username=leanhvu21042001&layout=compact&theme=tokyonight)`;

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
