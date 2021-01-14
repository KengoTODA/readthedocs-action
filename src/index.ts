import * as dotenv from "dotenv";
dotenv.config();

import express from "express";
import { ApplicationFunctionOptions, Probot, Context } from "probot";
import buildBody from "./build_body";
import RTD from "./rtd";
import { IRootConfig, loadProject } from "./config"

export = (app: Probot, { getRouter }: ApplicationFunctionOptions) => {
  if (!getRouter) {
    throw new Error("getRouter is required to use the rtd-bot app");
  }
  app.on("pull_request", async (context: Context) => {
    const log = context.log.child({
      name: "rtd-bot",
    });
    const token = process.env.RTD_TOKEN;
    if (token == undefined) {
      throw new Error('RTD_TOKEN is not set');
    }
    const rtd = new RTD(token);
    let project: string

    try {
      const config: IRootConfig | null = await context.config<IRootConfig>("config.yml") as IRootConfig;
      project = await loadProject(config)
    } catch (e) {
      context.octokit.issues.createComment(context.issue({
        body: e.message,
      }));
      return;
    }

    // Check if head repo is same with base repo
    const head = context.payload.pull_request.head;
    if (head.repo === null) {
      log.debug("HEAD branch not found.");
    } else if (context.payload.pull_request.base.repo.full_name !== head.repo.full_name) {
      log.debug("PR made from another Git repo is not supported.");
      return;
    }

    // Check if /docs is updated
    // https://octokit.github.io/rest.js/v18#pagination
    const files = await context.octokit.paginate(context.octokit.pulls.listFiles, context.pullRequest({}))
    if (undefined === files.find(file => file.filename.startsWith('docs/'))) {
      log.debug("no need to build RTD document.");
      return;
    }

    const branch = head.ref;
    const translates = await rtd.getTranslates(project);

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
        context.octokit.issues.createComment(context.issue({
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
        context.octokit.issues.createComment(context.issue({
          body: e.message,
        }));
        throw e;
      });

      if (enabled) {
        log.debug(`Reporting document URL to GitHub PR page of ${branch} branch in ${project}.`);
        const body = buildBody(context.payload.pull_request.body, project, branch, translates.map((t) => t.language));
        context.octokit.issues.update(context.issue({
          body,
        }));
      } else {
        log.debug(`RTD build for ${branch} branch in ${project} is already activated.`);
      }
    }
  });

  getRouter("/welcome").get("/", (req: express.Request, res: express.Response) => {
    res.sendFile(__dirname + "/welcome.html");
  });

  getRouter("/static").use(express.static("asset"));
};
