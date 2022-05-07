import { Project } from "./rtd";

const START = "[//]: # (rtdbot-start)\n";
const END = "[//]: # (rtdbot-end)\n";

export default function buildBody(
  existingBody: string,
  projects: Project[],
  branch: string
): string {
  if (existingBody.indexOf(START) >= 0) {
    return existingBody;
  }

  let body = existingBody + `\n\n${START}\n`;
  if (projects.length === 1) {
    const url = projects[0].createUrl(branch);
    const badge = projects[0].createBadge(branch);
    body += `URL of RTD document: ${url} ![Documentation Status](${badge})\n`;
  } else if (projects.length > 1) {
    body += "URL of RTD documents:\n";
    projects.forEach((p) => {
      const url = p.createUrl(branch);
      body += `${p.language}: ${url}\n`;
    });
  }
  return body + "\n" + END;
}
