require('dotenv').config()
const puppeteer = require('puppeteer');
const isDevelopment = process.env.NODE_ENV === 'development';

module.exports = app => {
  app.on('pull_request', async context => {
    // enable RTD build on the target branch
    const config = await context.config('config.yml');
    if (!config.rtd || !config.rtd.project) {
      context.github.issues.createComment(context.issue({
        body: 'rtd-bot is activated, but .github/rtd.yml does not have necessary configuration.',
      }));
      return;
    }

    // TODO Check if head repo is same with base repo

    // Check if /docs is updated
    // https://octokit.github.io/rest.js/#api-PullRequests-getFiles
    const files = await context.github.pullRequests.getFiles(context.issue({}));
    if (undefined === files.data.find(file => file.filename.startsWith('docs/'))) {
      console.debug('no need to build RTD document.');
      return;
    }

    const branch = context.payload.pull_request.head.ref;
    const enabled = await enableBuild(config.rtd.project, branch);

    if (enabled) {
      // report build result with its URL
      // TODO support other language
      const url = `https://${config.rtd.project}.readthedocs.io/en/${branch}/`;
      context.github.issues.createComment(context.issue({
        body: `RTD build has been started. Check generated document at ${url} later`,
      }));
    }
  })
}

const enableBuild = async (project, branch) => {
  const browser = await puppeteer.launch({
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  return new Promise(function(resolve, reject) {
    try {
      const page = await browser.newPage();
      await page.goto('https://readthedocs.org/accounts/login/');
      await page.type('#id_login', process.env.RTD_USERNAME);
      await page.type('#id_password', process.env.RTD_PASSWORD);
      await page.click("button[type='submit']");
      await page.screenshot({
        path: 'login-page.png'
      });
      await page.goto(`https://readthedocs.org/dashboard/${project}/version/${branch}/`); // TODO escape?
      const checkbox = await page.$('input#id_active');
      await page.screenshot({
        path: 'version-page.png'
      });
      const checked = await (await checkbox.getProperty('checked')).jsonValue()
      if (!checked) {
        await page.click('input#id_active');
        await page.click("form[action='.'] input[type=submit]");
        // TODO consider to set privacy level as 'public'
        console.info(`enabled RTD build for the branch ${branch} in ${project}.`);
        resolve(true);
      } else {
        console.debug(`RTD build for the branch ${branch} is already active.`);
        resolve(false);
      }
    } catch (e) {
      reject(e);
    } finally {
      await browser.close();
    }
  });
};
