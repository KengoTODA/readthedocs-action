import * as core from '@actions/core'
import * as github from '@actions/github'
import buildBody from "./build_body";
import RTD from "./rtd";

async function run(): Promise<void> {
  const rtdToken = core.getInput('rtd-token', { required: true })
  const project = core.getInput('rtd-project', { required: true })
  const githubToken = core.getInput('github-token', { required: true })
  const rtd = new RTD(rtdToken);

  // Check if head repo is same with base repo
  const context = github.context
  const head = context.payload.pull_request?.head;
  if (head.repo === null) {
    core.info("HEAD branch not found.");
  } else if (context.payload.pull_request?.base.repo.full_name !== head.repo.full_name) {
    core.warning("PR made from another Git repo is not supported.");
    return;
  }

  // Check if /docs is updated
  // https://octokit.github.io/rest.js/v18#pagination
  const octokit = github.getOctokit(githubToken)
  const files = await octokit.paginate(octokit.pulls.listFiles, {
    owner: context.issue.owner,
    repo: context.issue.repo,
    pull_number: context.issue.number,
  })
  if (undefined === files.find(file => file.filename.startsWith('docs/'))) {
    core.info("no need to build RTD document.");
    return;
  }

  const branch = head.ref;
  const translates = await rtd.getTranslates(project);

  if (context.payload.action === "closed") {
    if (!branch) {
      core.warning("HEAD branch not found, impossible to specify which RTD build should be disabled.");
      return;
    }
    const disabled = await Promise.all(translates.map((p) => p.slug).map((slug) => {
      return rtd.disableBuild(slug, branch);
    })).then((allResult: boolean[]) => {
      return allResult.reduce((l, r) => l || r);
    }).catch((e) => {
      octokit.issues.createComment({
        owner: context.issue.owner,
        repo: context.issue.repo,
        issue_number: context.issue.number,
        body: e.message,
      });
      throw e;
    });
    if (disabled) {
      core.info(`Successfully disabled RTD build for ${branch} branch in ${project}.`);
    } else {
      core.info(`RTD build for ${branch} branch in ${project} is already disabled, so no reaction needed.`);
    }
  } else if (context.payload.pull_request?.state === "closed") {
    core.info("The target pull request is already closed, no reaction needed.");
    return;
  } else {
    const enabled = await Promise.all(translates.map((p) => p.slug).map((slug) => {
      return rtd.enableBuild(slug, branch);
    })).then((allResult: boolean[]) => {
      return allResult.reduce((l, r) => l || r);
    }).catch((e) => {
      octokit.issues.createComment({
        owner: context.issue.owner,
        repo: context.issue.repo,
        issue_number: context.issue.number,
        body: e.message,
      });
      throw e;
    });

    if (enabled) {
      core.info(`Reporting document URL to GitHub PR page of ${branch} branch in ${project}.`);
      const body = buildBody(context.payload.pull_request?.body || '', project, branch, translates.map((t) => t.language));
      octokit.issues.update({
        owner: context.issue.owner,
        repo: context.issue.repo,
        issue_number: context.issue.number,
        body,
      });
    } else {
      core.info(`RTD build for ${branch} branch in ${project} is already activated, so no reaction needed.`);
    }
  }
}
run()