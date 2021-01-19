import * as github from "@actions/github";

describe("Integration Test", () => {
  describe("When a push event triggers the action", () => {
    beforeEach(() => {
      github.context.eventName = "push";
    });
    test.todo("requests nothing to RTD");
    test.todo("changes nothing in the GitHub PR");
  });
  describe("When a pull_request.closed event triggers the action", () => {
    beforeEach(() => {
      github.context.eventName = "pull_request";
    });
    test.todo("marks the RTD version inactive");
  });
  describe("When other pull_request events trigger the action", () => {
    describe("If no document is updated", () => {
      test.todo("requests nothing to RTD");
      test.todo("changes nothing in the GitHub PR");
    });
    describe("If document files are updated", () => {
      test.todo("marks the RTD version active");
      describe("If PR body contains links to RTD", () => {
        test.todo("changes nothing in the GitHub PR");
      });
      describe("If PR body contains no link to RTD", () => {
        test.todo("adds links to RTD into the PR body");
      });
    });
  });
});
