const assert = require('assert');
const escape = require('../lib/escape.js').default;

describe('#escape()', () => {
  it('replaces "/" with "-"', () => {
    const result = escape("dependabot/npm_and_yarn/foobar");
    assert.equal(result, "dependabot-npm_and_yarn-foobar");
  });
  it('throws error if ? exists in text', () => {
    assert.throws(() => {
      escape("what-is-this?");
    }, Error, 'name should not contains ? mark, but it was "what-is-this?"');
  });
  it('does nothing otherwise', () => {
    const result = escape("branch-name");
    assert.equal(result, "branch-name");
  });
});
