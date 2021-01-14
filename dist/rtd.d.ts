export interface IProject {
    id: number;
    language: string;
    slug: string;
}
export default class RTD {
    getProject(slug: string): Promise<IProject>;
    getTranslates(project: IProject | string): Promise<IProject[]>;
    private token;
    constructor(token: string);
    /**
     * @see https://docs.readthedocs.io/en/stable/api/v3.html#version-detail
     */
    getBuildActiveness(project: string, branch: string): Promise<boolean>;
    /**
     * @see https://docs.readthedocs.io/en/stable/api/v3.html#version-update
     */
    private configureBuild;
    enableBuild(project: string, branch: string): Promise<boolean>;
    disableBuild(project: string, branch: string): Promise<boolean>;
}
