import * as core from "@actions/core";
import * as github from "@actions/github";
import { run } from "../src/index";
import { config } from "dotenv";
import { expect, jest, it, describe, beforeEach, test } from "@jest/globals";
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

const integrationTest = process.env["RTD_TOKEN"] ? describe : describe.skip;
integrationTest("Integration Test", () => {
  jest.setTimeout(15 * 1000);
  describe("When a push event triggers the action", () => {
    beforeEach(() => {
      github.context.eventName = "push";
    });
    it("requests nothing to RTD nor GitHub", async () => {
      const f: () => Promise<void> = jest.fn();
      const result = await run(getInput, f, f);
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
            ref: "changes",
            repo: {
              full_name: "owner/repo",
            },
          },
          base: {
            repo: {
              full_name: "owner/repo",
            },
          },
        },
      };
    });
    it("marks the RTD version inactive", async () => {
      const f: () => Promise<void> = jest.fn();
      const deactivateProject: () => Promise<void> = jest.fn();
      const result = await run(getInput, f, deactivateProject);
      expect(f).not.toBeCalled();
      expect(deactivateProject).toBeCalled();
      return result;
    });
  });
  describe("When a pull_request event from forked repo triggers the action", () => {
    beforeEach(() => {
      github.context.eventName = "pull_request";
      github.context.payload = {
        action: "opened",
        pull_request: {
          number: 1,
          head: {
            repo: {
              full_name: "owner/repo",
            },
          },
          base: {
            repo: {
              full_name: "forked/repo",
            },
          },
        },
      };
    });
    it("requests nothing to RTD", async () => {
      const f: () => Promise<void> = jest.fn();
      const result = await run(
        function (a: string) {
          return "";
        },
        f,
        f
      );
      expect(f).not.toBeCalled();
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
            repo: {
              full_name: "owner/repo",
            },
          },
          base: {
            repo: {
              full_name: "owner/repo",
            },
          },
        },
      };
    });

    it("marks the RTD version active", async () => {
      const f: () => Promise<void> = jest.fn();
      const activateProject: () => Promise<void> = jest.fn();
      const result = await run(getInput, activateProject, f);
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
