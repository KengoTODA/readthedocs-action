import RTD, { IProject } from "./rtd";
export declare function deactivateProject(translates: IProject[], rtd: RTD, branch: string, githubToken: string, project: string): Promise<void>;
export declare function activateProject(translates: IProject[], rtd: RTD, branch: string, githubToken: string, project: string): Promise<void>;
