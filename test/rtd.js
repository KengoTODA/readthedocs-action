require('dotenv').config()

const assert = require('assert');
const assuming = require('mocha-assume').assuming;
const bunyan = require('bunyan');
const RTD = require('../lib/rtd.js').default;

const timeout = 15 * 1000;

describe('rtd', function() {
  this.timeout(timeout);

  describe('#enableBuild()', () => {
    const configured = !!process.env.RTD_USERNAME && !!process.env.RTD_PASSWORD;
    assuming(configured).it('should return true if branch is already activated', done => {
      const rtd = new RTD(bunyan.createLogger({name: "test"}));
      rtd.enableBuild('your-read-the-docs-project', 'master')
         .then(enabled => {
           assert.ok(!enabled);
           done();
         })
         .catch(done);
    });
  });

  describe('#escape()', () => {
    it('replaces "/" with "-"', () => {
      const result = RTD.escape("dependabot/npm_and_yarn/foobar");
      assert.equal(result, "dependabot-npm_and_yarn-foobar");
    });
    it('throws error if ? exists in text', () => {
      assert.throws(() => {
        RTD.escape("what-is-this?");
      }, Error, 'name should not contains ? mark, but it was "what-is-this?"');
    });
    it('does nothing otherwise', () => {
      const result = RTD.escape("branch-name");
      assert.equal(result, "branch-name");
    });
  });

  describe('#getProject()', () => {
    it('returns correct ID', async () => {
      const result = await RTD.getProject('your-read-the-docs-project');
      assert.equal(result.id, 235403);
      assert.equal(result.language, 'en');
    });
    it('returns rejected promise for not existing project', async () => {
      return RTD.getProject('not-existing').then(
        () => Promise.reject(new Error('Expected method to reject.')),
        err => assert(err instanceof Error)
      );
    });
  });

  describe('#getTranslates()', () => {
    it('returns single translate', async () => {
      const result = await RTD.getTranslates({
        id: 235403,
        language: 'en',
        slug: 'your-read-the-docs-project'
      });
      assert.deepEqual(result, [{
        id: 235403,
        language: 'en',
        slug: 'your-read-the-docs-project'
      }]);
    });
    it('returns multiple translates', async () => {
      const result = await RTD.getTranslates({
        id: 79934,
        language: 'en',
        slug: 'spotbugs-in-kengo-toda'
      });
      assert.deepEqual(result, [{
        id: 79934,
        language: 'en',
        slug: 'spotbugs-in-kengo-toda'
      },{
        id: 79941,
        language: 'ja',
        slug: 'spotbugs-in-kengo-toda-ja'
      }]);
    });
  });
});
