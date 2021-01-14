export interface IRootConfig {
    rtd?: IRtdConfig;
}
interface IRtdConfig {
    project: string;
}
export declare function loadProject(config: IRootConfig | null): Promise<string>;
export {};
