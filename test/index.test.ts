import { describe, it } from "mocha";

describe("Integration Test", () => {
  describe("When a push event triggers the action", () => {
    it("requests nothing to RTD");
    it("changes nothing in the GitHub PR");
  });
  describe("When a pull_request.closed event triggers the action", () => {
    it("marks the RTD version inactive");
  });
  describe("When other pull_request events trigger the action", () => {
    describe("If no document is updated", () => {
      it("requests nothing to RTD");
      it("changes nothing in the GitHub PR");
    });
    describe("If document files are updated", () => {
      it("marks the RTD version active");
      describe("If PR body contains links to RTD", () => {
        it("changes nothing in the GitHub PR");
      });
      describe("If PR body contains no link to RTD", () => {
        it("adds links to RTD into the PR body");
      });
    });
  });
});
