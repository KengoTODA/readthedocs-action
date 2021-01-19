import * as core from "@actions/core";
import * as github from "@actions/github";
import { run } from "../src/index";
import { config } from "dotenv";
config();

function getInput(name: string, options?: core.InputOptions): string {
  if (name === "rtd-token") {
    return process.env.RTD_TOKEN || name;
  } else if (name === "rtd-project") {
    return "your-read-the-docs-project";
  } else {
    return name;
  }
}

describe("Integration Test", () => {
  jest.setTimeout(15 * 1000);
  describe("When a push event triggers the action", () => {
    beforeEach(() => {
      github.context.eventName = "push";
    });
    it("requests nothing to RTD nor GitHub", async () => {
      const f = jest.fn();
      const result = await run(getInput, f, f, f);
      expect(f).not.toBeCalled();
      return result;
    });
  });
  describe("When a pull_request.closed event triggers the action", () => {
    beforeEach(() => {
      github.context.eventName = "pull_request";
      github.context.payload = {
        action: "closed",
        pull_request: {
          number: 1,
          head: {
            owner: "owner",
            repo: "repo",
            full_name: "owner/repo",
          },
          base: {
            owner: "owner",
            repo: "repo",
            full_name: "owner/repo",
          },
        },
      };
    });
    it("marks the RTD version inactive", async () => {
      const f = jest.fn();
      const deactivateProject = jest.fn();
      // found a bug: better to try deactivation even though /docs has no update
      const result = await run(getInput, f, f, deactivateProject);
      expect(f).not.toBeCalled();
      expect(deactivateProject).toBeCalled();
      return result;
    });
  });
  describe("When other pull_request events trigger the action", () => {
    beforeEach(() => {
      github.context.eventName = "pull_request";
      github.context.payload = {
        action: "opened",
        pull_request: {
          number: 1,
          head: {
            owner: "owner",
            repo: "repo",
            full_name: "owner/repo",
          },
          base: {
            owner: "owner",
            repo: "repo",
            full_name: "owner/repo",
          },
        },
      };
    });
    describe("If no document is updated", () => {
      const checkUpdatedDocument = () => Promise.resolve(false);

      it("requests nothing to RTD", async () => {
        const f = jest.fn();
        const result = await run(getInput, checkUpdatedDocument, f, f);
        expect(f).not.toBeCalled();
        return result;
      });
      test.todo("changes nothing in the GitHub PR");
    });
    describe("If document files are updated", () => {
      const checkUpdatedDocument = () => Promise.resolve(true);

      it("marks the RTD version active", async () => {
        const f = jest.fn();
        const activateProject = jest.fn();
        const result = await run(
          getInput,
          checkUpdatedDocument,
          activateProject,
          f
        );
        expect(activateProject).toBeCalled();
        expect(f).not.toBeCalled();
        return result;
      });
      describe("If PR body contains links to RTD", () => {
        test.todo("changes nothing in the GitHub PR");
      });
      describe("If PR body contains no link to RTD", () => {
        test.todo("adds links to RTD into the PR body");
      });
    });
  });
});
