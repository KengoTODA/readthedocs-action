import RTD, { IProject } from "./rtd";
export declare function run(checkUpdatedDocument: (githubToken: string) => Promise<boolean>, activateProject: (translates: IProject[], rtd: RTD, branch: string, githubToken: string, project: string) => Promise<void>, deactivateProject: (translates: IProject[], rtd: RTD, branch: string, githubToken: string, project: string) => Promise<void>): Promise<void>;
