import escape from "./escape";

const START = "[//]: # (rtdbot-start)\n";
const END = "[//]: # (rtdbot-end)\n";

export default function buildBody(existingBody: string, project: string, branch: string, languages: string[]): string {
  if (existingBody.indexOf(START) >= 0) {
    return existingBody;
  }

  let body = existingBody + `\n\n${START}\n`;
  if (languages.length === 1) {
    const url = `https://${escape(project)}.readthedocs.io/${languages[0]}/${escape(branch)}/`;
    body += `URL of RTD document: ${url}\n`;
  } else {
    body += "URL of RTD documents:\n";
    languages.forEach((language) => {
      body += `${language}: https://${escape(project)}.readthedocs.io/${language}/${escape(branch)}/\n`;
    });
  }
  return body + "\n" + END;
}
