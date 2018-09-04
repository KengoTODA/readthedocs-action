const puppeteer = require('puppeteer');
const isDevelopment = process.env.NODE_ENV === 'development';

module.exports = {
  enableBuild: async (project, branch, log) => {
    const browser = await puppeteer.launch({
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    });

    return new Promise(async (resolve, reject) => {
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
          log.info(`enabled RTD build for the branch ${branch} in ${project}.`);
          resolve(true);
        } else {
          log.debug(`RTD build for the branch ${branch} is already active.`);
          resolve(false);
        }
      } catch (e) {
        reject(e);
      } finally {
        await browser.close();
      }
    });
  }
};
