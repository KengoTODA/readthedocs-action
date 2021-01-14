export interface IRootConfig {
    rtd?: IRtdConfig;
  }
  
  interface IRtdConfig {
    project: string;
  }
  
export async function loadProject(config: IRootConfig | null): Promise<string> {
if (config === null) {
    throw new Error("The rtd-bot is activated, but no .github/config.yml found in this repository.\n"
        + "Make sure that you have it in your default branch.");
}
if (config.rtd === undefined) {
    throw new Error("The rtd-bot is activated, but .github/config.yml does not have necessary configuration.\n"
        + "Make sure that the config file contains `rtd` config.")
}
if (config.rtd.project === undefined || config.rtd.project === "") {
    throw new Error("The rtd-bot is activated, but .github/config.yml does not have necessary configuration.\n"
    + "Make sure that the config file contains `rtd.project` config.")
}
return config.rtd.project;
}
