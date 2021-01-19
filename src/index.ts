import * as core from "@actions/core";
import * as github from "@actions/github";
import * as service from "./service";
import RTD, { IProject } from "./rtd";

export async function run(
  getInput: (name: string, options?: core.InputOptions) => string,
  checkUpdatedDocument: (githubToken: string) => Promise<boolean>,
  activateProject: (
    translates: IProject[],
    rtd: RTD,
    branch: string,
    githubToken: string,
    project: string
  ) => Promise<void>,
  deactivateProject: (
    translates: IProject[],
    rtd: RTD,
    branch: string,
    githubToken: string,
    project: string
  ) => Promise<void>
): Promise<void> {
  const rtdToken = getInput("rtd-token", { required: true });
  const project = getInput("rtd-project", { required: true });
  const githubToken = getInput("github-token", { required: true });
  const rtd = new RTD(rtdToken);

  // Check if head repo is same with base repo
  const context = github.context;
  if (context.eventName !== "pull_request") {
    core.warning(
      `This Action does not support the given event ${context.eventName}.`
    );
    return;
  }
  const head = context.payload.pull_request?.head;
  if (head.repo === null) {
    core.info("HEAD branch not found.");
  } else if (
    context.payload.pull_request?.base.repo.full_name !== head.repo.full_name
  ) {
    core.warning("PR made from another Git repo is not supported.");
    return;
  }

  core.debug(`The payload is ${JSON.stringify(context.payload)}`);
  const isDocsUpdated = await checkUpdatedDocument(githubToken);
  if (!isDocsUpdated) {
    core.info(
      "No change found in the docs/ dir, skip building the RTD document."
    );
    return;
  }

  const branch = head.ref;
  const translates = await rtd.getTranslates(project);

  if (context.payload.action === "closed") {
    if (!branch) {
      core.warning(
        "HEAD branch not found, impossible to specify which RTD build should be disabled."
      );
      return;
    }
    await deactivateProject(translates, rtd, branch, githubToken, project);
  } else if (context.payload.pull_request?.state === "closed") {
    core.info("The target pull request is already closed, no reaction needed.");
    return;
  } else {
    await activateProject(translates, rtd, branch, githubToken, project);
  }
}

run(
  core.getInput,
  service.checkUpdatedDocument,
  service.activateProject,
  service.deactivateProject
);
