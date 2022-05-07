/**
 * RTD replaces '/' with '-' in the branch name.
 */
export declare function escape(name: string): string;
/**
 * A model representing the project in the Read The Docs.
 */
export declare class Project {
    readonly id: number;
    readonly language: string;
    readonly slug: string;
    constructor(id: number, language: string, slug: string);
    /**
     * @param branch name of the target branch
     * @returns a URL of the Read The Docs page for the given branch
     */
    createUrl(branch: string): URL;
    /**
     * @param branch name of the target branch
     * @returns a URL of badge which displays the status of the given branch
     * @see https://docs.readthedocs.io/en/latest/badges.html
     */
    createBadge(branch: string): URL;
}
export default class RTD {
    getProject(slug: string): Promise<Project>;
    getTranslates(project: Project | string): Promise<Project[]>;
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
