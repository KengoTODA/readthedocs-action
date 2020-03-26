import * as dotenv from "dotenv";
dotenv.config();

import express from "express";
import { Application, Context } from "probot";
import buildBody from "./build_body";
import RTD from "./rtd";
import { createChecks, getLang, updateCheck } from "./checks";

interface IRootConfig {
  rtd: IRtdConfig;
}

interface IRtdConfig {
  project: string;
}

const APP_IDENTIFIER = process.env.APP_ID;

export = (app: Application) => {
  app.on("pull_request", async (context: Context) => {
    const log = context.log.child({
      name: "rtd-bot",
    });
    const token = process.env.RTD_TOKEN;
    if (token == undefined) {
      throw new Error('RTD_TOKEN is not set');
    }
    const rtd = new RTD(token);

    let config: IRootConfig, head, project;
    try {
      config = await loadConfig(context);
      project = config.rtd.project;
      head = getHead(context);
    } catch (e) {
      context.github.issues.createComment(context.issue({
        body: e.message,
      }));
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
    log.debug(`Confirmed configuration of %s branch in %s: %s`, branch, project, config);

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
  app.on("check_suite", async (context: Context) => {
    try {
      // A new check_suite has been created. Create a new check run with status queued
      if (context.payload.action == "requested" || context.payload.action == "rerequested") {
        createCheckRun(context);
      }
    } catch (e) {
      context.github.issues.createComment(context.issue({
        body: e.message,
      }));
    }
  });
  app.on("check_run", async (context: Context) => {
    try {
      // Check that the event is being sent to this app
      if (context.payload.check_run.app.id !== APP_IDENTIFIER) {
        return;
      }
      if (context.payload.action == "created") {
        initiateCheckRun(context);
      }
      if (context.payload.action == "rerequested") {
        createCheckRun(context);
      }
    } catch (e) {
      context.github.issues.createComment(context.issue({
        body: e.message,
      }));
    }
  });

  const router = app.route("/welcome");
  router.get("/", (req: express.Request, res: express.Response) => {
    res.sendFile(__dirname + "/welcome.html");
  });

  app.route("/static").use(express.static("asset"));
};

async function loadConfig(context: Context) {
  // enable RTD build on the target branch
  const config: IRootConfig | null = await context.config<IRootConfig>("config.yml") as IRootConfig;
  if (config === null) {
    throw new Error("The rtd-bot is activated, but no .github/config.yml found in this repository.\n"
      + "Make sure that you have it in your default branch.");
  }
  if (config.rtd.project === "") {
    throw new Error(
        "The rtd-bot is activated, but .github/config.yml does not have necessary configuration.\n"
        + "Make sure that you have it in your default branch."
    );
  }
  return config;
}
function createRTD() {
  const token = process.env.RTD_TOKEN;
  if (token == undefined) {
    throw new Error('RTD_TOKEN is not set');
  }

  return new RTD(token);
}
function getHead(context: Context): { sha: string, ref: string } {
  // Check if head repo is same with base repo
  const head = context.payload.pull_request.head;
  if (head.repo === null) {
    throw new Error("HEAD branch not found.");
  } else if (context.payload.pull_request.base.repo.full_name !== head.repo.full_name) {
    throw new Error("PR made from another Git repo is not supported.");
  }
  return head;
}
async function createCheckRun(context: Context) {
  const rtd = createRTD();
  let config: IRootConfig, head:  { sha: string }, project;
  try {
    config = await loadConfig(context);
    project = config.rtd.project;
    head = getHead(context);
  } catch (e) {
    context.github.issues.createComment(context.issue({
      body: e.message,
    }));
    return;
  }

  return rtd.getTranslates(project).then(projects => {
    const repo = context.repo();
    const sha = head.sha;
    const langs = projects.map(project => project.language);
    createChecks(context.github, repo.owner, repo.repo, sha, langs);
  });
}
async function initiateCheckRun(context: Context) {
  const log = context.log.child({
    name: "rtd-bot",
  });
  const rtd = createRTD();
  let config: IRootConfig, head:  { sha: string, ref: string }, project;
  try {
    config = await loadConfig(context);
    project = config.rtd.project;
    head = getHead(context);
  } catch (e) {
    context.github.issues.createComment(context.issue({
      body: e.message,
    }));
    return;
  }
  const repo = context.repo();
  const check_run_id = context.payload.check_run.id;
  const lang = getLang(context.payload.check_run);
  const branch = head.ref;
  const slug = await rtd.getTranslates(project).then(translates => {
    return translates.filter(translate => translate.language === lang).map(translate => translate.slug);
  }).then(slugs => {
    if (slugs.length !== 1) {
      log.debug(`Translate not found for project ${repo.owner}/${repo.repo} with language ${lang}`);
      return null;
    } else {
      return slugs[0];
    }
  });
  if (slug === null) {
    return;
  }

  const enabled = await rtd.enableBuild(slug, branch);
  if (enabled) {
    log.debug(`Reporting document URL to GitHub PR page of ${branch} branch in ${project}.`);
  } else {
    log.debug(`RTD build for ${branch} branch in ${project} is already activated.`);
  }
  // TODO trigger the build? https://docs.readthedocs.io/en/stable/api/v3.html#build-triggering
  // TODO use 'in-progress' status, then watch the build result and set 'completed' status after the build
  updateCheck(context.github, repo.owner, repo.repo, check_run_id, {
    status: 'completed',
    conclusion: 'neutral'
  });
}