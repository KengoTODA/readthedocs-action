const assert = require("assert");
const { Project } = require("../src/rtd");
const buildBody = require("../src/build_body").default;

describe("#buildBody()", () => {
  it("adds single URL for project without treanslation", () => {
    const result = buildBody(
      "body",
      [new Project(1, "en", "project")],
      "branch"
    );
    assert.equal(
      result,
      "body\n\n[//]: # (rtdbot-start)\n\n" +
        "URL of RTD document: https://project.readthedocs.io/en/branch/ ![Documentation Status](https://readthedocs.org/projects/project/badge/?version=branch)\n\n" +
        "[//]: # (rtdbot-end)\n"
    );
  });
  it("adds multiple URLs for project with treanslation", () => {
    const result = buildBody(
      "body",
      [new Project(1, "en", "project"), new Project(2, "ja", "project")],
      "branch"
    );
    assert.equal(
      result,
      "body\n\n[//]: # (rtdbot-start)\n\nURL of RTD documents:\nen: https://project.readthedocs.io/en/branch/\nja: https://project.readthedocs.io/ja/branch/\n\n[//]: # (rtdbot-end)\n"
    );
  });
  it("does not add URL if given body already contains it", () => {
    const prev = buildBody("body", [new Project(1, "en", "project")], "branch");
    const result = buildBody(prev, [new Project(1, "en", "project")], "branch");
    assert.equal(
      result,
      "body\n\n[//]: # (rtdbot-start)\n\n" +
        "URL of RTD document: https://project.readthedocs.io/en/branch/ ![Documentation Status](https://readthedocs.org/projects/project/badge/?version=branch)\n\n" +
        "[//]: # (rtdbot-end)\n"
    );
  });
});
