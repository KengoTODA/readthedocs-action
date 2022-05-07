import * as core from "@actions/core";
import RTD from "./rtd";
import { Project } from "./rtd";
export declare function run(getInput: (name: string, options?: core.InputOptions) => string, activateProject: (translates: Project[], rtd: RTD, branch: string, githubToken: string, rootProject: string) => Promise<void>, deactivateProject: (translates: Project[], rtd: RTD, branch: string, githubToken: string, rootProject: string) => Promise<void>): Promise<void>;
