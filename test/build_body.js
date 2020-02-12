const assert = require('assert');
const buildBody = require('../src/build_body').default;

describe('#buildBody()', () => {
  it('adds single URL for project without treanslation', () => {
    const result = buildBody("body", "project", "branch", ["en"]);
    assert.equal(result, "body\n\n[//]: # (rtdbot-start)\n\n" +
        "URL of RTD document: https://project.readthedocs.io/en/branch/ ![Documentation Status](https://readthedocs.org/projects/project/badge/?version=branch)\n\n" +
        "[//]: # (rtdbot-end)\n");
  });
  it('adds multiple URLs for project with treanslation', () => {
    const result = buildBody("body", "project", "branch", ["en", "ja"]);
    assert.equal(result, "body\n\n[//]: # (rtdbot-start)\n\nURL of RTD documents:\nen: https://project.readthedocs.io/en/branch/\nja: https://project.readthedocs.io/ja/branch/\n\n[//]: # (rtdbot-end)\n");
  });
  it('does not add URL if given body already contains it', () => {
    let result = buildBody("body", "project", "branch", ["en"]);
    result = buildBody(result, "project", "branch", ["en"]);
    assert.equal(result, "body\n\n[//]: # (rtdbot-start)\n\n" +
        "URL of RTD document: https://project.readthedocs.io/en/branch/ ![Documentation Status](https://readthedocs.org/projects/project/badge/?version=branch)\n\n" +
        "[//]: # (rtdbot-end)\n");
  });
});
