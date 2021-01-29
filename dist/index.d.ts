import * as core from "@actions/core";
import RTD, { IProject } from "./rtd";
export declare function run(getInput: (name: string, options?: core.InputOptions) => string, activateProject: (translates: IProject[], rtd: RTD, branch: string, githubToken: string, project: string) => Promise<void>, deactivateProject: (translates: IProject[], rtd: RTD, branch: string, githubToken: string, project: string) => Promise<void>): Promise<void>;
