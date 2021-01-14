const assert = require('assert');
const loadProject = require("../src/config").loadProject

describe("config file handling", () => {
    it("throws error if no config file exists in the default branch", async () => {
        assert.rejects(async () => {
            await loadProject(null)
        }, Error, '');
    })
    it("throws error if no `rtd` exists in the file", async () => {
        assert.rejects(async () => {
            await loadProject({})
        }, Error, `The rtd-bot is activated, but .github/config.yml does not have necessary configuration.
        Make sure that the config file contains \`rtd\` config.`);
    })
    it("throws error if no `rtd.project` exists in the file", async () => {
        assert.rejects(async () => {
            await loadProject({ rtd: {} })
        }, Error, `The rtd-bot is activated, but .github/config.yml does not have necessary configuration.
        Make sure that the config file contains \`rtd.project\` config.`);
    })
    it("throws error if `rtd.project` is empty", async () => {
        assert.rejects(async () => {
            await loadProject({ rtd: { project: "" } })
        }, Error, `The rtd-bot is activated, but .github/config.yml does not have necessary configuration.
        Make sure that the config file contains \`rtd.project\` config.`);
    })
})