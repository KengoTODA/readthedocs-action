require('dotenv').config()
const puppeteer = require('puppeteer');

module.exports = app => {
  app.on('pull_request', async context => {
    // TODO Check if head repo is same with base repo

    // Check if /docs is updated
    // https://octokit.github.io/rest.js/#api-PullRequests-getFiles
    const params = context.issue({});
    const files = await context.github.pullRequests.getFiles(params);
    if (undefined === files.find(file => file.filename.startsWith('docs/'))) {
      // no need to build RTD document
      return;
    }

    // enable RTD build on the target branch
    const config = await context.config('rtd.yml');
    const pullRequest = await context.github.pullRequests.get(params);
    const branch = pullRequest.head.label;
    enableBuild(config.rtd.project, pullRequest.head.label);

    // report build result with its URL
    // TODO support other language
    const url = `https://${config.project}.readthedocs.io/en/${branch}/`;
    context.github.pullRequests.createComment(context.issue({
      body: `Check generated document at ${url}`
    }));
  })
}

const enableBuild = async (project, branch) => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.goto('https://readthedocs.org/accounts/login/');
  await page.type('#id_login', process.env.RTD_USERNAME);
  await page.type('#id_password', process.env.RTD_PASSWORD);
  await page.click("button[type='submit']");
  await page.goto(`https://readthedocs.org/dashboard/${project}/version/${branch}/`); // TODO escape?
  const checkbox = await page.$(`input#id_active`);
  const checked = await (await checkbox.getProperty('checked')).jsonValue()
  if (!checked) {
    await page.click('input#id_active');
    await page.click("form[action='.'] input[type=submit]");
    // TODO consider to set privacy level as 'public'
    console.info(`enabled RTD build for the branch ${branch}.`);
  } else {
    console.info(`RTD build for the branch ${branch} is already active.`);
  }
  await browser.close();
};
