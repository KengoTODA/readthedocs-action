import * as dotenv from "dotenv";
dotenv.config();

import express from "express";
import { Application, Context } from "probot";
import buildBody from "./build_body";
import RTD from "./rtd";

interface IRootConfig {
  rtd: IRtdConfig;
}

interface IRtdConfig {
  project: string;
}

module.exports = (app: Application) => {
  app.on("pull_request", async (context: Context) => {
    const log = context.log.child({
      name: "rtd-bot",
    });
    const rtd = new RTD(log);

    // enable RTD build on the target branch
    const config: IRootConfig | null = await context.config<IRootConfig>("config.yml") as IRootConfig;
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
    const head = context.payload.pull_request.head;
    if (head.repo === null) {
      log.debug("HEAD branch not found.");
    } else if (context.payload.pull_request.base.repo.full_name !== head.repo.full_name) {
      log.debug("PR made from another Git repo is not supported.");
      return;
    }

    // Check if /docs is updated
    // https://octokit.github.io/rest.js/#api-Pulls-listFiles
    const options = context.github.pulls.listFiles.endpoint.merge(context.issue({}));
    const files = await context.github.paginate(options);
    if (undefined === files.find((file: {filename: string}) => file.filename.startsWith("docs/"))) {
      log.debug("no need to build RTD document.");
      return;
    }

    const branch = head.ref;
    log.debug(`Confirmed configuration of ${branch} branch in ${project}: ${config}`);

    const translates = await RTD.getTranslates(project);

    if (context.payload.action === "closed") {
      if (!branch) {
        log.debug("HEAD branch not found, impossible to specify which RTD build should be disabled.");
        return;
      }
      const disabled = await Promise.all(translates.map((p) => p.slug).map((slug) => {
        return rtd.disableBuild(slug, branch);
      })).then((allResult: boolean[]) => {
        return allResult.reduce((l, r) => l || r);
      }).catch((e) => {
        context.github.issues.createComment(context.issue({
          body: e.message,
        }));
        throw e;
      });
      if (disabled) {
        log.debug(`Disabled RTD build for ${branch} branch in ${project}.`);
      } else {
        log.debug(`RTD build for ${branch} branch in ${project} is already disabled.`);
      }
    } else if (context.payload.pull_request.state === "closed") {
      log.debug("The target pull request is already closed, no reaction needed.");
      return;
    } else {
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
        context.github.issues.update(context.issue({
          body,
        }));
      } else {
        log.debug(`RTD build for ${branch} branch in ${project} is already activated.`);
      }
    }
  });

  const router = app.route("/welcome");
  router.get("/", (_, res) => {
    res.sendFile(__dirname + "/welcome.html");
  });

  app.route("/static").use(express.static("asset"));
};
