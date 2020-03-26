import { GitHubAPI } from "probot/lib/github";

/**
 * Create GitHub Checks Run for the given commit.
 * 
 * @param github Octokit instance to communicate with GitHub
 * @param owner Owner of the target repository
 * @param repo Name of the target repository
 * @param head_sha SHA of the target commit
 * @param langs List of languages of document
 */
export async function createChecks(github: GitHubAPI, owner: string, repo: string, head_sha: string, langs: string[]): Promise<void> {
    if (langs.length == 1) {
        const name = `Read The Docs - staging build`;
        const promise = github.checks.create({
            owner, repo, name, head_sha, external_id: langs[0]
        });
        return Promise.all([promise]).then(r => void 0);
    } else {
        return Promise.all(langs.map((lang: string) => {
            const name = `Read The Docs - staging build (${lang})`;
            return github.checks.create({
                owner, repo, name, head_sha, external_id: lang
            });
        })).then(r => void 0);
    }
}

export type CheckRun = {
    external_id: string
}
export type CheckStatus = 'in_progress' | 'completed';
export type CheckConclusion = 'success' | 'failure' | 'neutral' | 'cancelled' | 'timed_out' | 'action_required';
export type CheckUpdateOption = { 
    status: 'completed', conclusion: CheckConclusion
} | {
    status: 'in_progress'
}
export function getLang(check_run: {
    external_id: string
}) {
    return check_run.external_id;
}
export async function updateCheck(github: GitHubAPI, owner: string, repo: string, check_run_id: number, option: CheckUpdateOption): Promise<void> {
    return github.checks.update({
        owner, repo,
        check_run_id,
        status: option.status,
        conclusion: option['conclusion']
    }).then(res => void 0);
}