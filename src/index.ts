import * as dotenv from "dotenv";
dotenv.config();

import { Application, Context } from "probot";
import buildBody from "./build_body";
import RTD from "./rtd";

module.exports = (app: Application) => {
  app.on("pull_request", async (context: Context) => {
    const log = context.log.child({
      name: "rtd-bot",
    });
    const rtd = new RTD(log);

    // enable RTD build on the target branch
    const config = await context.config<{rtd: {project: string}}>("config.yml");
    if (config === null) {
      context.github.issues.createComment(context.issue({
        body:
          "The rtd-bot is activated, but no .github/config.yml found in this repository.\n"
          + "Make sure that you have it in your default branch.",
      }));
      return;
    }
    if (config.rtd.project === "") {
      context.github.issues.createComment(context.issue({
        body:
          "The rtd-bot is activated, but .github/config.yml does not have necessary configuration.\n"
          + "Make sure that you have it in your default branch.",
      }));
      return;
    }
    const project = config.rtd.project;

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
    log.debug(`Confirmed configuration of ${branch} branch in ${project}: ${config}`);

    const translates = await RTD.getTranslates(project);
    const enabled = await Promise.all(translates.map((p) => p.slug).map((slug) => {
      return rtd.enableBuild(slug, branch);
    })).then((allResult: boolean[]) => {
      return allResult.reduce((l, r) => l || r);
    }).catch((e) => {
      context.github.issues.createComment(context.issue({
        body: e.message,
      }));
      throw e;
    });

    if (enabled) {
      log.debug(`Reporting document URL to GitHub PR page of ${branch} branch in ${project}.`);
      const body = buildBody(context.payload.pull_request.body, project, branch, translates.map((t) => t.language));
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
