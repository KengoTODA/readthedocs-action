import { Logger } from "probot";
import { Browser, launch, Page } from "puppeteer";
const isDevelopment = process.env.NODE_ENV === "development";
import fetch from "node-fetch";
import promiseRetry from "promise-retry";

interface IProject {
  id: number;
  language: string;
}

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

  protected static async getProject(project: string): Promise<IProject> {
    return fetch(`https://readthedocs.org/api/v2/project/?slug=${project}`)
      .then((res) => res.json())
      .then((json) => {
        if (json.count === 0) {
          throw Error(`Not Found RTD project with given slug: ${project}`);
        }
        return {
          id: json.results[0].id,
          language: json.results[0].language,
        };
      });
  }

  protected static async getLanguages(project: IProject): Promise<string[]> {
    return fetch(`https://readthedocs.org/api/v2/project/${project.id}/translations/`)
      .then((res) => res.json())
      .then((json) => {
        const translations: IProject[] = json.translations;
        return translations.reduce((accumulator, currentValue) => {
          accumulator.push(currentValue.language);
          return accumulator;
        }, [project.language]);
      });
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
    return this.browser.then(async (browser) => {
      const page = await browser.newPage();
      try {
        await this.logIn(page);
        // version page could be not-ready just after creating branch, so retry sometimes
        const checked = await promiseRetry((retry, num) => {
          this.log.debug(`visiting version page (#${num} trial)...`);
          return this.visitVersionPage(page, project, branch).catch(retry);
        });

        if (!checked) {
          await this.toggleBuildActivity(page, project, branch);
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

  private async logIn(page: Page) {
    const username = process.env.RTD_USERNAME;
    const password = process.env.RTD_PASSWORD;
    if (username === undefined || password === undefined) {
      throw new Error("set RTD username and password via environment variable");
    }

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
  }

  private async visitVersionPage(page: Page, project: string, branch: string): Promise<boolean> {
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
    return checked;
  }

  private async toggleBuildActivity(page: Page, project: string, branch: string) {
    await page.goto(`https://readthedocs.org/dashboard/${escape(project)}/version/${escape(branch)}/`);
    await page.click("input#id_active");
    await page.click("form[action='.'] input[type=submit]");
  }
}
