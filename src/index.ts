import * as dotenv from "dotenv";
dotenv.config();

import { Application, Context } from "probot";
import RTD from "./rtd";
const escape = RTD.escape;

function buildBody(context: Context, project: string, branch: string, languages: string[]): string {
  let body = context.payload.pull_request.body + "\n\n<!-- updated by rtd-bot -->\n";
  if (languages.length === 1) {
    const url = `https://${escape(project)}.readthedocs.io/${languages[0]}/${escape(branch)}/`;
    body += `URL of RTD document: ${url}\n`;
  } else {
    body += "URL of RTD documents:\n";
    languages.forEach((language) => {
      body += `${language}: https://${escape(project)}.readthedocs.io/${language}/${escape(branch)}/\n`;
    });
  }
  return body;
}

module.exports = (app: Application) => {
  app.on("pull_request", async (context: Context) => {
    const log = context.log.child({
      name: "rtd-bot",
    });
    const rtd = new RTD(log);

    // enable RTD build on the target branch
    const config = await context.config("config.yml", {
      rtd: {
        project: undefined,
      },
    });
    if (!config || !config.rtd || !config.rtd.project) {
      context.github.issues.createComment(context.issue({
        body: "rtd-bot is activated, but .github/config.yml does not have necessary configuration.",
      }));
      return;
    }
    const project = config.rtd.project + "";

    // Check if head repo is same with base repo
    if (context.payload.pull_request.base.repo.full_name !== context.payload.pull_request.head.repo.full_name) {
      log.debug("PR made from another Git repo is not supported.");
      return;
    }

    // Check if /docs is updated
    // https://octokit.github.io/rest.js/#api-PullRequests-getFiles
    const files = await context.github.pullRequests.getFiles(context.issue({}));
    if (undefined === files.data.find((file: {filename: string}) => file.filename.startsWith("docs/"))) {
      log.debug("no need to build RTD document.");
      return;
    }

    const branch = context.payload.pull_request.head.ref;
    log.debug(`Confirned configuration of ${branch} branch in ${project}: ${config}`);

    const enabled = await rtd.enableBuild(project, branch);

    if (enabled) {
      log.debug(`Reporting document URL to GitHub PR page of ${branch} branch in ${project}.`);
      const languages = await RTD.getLanguages(project);
      const body = buildBody(context, project, branch, languages);
      context.github.issues.edit(context.issue({
        body,
      }));
    } else {
      log.debug(`RTD build for ${branch} branch in ${project} is already activated.`);
    }
  });

  const router = app.route("/welcome");
  router.get("/", (_, res) => {
    res.sendFile(__dirname + "/welcome.html");
  });
};
