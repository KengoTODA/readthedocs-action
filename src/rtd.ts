import originalFetch from "isomorphic-fetch";
import fetchBuilder from "fetch-retry";
const fetch = fetchBuilder(originalFetch);

/**
 * RTD replaces '/' with '-' in the branch name.
 */
export function escape(name: string): string {
  if (name.indexOf("?") >= 0) {
    throw new Error(`name should not contains ? mark, but it was "${name}"`);
  }
  return name.replace(/\//g, "-");
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

/**
 * A model representing the project in the Read The Docs.
 */
export class Project {
  constructor(
    readonly id: number,
    readonly language: string,
    readonly slug: string
  ) {
    if (id < 0) {
      throw new Error("the project ID cannot be negative");
    }
    if (language.length === 0) {
      throw new Error("The language cannot be blank");
    }
    if (slug.length === 0) {
      throw new Error("The slug cannot be blank");
    }
  }

  /**
   * @param branch name of the target branch
   * @returns a URL of the Read The Docs page for the given branch
   */
  createUrl(branch: string): URL {
    return new URL(
      `https://${escape(this.slug)}.readthedocs.io/${this.language}/${escape(
        branch
      )}/`
    );
  }

  /**
   * @param branch name of the target branch
   * @returns a URL of badge which displays the status of the given branch
   * @see https://docs.readthedocs.io/en/latest/badges.html
   */
  createBadge(branch: string): URL {
    if (branch.length === 0) {
      throw new Error("The branch cannot be blank");
    }

    return new URL(
      `https://readthedocs.org/projects/${escape(
        this.slug
      )}/badge/?version=${escape(branch)}`
    );
  }
}

function convertProject(raw: IRawProject): Project {
  return new Project(raw.id, raw.language.code, raw.slug);
}

/**
 * @see https://docs.readthedocs.io/en/stable/api/v3.html#version-detail
 */
interface IVersion {
  active: boolean;
}

export default class RTD {
  public async getProject(slug: string): Promise<Project> {
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

  public async getTranslates(project: Project | string): Promise<Project[]> {
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
