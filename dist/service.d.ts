import RTD from "./rtd";
import { Project } from "./rtd";
export declare function deactivateProject(translates: Project[], rtd: RTD, branch: string, githubToken: string, rootProject: string): Promise<void>;
export declare function activateProject(translates: Project[], rtd: RTD, branch: string, githubToken: string, rootProject: string): Promise<void>;
