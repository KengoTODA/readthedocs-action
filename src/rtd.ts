import originalFetch from "isomorphic-fetch";
import fetchBuilder from "fetch-retry";
const fetch = fetchBuilder(originalFetch);
import escape from "./escape";

interface IProject {
  id: number;
  language: string;
  slug: string;
}

/**
 * The project data returned by the V3 API
 * @see https://docs.readthedocs.io/en/stable/api/v3.html#project-details
 */
interface IRawProject {
  id: number;
  language: {
    code: string;
    name: string;
  };
  slug: string;
}

function convertProject(raw: IRawProject): IProject {
  return {
    id: raw.id,
    slug: raw.slug,
    language: raw.language.code,
  };
}

/**
 * @see https://docs.readthedocs.io/en/stable/api/v3.html#version-detail
 */
interface IVersion {
  active: boolean;
}

export default class RTD {
  public async getProject(slug: string): Promise<IProject> {
    return fetch(`https://readthedocs.org/api/v3/projects/${escape(slug)}/`, {
      method: "get",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Token ${this.token}`,
      },
    })
      .then((res) => Promise.all([res.status, res.json()]))
      .then(([status, json]) => {
        if (status != 200) {
          throw new Error(
            `Unexpected status code ${status} with body: ${JSON.stringify(
              json
            )}`
          );
        }
        return convertProject(json);
      });
  }

  public async getTranslates(project: IProject | string): Promise<IProject[]> {
    const projectInfo =
      typeof project === "string" ? await this.getProject(project) : project;
    return fetch(
      `https://readthedocs.org/api/v3/projects/${escape(
        projectInfo.slug
      )}/translations/`,
      {
        method: "get",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Token ${this.token}`,
        },
      }
    )
      .then((res) => {
        return Promise.all([res.status, res.json()]);
      })
      .then(([status, json]) => {
        if (status !== 200) {
          throw new Error(
            `Unexpected status code ${status} with body: ${JSON.stringify(
              json
            )}`
          );
        }
        return json["results"] as IRawProject[];
      })
      .then((translations) => {
        return translations.reduce(
          (accumulator, currentValue) => {
            accumulator.push(convertProject(currentValue));
            return accumulator;
          },
          [projectInfo]
        );
      });
  }

  private token: string;

  constructor(token: string) {
    this.token = token;
  }

  /**
   * @see https://docs.readthedocs.io/en/stable/api/v3.html#version-detail
   */
  public async getBuildActiveness(
    project: string,
    branch: string
  ): Promise<boolean> {
    return fetch(
      `https://readthedocs.org/api/v3/projects/${project}/versions/${escape(
        branch
      )}/`,
      {
        method: "get",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Token ${this.token}`,
        },
        retryOn: [400],
      }
    )
      .then((res) => {
        return Promise.all([res.status, res.json()]);
      })
      .then(([status, json]) => {
        if (status != 200) {
          throw new Error(
            `Unexpected status code ${status} with body: ${JSON.stringify(
              json
            )}`
          );
        }
        return json as IVersion;
      })
      .then((ver) => ver.active);
  }

  /**
   * @see https://docs.readthedocs.io/en/stable/api/v3.html#version-update
   */
  private async configureBuild(
    project: string,
    branch: string,
    flag: boolean
  ): Promise<boolean> {
    const currentFlag = await this.getBuildActiveness(project, branch);
    if (currentFlag === flag) {
      // no need to ask for update
      return false;
    }
    // this implementation doesn't care the transaction, so
    // the returned value could be different with expected one
    // if we run two procedures at the same time
    return fetch(
      `https://readthedocs.org/api/v3/projects/${project}/versions/${escape(
        branch
      )}/`,
      {
        method: "patch",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Token ${this.token}`,
        },
        body: `{"active": ${flag}}`,
      }
    )
      .then((res) => {
        if (res.status != 204) {
          return Promise.all([res.status, res.json()]);
        } else {
          // 204 responses empty text, so json() doesn't work
          return Promise.all([res.status, res.text()]);
        }
      })
      .then(([status, json]) => {
        if (status != 204) {
          throw new Error(
            `Unexpected status code ${status} with body: ${JSON.stringify(
              json
            )}`
          );
        }
        return true;
      });
  }

  public async enableBuild(project: string, branch: string): Promise<boolean> {
    return this.configureBuild(project, branch, true);
  }

  public async disableBuild(project: string, branch: string): Promise<boolean> {
    return this.configureBuild(project, branch, false);
  }
}
