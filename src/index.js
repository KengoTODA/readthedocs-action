require('dotenv').config()
const rtd = require('./rtd.js');

module.exports = app => {
  app.on('pull_request', async context => {
    const log = context.log.child({
      name: 'rtd-bot',
      event: context.event.event,
      action: context.payload.action,
      account: repo.owner.id,
      repo: repo.id
    });

    // enable RTD build on the target branch
    const config = await context.config('config.yml', {
      rtd: {
        language: 'en'
      }
    });
    if (!config.rtd || !config.rtd.project) {
      context.github.issues.createComment(context.issue({
        body: 'rtd-bot is activated, but .github/rtd.yml does not have necessary configuration.',
      }));
      return;
    }

    // Check if head repo is same with base repo
    if (context.payload.pull_request.base.repo.full_name !== context.payload.pull_request.head.repo.full_name) {
      log.debug('PR made from another Git repo is not supported.');
      return;
    }

    // Check if /docs is updated
    // https://octokit.github.io/rest.js/#api-PullRequests-getFiles
    const files = await context.github.pullRequests.getFiles(context.issue({}));
    if (undefined === files.data.find(file => file.filename.startsWith('docs/'))) {
      log.debug('no need to build RTD document.');
      return;
    }

    const branch = context.payload.pull_request.head.ref;
    const enabled = await rtd.enableBuild(config.rtd.project, branch, log);

    if (enabled) {
      // report build result with its URL
      const url = `https://${config.rtd.project}.readthedocs.io/${config.rtd.language}/${branch}/`;
      context.github.issues.createComment(context.issue({
        body: `RTD build has been started. Check generated document at ${url} later`,
      }));
    }
  })
};
