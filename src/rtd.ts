import fetch from "node-fetch";
import escape from "./escape";

interface IProject {
  id: number;
  language: string;
  slug: string;
}

/**
 * @see https://docs.readthedocs.io/en/stable/api/v3.html#version-detail
 */
interface IVersion {
  active: boolean
}

export default class RTD {
  public static async getProject(slug: string): Promise<IProject> {
    return fetch(`https://readthedocs.org/api/v2/project/?slug=${escape(slug)}`)
      .then((res) => res.json())
      .then((json) => {
        if (json.count === 0) {
          throw Error(`:sob: No RTD project found with given slug: ${slug}`);
        }
        return {
          id: json.results[0].id,
          language: json.results[0].language,
          slug,
        };
      });
  }

  public static async getTranslates(project: IProject | string): Promise<IProject[]> {
    const projectInfo = (typeof project === "string")
        ? await RTD.getProject(project)
        : project;
    return fetch(`https://readthedocs.org/api/v2/project/${projectInfo.id}/translations/`)
      .then((res) => res.json())
      .then((json) => {
        const translations: IProject[] = json.translations;
        return translations.reduce((accumulator, currentValue) => {
          accumulator.push({
            id: currentValue.id,
            language: currentValue.language,
            slug: currentValue.slug,
          });
          return accumulator;
        }, [projectInfo]);
      });
  }

  private token: string;

  constructor(token: string) {
    this.token = token;
  }

  public async getBuildActiveness(project: string, branch: string): Promise<boolean> {
    return fetch(`https://readthedocs.org/api/v3/projects/${project}/versions/${escape(branch)}/`, {
      method: 'get',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Token ${this.token}`
      }
    })
      .then((res) => res.json())
      .then((json) => json as IVersion)
      .then((ver) => ver.active);
  }

  private async configureBuild(project: string, branch: string, flag: boolean): Promise<void> {
    return fetch(`https://readthedocs.org/api/v3/projects/${project}/versions/${escape(branch)}/`, {
      method: 'patch',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Token ${this.token}`
      },
      body: `{"active": ${flag}}`
    })
      .then((res) => res.json());
  }

  public async enableBuild(project: string, branch: string): Promise<boolean> {
    return this.configureBuild(project, branch, true).then(_ => this.getBuildActiveness(project, branch));
  }

  public async disableBuild(project: string, branch: string): Promise<boolean> {
    return this.configureBuild(project, branch, false).then(_ => this.getBuildActiveness(project, branch));
  }
}
