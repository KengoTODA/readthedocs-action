import { Logger } from "probot";
import { Browser, launch } from "puppeteer";
const isDevelopment = process.env.NODE_ENV === "development";

export default class RTD {
  /**
   * RTD replaces '/' with '-' in the branch name.
   */
  protected static escape(name: string): string {
    if (name.indexOf("?") >= 0) {
      throw new Error(`name should not contains ? mark, but it was "${name}"`);
    }
    return name.replace(/\//g, "-");
  }

  private browser: Promise<Browser>;
  private log: Logger;

  constructor(log: Logger) {
    this.browser = launch({
      args: ["--no-sandbox", "--disable-setuid-sandbox"],
    });
    this.log = log;
  }

  public enableBuild(project: string, branch: string): Promise<boolean> {
    const username = process.env.RTD_USERNAME;
    const password = process.env.RTD_PASSWORD;
    if (username === undefined || password === undefined) {
      throw new Error("set RTD username and password via environment variable");
    }

    return this.browser.then(async (browser) => {
      const page = await browser.newPage();
      try {
        await page.goto("https://readthedocs.org/accounts/login/");
        await page.type("#id_login", username);
        await page.type("#id_password", password);
        if (isDevelopment) {
          await page.screenshot({
            path: "login-page.png",
          });
        }
        const navigationPromise = page.waitForNavigation();
        await page.click("button[type=submit]");
        await navigationPromise;
        if (isDevelopment) {
          await page.screenshot({
            path: "after-login-page.png",
          });
        }

        await page.goto(`https://readthedocs.org/dashboard/${escape(project)}/version/${escape(branch)}/`);
        const checkbox = await page.$("input#id_active");
        if (isDevelopment) {
          await page.screenshot({
            path: "version-page.png",
          });
        }
        if (checkbox == null) {
          throw new Error("failed to visit version page");
        }

        const checked = await (await checkbox.getProperty("checked")).jsonValue();
        if (!checked) {
          await page.click("input#id_active");
          await page.click("form[action='.'] input[type=submit]");
          this.log.info(`enabled RTD build for the branch ${branch} in ${project}.`);
          return true;
        } else {
          this.log.debug(`RTD build for the branch ${branch} is already active.`);
          return false;
        }
      } finally {
        page.close();
      }
    });
  }
}
