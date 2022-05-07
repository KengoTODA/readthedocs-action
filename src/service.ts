import * as core from "@actions/core";
import * as github from "@actions/github";
import buildBody from "./build_body";
import RTD from "./rtd";
import { Project } from "./rtd";

export async function deactivateProject(
  translates: Project[],
  rtd: RTD,
  branch: string,
  githubToken: string,
  rootProject: string
): Promise<void> {
  const context = github.context;
  const octokit = github.getOctokit(githubToken);
  const disabled = await Promise.all(
    translates
      .map((p) => p.slug)
      .map((slug) => {
        return rtd.disableBuild(slug, branch);
      })
  )
    .then((allResult: boolean[]) => {
      return allResult.reduce((l, r) => l || r);
    })
    .catch((e) => {
      octokit.rest.issues.createComment({
        owner: context.issue.owner,
        repo: context.issue.repo,
        issue_number: context.issue.number,
        body: e.message,
      });
      throw e;
    });
  if (disabled) {
    core.info(
      `Successfully disabled RTD build for ${branch} branch in ${rootProject}.`
    );
  } else {
    core.info(
      `RTD build for ${branch} branch in ${rootProject} is already disabled, so no reaction needed.`
    );
  }
}

export async function activateProject(
  translates: Project[],
  rtd: RTD,
  branch: string,
  githubToken: string,
  rootProject: string
): Promise<void> {
  const context = github.context;
  const octokit = github.getOctokit(githubToken);
  const enabled = await Promise.all(
    translates
      .map((p) => p.slug)
      .map((slug) => {
        return rtd.enableBuild(slug, branch);
      })
  )
    .then((allResult: boolean[]) => {
      return allResult.reduce((l, r) => l || r);
    })
    .catch((e) => {
      octokit.rest.issues.createComment({
        owner: context.issue.owner,
        repo: context.issue.repo,
        issue_number: context.issue.number,
        body: e.message,
      });
      throw e;
    });

  if (enabled) {
    core.info(
      `Reporting document URL to GitHub PR page of ${branch} branch in ${rootProject}.`
    );
    const body = buildBody(
      context.payload.pull_request?.body || "",
      translates,
      branch
    );
    octokit.rest.issues.update({
      owner: context.issue.owner,
      repo: context.issue.repo,
      issue_number: context.issue.number,
      body,
    });
  } else {
    core.info(
      `RTD build for ${branch} branch in ${rootProject} is already activated, so no reaction needed.`
    );
  }
}
